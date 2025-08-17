import whisper
import socket
import winrm
import paramiko
from langchain.prompts import PromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain

# -------------------- Utility --------------------
def is_port_open(host: str, port: int, timeout: int = 3) -> bool:
    """Check if a given TCP port is open on the target host."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(timeout)
        try:
            sock.connect((host, port))
            return True
        except:
            return False

# -------------------- LangChain Setup --------------------
template = """
You are a helpful assistant. Convert the user's request into a valid {machine} command.
Note: If the command cannot be executed using WinRM or SSH, respond exactly with:
Cannot execute command: [brief reason here]

User request: {user_input}

Command:
"""
prompt = PromptTemplate(template=template, input_variables=["machine", "user_input"])
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0,
    # openai_api_key="your-api-key-here"
)
chain = LLMChain(llm=llm, prompt=prompt)

# -------------------- Whisper Setup --------------------
whisper_model = whisper.load_model("base")


def process_audio_and_execute(audio_path: str, host: str, username: str, password: str, user_text: str = None) -> dict:
    """
    Process voice or text command and execute on remote machine via WinRM or SSH.

    Args:
        audio_path (str): Path to uploaded audio file
        host (str): IP/hostname of target machine
        username (str): Auth username
        password (str): Auth password
        user_text (str, optional): If provided, overrides Whisper transcription

    Returns:
        dict: { transcription, command, output }
    """

    # 1) Transcribe if no user text
    transcription = ""
    if not user_text:
        transcription_result = whisper_model.transcribe(audio_path)
        user_text = transcription_result.get("text", "").strip()
        transcription = user_text
    else:
        transcription_result = whisper_model.transcribe(audio_path)
        transcription = transcription_result.get("text", "").strip()

    # Prepare default response
    response = {
        "transcription": transcription,
        "command": "",
        "output": ""
    }

    # 2) Determine execution method
    if is_port_open(host, 5985):
        machine = "Windows(Powershell)"
        command = chain.run({"machine": machine, "user_input": user_text})
        response["command"] = command

        if command.lower().startswith("cannot execute command"):
            return response

        try:
            session = winrm.Session(
                f"http://{host}:5985/wsman",
                auth=(username, password),
                transport="ntlm"
            )
            result = session.run_ps(command)
            response["output"] = (
                result.std_out.decode(errors="ignore")
                if result.status_code == 0
                else result.std_err.decode(errors="ignore")
            )
        except Exception as e:
            response["output"] = f"Error during WinRM execution: {e}"

    elif is_port_open(host, 22):
        machine = "SSH"
        command = chain.run({"machine": machine, "user_input": user_text})
        response["command"] = command

        if command.lower().startswith("cannot execute command"):
            return response

        try:
            ssh = paramiko.SSHClient()
            ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            ssh.connect(hostname=host, username=username, password=password, timeout=10)
            stdin, stdout, stderr = ssh.exec_command(command)
            out = stdout.read().decode(errors="ignore")
            err = stderr.read().decode(errors="ignore")
            response["output"] = out + err
            ssh.close()
        except Exception as e:
            response["output"] = f"Error during SSH execution: {e}"

    else:
        response["output"] = "Cannot establish connection: neither WinRM nor SSH port is open."

    return response
