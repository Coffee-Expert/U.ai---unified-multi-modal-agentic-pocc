from langgraph.graph import StateGraph
from typing import TypedDict
import winrm
import json

class PatchAgentState(TypedDict):
    vm_info: dict
    update_status: str
    reboot_updates: list
    no_reboot_updates: list
    log: list[str]  # log to return to frontend


def check_updates(state: PatchAgentState) -> PatchAgentState:
    vm = state["vm_info"]
    state["log"].append(f" Checking for updates on {vm['host']}...")

    try:
        session = winrm.Session(vm["host"], auth=(vm["username"], vm["password"]), transport='ntlm')

        ps_script = """
        Import-Module PSWindowsUpdate
        Get-WindowsUpdate -MicrosoftUpdate | Select Title, KB, RebootRequired | ConvertTo-Json
        """

        result = session.run_ps(ps_script)
        output = result.std_out.decode().strip()

        if not output:
            state["log"].append("⚠️ No output from Get-WindowsUpdate.")
            state["update_status"] = "up-to-date"
            return state

        updates = json.loads(output)
        if isinstance(updates, dict):
            updates = [updates]

        reboot_required = [u for u in updates if u.get("RebootRequired")]
        no_reboot = [u for u in updates if not u.get("RebootRequired")]

        state["log"].append(f" Found {len(updates)} updates.")
        state["log"].append(f" Reboot-required updates: {len(reboot_required)}")
        state["log"].append(f" No-reboot updates: {len(no_reboot)}")

        state["reboot_updates"] = reboot_required
        state["no_reboot_updates"] = no_reboot
        state["update_status"] = "updates found"
    except Exception as e:
        state["log"].append(f"❌ Exception in check_updates: {e}")
        state["update_status"] = "error"

    return state


def install_non_reboot_updates(state: PatchAgentState) -> PatchAgentState:
    if not state["no_reboot_updates"]:
        state["log"].append("✅ No updates to install that don't require a reboot.")
        return state

    vm = state["vm_info"]
    state["log"].append(f"⬇ Installing non-reboot updates on {vm['host']}...")

    try:
        session = winrm.Session(vm["host"], auth=(vm["username"], vm["password"]), transport='ntlm')
        result = session.run_cmd("powershell.exe", [
            "Get-WindowsUpdate | Where-Object {!$_.RebootRequired} | Install-WindowsUpdate -AcceptAll -AutoReboot:$false"
        ])
        state["log"].append("Install Output:\n" + result.std_out.decode().strip())
    except Exception as e:
        state["log"].append(f"❌ Failed to install non-reboot updates: {e}")
    return state


def prompt_user(state: PatchAgentState) -> PatchAgentState:
    if not state["reboot_updates"]:
        state["log"].append("✅ No reboot-required updates.")
        return state

    # Simulate acceptance (no real user prompt in backend)
    state["log"].append("⚠️ Some updates require reboot. Proceeding with reboot-required updates...")
    state["update_status"] = "user_accepted"
    return state


def install_reboot_updates(state: PatchAgentState) -> PatchAgentState:
    if state["update_status"] == "user_declined":
        state["log"].append(" User declined reboot-required updates.")
        return state

    if not state["reboot_updates"]:
        state["log"].append("✅ No reboot-required updates to install.")
        return state

    vm = state["vm_info"]
    state["log"].append(f"⬇ Installing reboot-required updates on {vm['host']}...")

    try:
        session = winrm.Session(vm["host"], auth=(vm["username"], vm["password"]), transport='ntlm')
        result = session.run_cmd("powershell.exe", [
            "Get-WindowsUpdate | Where-Object {$_.RebootRequired} | Install-WindowsUpdate -AcceptAll -AutoReboot"
        ])
        state["log"].append(" Reboot Update Output:\n" + result.std_out.decode().strip())
        state["update_status"] = "all updates installed"
    except Exception as e:
        state["log"].append(f"❌ Failed to install reboot-required updates: {e}")

    return state


def build_patch_graph():
    graph = StateGraph(PatchAgentState)

    graph.add_node("check_updates", check_updates)
    graph.add_node("install_non_reboot_updates", install_non_reboot_updates)
    graph.add_node("prompt_user", prompt_user)
    graph.add_node("install_reboot_updates", install_reboot_updates)

    graph.set_entry_point("check_updates")
    graph.add_edge("check_updates", "install_non_reboot_updates")
    graph.add_edge("install_non_reboot_updates", "prompt_user")
    graph.add_edge("prompt_user", "install_reboot_updates")

    return graph.compile()
