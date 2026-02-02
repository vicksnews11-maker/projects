from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User, Chat
import os
import openai
from passlib.context import CryptContext

app = FastAPI()
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register")
def register(username: str, password: str, db: Session = Depends(get_db)):
    hashed = pwd_context.hash(password)
    user = User(username=username, password=hashed)
    db.add(user)
    db.commit()
    return {"msg": "User created"}

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"msg": "Login successful"}

@app.post("/chat")
def chat(prompt: str, db: Session = Depends(get_db)):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role":"user","content":prompt}]
    )
    answer = response["choices"][0]["message"]["content"]
    chat = Chat(message=prompt, response=answer)
    db.add(chat)
    db.commit()
    return {"response": answer}
