# agents/marketing_agent.py

from mcp.message import Message
from groq import Groq
import os
class MarketingAgent:
    def __init__(self, name, bus, context_manager):
        self.name = name
        self.bus = bus
        self.context = context_manager
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))  # Your key
        self.model_id = "llama-3.3-70b-versatile"

    def generate_campaign_plan(self, prompt):
        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating campaign: {str(e)}"

    def receive(self, message):
        print(f"[{self.name}] Received: {message.content} from {message.sender}")

        if message.content == "start_campaign":
            self.context.set(message.workflow_id, "stage", "marketing_started")
            prompt = "Create a creative marketing campaign for launching a new AI-based product."
            campaign = self.generate_campaign_plan(prompt)
            print(f"[{self.name}] Campaign Plan:\n{campaign}\n")

            new_msg = Message(
                sender=self.name,
                receiver="SalesAgent",
                content="generate_sales_leads",
                workflow_id=message.workflow_id
            )
            self.bus.send(new_msg)

        elif "design_ready" in message.content:
            idea = message.content.split("design_ready:")[-1].strip()
            self.context.set(message.workflow_id, "stage", "marketing_idea_received")

            print(f"[{self.name}] Creating marketing plan for: {idea}")
            campaign = self.generate_campaign_plan(f"Create a marketing campaign for the product idea: {idea}")
            print(f"[{self.name}] Campaign Plan:\n{campaign}\n")

            new_msg = Message(
                sender=self.name,
                receiver="SalesAgent",
                content=f"marketing_done: {idea}",
                workflow_id=message.workflow_id
            )
            self.bus.send(new_msg)
