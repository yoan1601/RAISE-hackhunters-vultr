class MessageBus:
    def __init__(self):
        self.agents = {}

    def register(self, agent_name, agent_instance):
        self.agents[agent_name] = agent_instance

    def send(self, message):
        receiver = self.agents.get(message.receiver)
        if receiver:
            receiver.receive(message)
        else:
            print(f"[MessageBus] Agent '{message.receiver}' not found.")
