import json
import os
import whisper
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings

def transcribe_audio(audio_path, json_path="output_audio.json"):
    # === Step 2.1: Transcribe using Whisper module  ===
    if not os.path.exists(json_path):
        print("🔊 Running Whisper transcription...")
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=4)
    else:
        print("📁 Found existing Whisper JSON")

    # === Step 2.2: Load and process JSON ===
    with open(json_path, "r", encoding="utf-8") as f:
        whisper_data = json.load(f)

    segments = whisper_data.get("segments", [])
    chunk_char_len, chunk_overlap = 700, 100
    documents = []

    def split_text(segment):
        text = segment["text"].strip()
        duration = segment["end"] - segment["start"]
        if len(text) <= chunk_char_len:
            return [Document(page_content=text, metadata={"start": segment["start"], "end": segment["end"]})]

        time_per_char = duration / len(text)
        chunks = []
        for i in range(0, len(text), chunk_char_len - chunk_overlap):
            chunk_text = text[i:i+chunk_char_len]
            est_start = segment["start"] + i * time_per_char
            est_end = segment["start"] + min(i+chunk_char_len, len(text)) * time_per_char
            chunks.append(Document(page_content=chunk_text.strip(), metadata={"start": est_start, "end": est_end}))
        return chunks

    for segment in segments:
        documents.extend(split_text(segment))

    # === Step 2.3: Store in ChromaDB ===
    embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    
    # Create the Chroma vector store with persistence
    vectorstore = Chroma.from_documents(
    documents,
    embedding,
    persist_directory="chroma_db/database"  # Specify your desired directory
)
    print(f"✅ {len(documents)} timestamped chunks stored in ChromaDB!")



