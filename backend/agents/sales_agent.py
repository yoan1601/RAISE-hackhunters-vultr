# agents/sales_agent.py

from groq import Groq
import os


class SalesAgent:
    def __init__(self, name, bus, context_manager):
        self.name = name
        self.bus = bus
        self.context = context_manager
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))  # Replace with your actual key
        self.model_id = "llama-3.3-70b-versatile"

    def generate_sales_strategy(self, product_idea):
        prompt = f"""You're a professional sales strategist. Based on the product idea: "{product_idea}",
        suggest an effective sales pitch, potential client base, and distribution channels."""
        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"[SalesAgent Error]: {str(e)}"

    def receive(self, message):
        print(f"[{self.name}] Received: {message.content} from {message.sender}")

        if "marketing_done:" in message.content:
            product_idea = message.content.split("marketing_done:")[-1].strip()
            self.context.set(message.workflow_id, "stage", "sales_strategy")
            result = self.generate_sales_strategy(product_idea)
            print(f"[{self.name}] Sales Strategy:\n{result}\n")
