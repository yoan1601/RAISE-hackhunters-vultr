# agents/base_agent.py
import os
from dotenv import load_dotenv
from phi.agent import Agent as PhiAgent
from phi.model.groq import Groq

load_dotenv()


class BaseAgent:
    def __init__(self, name, system_prompt):
        self.model = Groq(
            id="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY")
        )
        self.agent = PhiAgent(
            name=name,
            model=self.model,
            system=system_prompt
        )

    def run(self, prompt):
        return self.agent.run(prompt)
