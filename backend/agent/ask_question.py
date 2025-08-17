import os
from datetime import datetime
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, RetrievalQA
from langchain.chat_models import ChatOpenAI

script_dir = os.path.dirname(os.path.abspath(__file__))               
chroma_db_path = os.path.join(script_dir, "..", "chroma_db", "database")  

embedding = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")

vectorstore = Chroma(
    persist_directory=chroma_db_path,
    embedding_function=embedding,
)
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
chatbot_prompt = PromptTemplate.from_template(
    """
You are a helpful assistant. Answer the following question as accurately as possible.

Question:
{question}

Provide a clear and concise answer.
"""
)

context_prompt = PromptTemplate.from_template(
    """
You are a knowledgeable assistant. Use the following extracted content snippets to answer the question as accurately as possible.

Context:
{context}

Question:
{question}

Base your response on the provided context and supplement with your own knowledge where appropriate.
"""
)

llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    temperature=0.4,
    # openai_api_key="your-api-key-here",
)
#Chat-Mode
chatbot_chain = LLMChain(
    llm=llm,
    prompt=chatbot_prompt
)
#MultiMedia-Mode
retrieval_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",                 
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={"prompt": context_prompt}
)
#optional source location formatter
def format_time(seconds: float) -> str:
    minutes = int(seconds) // 60
    secs = int(seconds) % 60
    return f"{minutes:02}:{secs:02}"

def generate_response(query: str, multimode: bool = True) -> dict:
    """
    If multimode=True: run RAG (retrieve + answer with context)
    Else: run a plain chat LLM chain.
    Returns a dict with 'answer' and 'sources'.
    """
    
    # Log checkpoint for multimode status
    print(f"Checkpoint: multimode = {multimode}")
    
    if multimode:
        print("Checkpoint: Reading from database...")

        result = retrieval_chain({"query": query})
        answer = result.get("result") or result.get("answer")
        docs = result.get("source_documents", [])

        print(f"Checkpoint: Source documents: {len(docs)}") #optional

        sources = []
        for doc in docs:
            meta = doc.metadata or {}
            start = meta.get("start", 0)
            sources.append({
                "text": doc.page_content.strip(),
                "time": format_time(start) if start else "",
                "metadata": meta
            })

        return {"answer": answer, "sources": sources}

    else:
        print("Checkpoint: Using plain chat model...")
        response = chatbot_chain.run({"question": query})
        return {"answer": response, "sources": []}
