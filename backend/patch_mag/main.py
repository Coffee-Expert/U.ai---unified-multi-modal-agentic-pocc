from workflows.patch_flow import build_patch_graph

# VM Info (replace with your actual VM credentials)
vm = {
    "host": "13.60.203.18",
    "username": "Administrator",
    "password": "hVCxR?NET4wtnKCGrPxVx4nn!JAeoIZF",
    "os": "windows"
}

# Build the flow and run it
flow = build_patch_graph()
flow.invoke({
    "vm_info": vm,
    "update_status": "",
    "reboot_updates": [],
    "no_reboot_updates": []
})