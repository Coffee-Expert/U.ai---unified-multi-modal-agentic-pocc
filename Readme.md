# U.AI – Unified AI Taskforce  
### Video Captioning + Semantic Search Agent (RAG + Multimodal AI POC)  
by: **Abhishek Kevin Gomes**  

---

## Overview  

**U.AI (Unified AI Taskforce)** is a **multimodal AI system** designed to unify information retrieval, command execution, and patch management into a single intelligent interface.  

It demonstrates how multiple agents can be orchestrated together to handle:  

- Video → Knowledge pipeline (transcription + semantic search)  
- Audio & PDF semantic chat agent (RAG for documents)  
- Voice-driven command execution (safe demo environment)  
- Patch management assistant (mock showcase)  
- Unified multimodal interface (voice, text, video, audio, image)  

---

## Tech Stack  

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python" />
  <img src="https://img.shields.io/badge/OpenAI-API-lightgrey?style=for-the-badge&logo=openai" />
  <img src="https://img.shields.io/badge/Whisper-Transcription-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/LangChain-RAG-orange?style=for-the-badge&logo=chainlink" />
  <img src="https://img.shields.io/badge/ChromaDB-VectorDB-yellow?style=for-the-badge" />
  <img src="https://img.shields.io/badge/HuggingFace-MiniLM-red?style=for-the-badge&logo=huggingface" />
  <img src="https://img.shields.io/badge/PyPDF-Parser-lightblue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FFmpeg-Media-black?style=for-the-badge" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-teal?style=for-the-badge&logo=fastapi" />
</p>  

---

## Features  

### 1. Video Captioning + Semantic Search  
- Extract audio with **FFmpeg**  
- Transcribe via **OpenAI Whisper**  
- Embed with **HuggingFace MiniLM**  
- Store in **ChromaDB** for semantic Q&A  

### 2. PDF & Audio Chat Agent  
- Parse PDFs with **PyPDF**  
- Transcribe audio → text  
- Store embeddings in **ChromaDB**  
- Provide contextual answers with **GPT**  

### 3. Voice → Command Execution  
- Record or type queries  
- Interpret with **GPT**  
- Execute with **mock safe outputs**  

### 4. Patch Management Agent  
- AI-powered patch recommendations  
- System diagnostics + remediation demo  

---

## Architecture  

```
         ┌──────────────┐
         │   Frontend   │
         │ (Web + Voice)│
         └──────┬───────┘
                │
      ┌─────────▼──────────┐
      │   Backend API      │
      │   (FastAPI)        │
      └─────────┬──────────┘
                │ 
  ┌─────────────┴─────────────┐
  │         AI Agents         │
  │ • RAG Search Agent        │
  │ • Executor Agent          │
  │ • Patch Specialist Agent  │
  │ • Multimodal Orchestrator │
  └─────────────┬─────────────┘
                │
    ┌───────────▼───────────┐
    │   Knowledge Stores    │
    │ (ChromaDB, PDFs,      │
    │  Audio, Video)        │
    └───────────────────────┘
```

---

## Real-World Use Cases  

- **Enterprise IT Operations** – automate patching + system checks  
- **Knowledge Management** – searchable transcripts of training/videos  
- **DevOps & SecOps** – AI-driven patch/security suggestions  
- **Content Accessibility** – captions + semantic search  
- **Unified AI Assistant** – multimodal collaboration for teams  

---

## Screenshots  

<p align="center">
  <img src="https://github.com/user-attachments/assets/ab237c64-670c-4d3e-95a0-c61c22d9b6e0" width="80%" />
  <img src="https://github.com/user-attachments/assets/95a129c7-b69c-495e-b190-fc30591ef40d" width="80%" />
  <img src="https://github.com/user-attachments/assets/aadf8708-eb9c-4b8d-a3b7-98eb07eec3fd" width="80%" />
  <img src="https://github.com/user-attachments/assets/ed940a3a-1d68-4087-a029-45c57adf0295" width="80%" />
  <img src="https://github.com/user-attachments/assets/616eb286-ec25-455c-978c-52665a0225b3" width="80%" />
  <img src="https://github.com/user-attachments/assets/1ad106e8-114d-46d9-a68a-93b6669c401b" width="80%" />
</p>  

---

## Setup  

### 1. Clone Repository  
```bash
git clone https://github.com/your-username/u.ai.git
cd u.ai
````

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create a `.env` file:

```bash
OPENAI_API_KEY=your-key
```

### 4. Run Backend

```bash
python app.py
```

---

## Notes

* Demo project only — executor + patching agents are **mock/safe**
* API keys are excluded (load them via `.env`)
