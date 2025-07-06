from groq import Groq
import os


class SupportAgent:
    def __init__(self, name, bus, context_manager):
        self.name = name
        self.bus = bus
        self.context = context_manager
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model_id = "llama-3.3-70b-versatile"

    def handle_support_request(self, prompt):
        try:
            response = self.client.chat.completions.create(
                model=self.model_id,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"SupportAgent Error: {str(e)}"

    def receive(self, message):
        print(f"[{self.name}] Received: {message.content} from {message.sender}")

        self.context.set(message.workflow_id, "stage", "supporting")

        # Allow dynamic support queries or default to a standard case
        if message.content == "handle_support":
            prompt = "Handle a customer query about delivery delay and respond politely."
        else:
            prompt = message.content  # Custom user prompt or forwarded message

        result = self.handle_support_request(prompt)

        print(f"[{self.name}] Support Response:\n{result}\n")

        # Optional: Forward to another agent (e.g., notify marketing/sales)
        # msg = Message(sender=self.name, receiver="SalesAgent", content=result, workflow_id=message.workflow_id)
        # self.bus.send(msg)
