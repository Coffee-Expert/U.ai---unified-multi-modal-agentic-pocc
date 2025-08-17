import os
import whisper

# Load the Whisper model once at import time so subsequent calls are fast
_whisper_model = whisper.load_model("base")

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe the audio file at `audio_path` to text.

    Args:
        audio_path (str): Path to an audio file (wav, mp3, etc.)

    Returns:
        str: The transcribed text.

    Raises:
        FileNotFoundError: If the file does not exist.
        RuntimeError: If Whisper fails to transcribe.
    """
    # 1) Ensure the file exists
    if not os.path.isfile(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    # 2) Perform transcription
    try:
        result = _whisper_model.transcribe(audio_path)
    except Exception as err:
        # Wrap any underlying error for clarity
        raise RuntimeError(f"Whisper transcription failed: {err}") from err

    # 3) Extract and return clean text
    return result.get("text", "").strip()
