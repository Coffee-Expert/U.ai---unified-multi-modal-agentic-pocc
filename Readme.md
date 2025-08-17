# U.AI – Unified AI Taskforce  

### Video Captioning + Semantic Search Agent (RAG + Multimodal AI POC)  
by: **Abhishek Kevin Gomes**  

---

## Overview  

**U.AI (Unified AI Taskforce)** is a **multimodal AI system** designed to unify information retrieval, command execution, and patch management into a single intelligent interface.  

The project demonstrates how multiple agents can be orchestrated together to handle:  

- Video → Knowledge pipeline (transcription and semantic search)  
- Audio & PDF semantic chat agent (RAG for documents)  
- Voice-driven command execution (safe demo environment)  
- Patch management assistant (mock showcase)  
- Unified multimodal interface (voice, text, video, audio, image)  

---

## Tech Stack  

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-blue" />
  <img src="https://img.shields.io/badge/OpenAI-API-lightgrey" />
  <img src="https://img.shields.io/badge/Whisper-Transcription-green" />
  <img src="https://img.shields.io/badge/LangChain-RAG-orange" />
  <img src="https://img.shields.io/badge/ChromaDB-VectorDB-yellow" />
  <img src="https://img.shields.io/badge/HuggingFace-MiniLM-red" />
  <img src="https://img.shields.io/badge/PyPDF-Parser-lightblue" />
  <img src="https://img.shields.io/badge/FFmpeg-Media-black" />
  <img src="https://img.shields.io/badge/FastAPI-Backend-teal" />
</p>  

---

## Features  

### 1. Video Captioning + Semantic Search  
- Audio extracted from video using **FFmpeg**  
- Transcribed with **OpenAI Whisper**  
- Embedded via **HuggingFace MiniLM**  
- Stored in **ChromaDB** for semantic search and Q&A  

### 2. PDF & Audio Chat Agent  
- PDF → Parsed using **PyPDF**  
- Audio → Transcribed to text  
- Text embedded into **ChromaDB**  
- Queries answered contextually using **OpenAI GPT**  

### 3. Voice to Command Execution  
- User records or types a query  
- Backend interprets with **OpenAI GPT**  
- Executor responds with **mock command output** (safe showcase)  

### 4. Patch Management Specialist Agent  
- Simulated agent for patch recommendations and diagnostics  
- Demonstrates AI-driven IT operations assistance  

---

## Architecture  

             ┌──────────────┐
             │   Frontend   │
             │ (Web + Voice)│
             └──────┬───────┘
                    │
          ┌─────────▼──────────┐
          │   Backend API      │
          │   (FastAPI)        │
          └───────┬────────────┘
                  │
    ┌─────────────┴─────────────┐
    │         AI Agents          │
    │ • RAG Search Agent         │
    │ • Executor Agent           │
    │ • Patch Specialist Agent   │
    │ • Multimodal Orchestrator  │
    └─────────────┬─────────────┘
                  │
      ┌───────────▼───────────┐
      │   Knowledge Stores    │
      │  (ChromaDB, PDFs,     │
      │   Audio, Video)       │
      └───────────────────────┘




---

## Real-World Use Cases  

- **Enterprise IT Operations**  
  - Automate routine patching and system health checks.  
  - Use natural language or voice commands to execute safe administrative tasks.  

- **Knowledge Management**  
  - Convert corporate training videos into searchable transcripts.  
  - Enable semantic Q&A across internal PDFs, reports, and meeting recordings.  

- **DevOps & SecOps Assistance**  
  - AI-driven suggestions for security patches.  
  - Remote command execution with full traceability (safe mock demo in this project).  

- **Content Accessibility**  
  - Automatic captioning and indexing of video/audio for accessibility compliance.  
  - Search inside long-form content for key insights instantly.  

- **Unified AI Assistant for Teams**  
  - One interface that supports text, voice, video, and documents.  
  - Reduces tool fragmentation and improves collaboration.  

---

## Screenshots  

_Add screenshots here demonstrating the pipeline, UI, and agent interactions._  

---

## Demo Video  

_Add a short video or GIF walkthrough of U.AI in action (video captioning, PDF Q&A, voice query)._  

---

## Setup  

### 1. Clone Repository  
```bash
git clone https://github.com/your-username/u.ai.git
cd u.ai
```
### 2. Install Dependencies
```bash
pip install -r requirements.txt
```
### 3. Configure Environment

Create a .env file with your API keys:
```bash
OPENAI_API_KEY=your-key
```
### 4. Run Backend
```python
python app.py
```
### Notes: 

This project is for demonstration purposes only.

Certain features (executor, patching agent) are showcased in a mock/safe environment.

API keys and sensitive commands are excluded from this repository.

### Built by: Coffee-Expert