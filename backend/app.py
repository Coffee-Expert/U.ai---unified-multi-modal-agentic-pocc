from flask import Flask, request, jsonify
import os
import shutil
import traceback
from werkzeug.utils import secure_filename
from flask_cors import CORS
from audio_processing.extract_audio import extract_audio
from audio_processing.transcribe_whisper import transcribe_audio
from embed_text import embed_text  # new import for text/pdf embedding
from agent.ask_question import generate_response
from winrmssh import process_audio_and_execute
from patch_mag.workflows.patch_flow import build_patch_graph

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Upload folder setup
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CHROMA_DB_PATH = os.path.join('chroma_db', 'database')

# Allowed extensions
VIDEO_EXTS = {'.mp4', '.mkv'}
AUDIO_EXTS = {'.mp3'}
TEXT_EXTS = {'.txt', '.pdf'}


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)

    ext = os.path.splitext(filename)[1].lower()
    try:
        if ext in VIDEO_EXTS:
            audio_path = os.path.splitext(file_path)[0] + '_audio.wav'
            extract_audio(file_path, audio_path)
            transcription = transcribe_audio(audio_path)
            return jsonify({
                'type': 'video',
                'transcription': transcription
            }), 200

        elif ext in AUDIO_EXTS:
            transcription = transcribe_audio(file_path)
            return jsonify({
                'type': 'audio',
                'transcription': transcription
            }), 200

        elif ext in TEXT_EXTS:
            # embed_text now returns a list of dicts
            docs = embed_text(
                file_path,
                persist_directory=os.path.join('chroma_db', 'database')
            )
            return jsonify({
                'type': 'text',
                'documents': docs,
                'count': len(docs)
            }), 200

        else:
            return jsonify({'error': f'Unsupported file type: {ext}'}), 400

    except Exception as e:
        # log full traceback if needed
        return jsonify({'error': str(e)}), 500

        
@app.route('/ask', methods=['POST'])
def ask_question():
    # Audio-execution path remains unchanged
    if 'audio' in request.files:
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'Empty audio filename'}), 400

        host     = request.form.get('host', '').strip()
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        if not (host and username and password):
            return jsonify({'error': 'Missing host, username, or password'}), 400

        filename   = secure_filename(audio_file.filename)
        audio_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        audio_file.save(audio_path)

        result = process_audio_and_execute(audio_path, host, username, password)
        return jsonify(result), 200

    # JSON chat path
    data = request.get_json() or {}
    query     = data.get('query', '').strip()
    # pick up your boolean flag here
    multimode = bool(data.get('multimode', True))

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    # Pass multimode into your generator
    result = generate_response(query, multimode=multimode)
    return jsonify(result), 200


@app.route('/patch', methods=['POST'])
def patch_machine():
    """
    Accepts JSON:
      {
        "host": "IP_ADDRESS",
        "username": "user",
        "password": "pass",
        "os": "windows" | "linux" | "mac"
      }
    Invokes the patch flow and returns the result.
    """
    data = request.get_json() or {}
    required_keys = {'host', 'username', 'password', 'os'}

    if not required_keys.issubset(data.keys()):
        return jsonify({'error': 'Missing required VM fields'}), 400

    try:
        vm = {
            "host": data['host'],
            "username": data['username'],
            "password": data['password'],
            "os": data['os'].lower()
        }

        print("🔥 Triggering patch flow for", vm["host"])

        # Build and run patch flow
        flow = build_patch_graph()
        result = flow.invoke({
            "vm_info": vm,
            "update_status": "",
            "reboot_updates": [],
            "no_reboot_updates": [],
            "log": ["🚀 Patch flow triggered."]
        })

        return jsonify({
    "log": result["log"],
    "meta": f"🔥 Triggering patch flow for {vm['host']}"
}), 200


    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process_audio', methods=['POST'])
def process_audio_route():
    """
    Accepts multipart/form-data with:
      - 'audio': the recorded WAV file
      - 'text': optional user instruction
      - 'host', 'username', 'password': machine credentials

    Returns JSON: { transcription, command, output }
    """
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file part'}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400

    host = request.form.get('host', '').strip()
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()
    user_text = request.form.get('text', '').strip() or None

    if not (host and username and password):
        return jsonify({'error': 'Missing host, username, or password'}), 400

    filename = secure_filename(audio_file.filename)
    audio_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    audio_file.save(audio_path)

    result = process_audio_and_execute(audio_path, host, username, password, user_text)
    return jsonify(result), 200


@app.route('/clear', methods=['POST'])
def clear_chroma_db():
    try:
        if os.path.exists(CHROMA_DB_PATH):
            shutil.rmtree(CHROMA_DB_PATH)
            print(f"✅ Deleted Chroma DB at: {CHROMA_DB_PATH}")
            return jsonify({"message": "Chroma DB cleared"}), 200
        else:
            print(f"⚠️ Chroma DB not found at: {CHROMA_DB_PATH}")
            return jsonify({"message": "No Chroma DB found"}), 404
    except Exception as e:
        traceback.print_exc()  # Log full traceback in console
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


