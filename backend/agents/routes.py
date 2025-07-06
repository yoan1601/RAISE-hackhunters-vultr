# agent/routes.py
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class PromptRequest(BaseModel):
    prompt: str

@router.post("/chat")
def get_agent_response(data: PromptRequest):
    # Use your agent logic here (from core, mvp, etc.)
    response = f"Agent says: {data.prompt}"  # Placeholder
    return {"response": response}
