from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)

class Chat(Base):
    __tablename__ = "chats"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True)
    message = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User")

    
