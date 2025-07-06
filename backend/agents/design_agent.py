from mcp.message import Message
from groq import Groq
import os
class DesignAgent:
    def __init__(self, name, bus, context_manager):
        self.name = name
        self.bus = bus
        self.context = context_manager
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model_id = "llama-3.3-70b-versatile"

    def generate_design(self, prompt):
        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"DesignAgent Error: {str(e)}"

    def receive(self, message):
        print(f"[{self.name}] Received: {message.content} from {message.sender}")

        if message.content == "start_design":
            # Extract idea from metadata
            idea = message.metadata.get("idea", "unknown idea")
            print(f"[{self.name}] Designing product: {idea}")

            # Set context
            self.context.set(message.workflow_id, "stage", "designing")

            # Call Groq API
            result = self.generate_design(f"Design a product based on the idea: {idea}")
            print(f"[{self.name}] Design output:\n{result}\n")

            # Send message to MarketingAgent
            new_msg = Message(
                sender=self.name,
                receiver="MarketingAgent",
                content="design_ready",
                workflow_id=message.workflow_id,
                metadata={"idea": idea, "design": result}
            )
            self.bus.send(new_msg)
