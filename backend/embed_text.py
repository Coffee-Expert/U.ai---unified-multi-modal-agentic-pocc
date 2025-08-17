import os
from typing import List, Dict
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_community.embeddings import SentenceTransformerEmbeddings
from PyPDF2 import PdfReader

def embed_text(
    file_path: str,
    persist_directory: str = "chroma_db",
    chunk_char_len: int = 1000,
    chunk_overlap: int = 200
) -> List[Dict]:
    """
    Read a text or PDF file, split into chunks, embed with SentenceTransformer,
    persist in ChromaDB (automatically), and return list of JSON-serializable dicts.
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    ext = os.path.splitext(file_path)[1].lower()
    if ext not in {'.txt', '.pdf'}:
        raise ValueError(f"Unsupported file type: {ext}")

    # 1) Read and prepare
    if ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            page_data = [(None, f.read())]
    else:
        reader = PdfReader(file_path)
        page_data = [
            (i + 1, page.extract_text() or "")
            for i, page in enumerate(reader.pages)
        ]

    # 2) Split into overlapping chunks
    def split_chunks(text: str):
        step = chunk_char_len - chunk_overlap
        return [
            text[i : i + chunk_char_len].strip()
            for i in range(0, len(text), step)
            if text[i : i + chunk_char_len].strip()
        ]

    # 3) Build Document objects
    documents = []
    for page_no, text in page_data:
        for idx, chunk in enumerate(split_chunks(text)):
            meta = {"chunk_index": idx}
            if page_no is not None:
                meta["page_number"] = page_no
            documents.append(Document(page_content=chunk, metadata=meta))

    # 4) Create & persist vectorstore in one go (no .persist() call needed)
    embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    _ = Chroma.from_documents(
        documents,
        embedding,
        persist_directory=persist_directory
    )
    print(f"✅ Stored {len(documents)} chunks in '{persist_directory}'")

    # 5) Return JSON-serializable dicts
    return [
        {"text": doc.page_content, "metadata": doc.metadata}
        for doc in documents
    ]
