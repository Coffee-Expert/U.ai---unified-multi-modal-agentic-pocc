#Step 1: Extracting Audio from the video file.
import ffmpeg

def extract_audio(video_path, audio_path):
    try:
        ffmpeg.input(video_path).output(audio_path).run(overwrite_output=True)
        print(f"✅ Audio extracted to {audio_path}  ")
    except ffmpeg.Error as e:
        print("FFmpeg error:", e)
