class Message:
    def __init__(self, sender, receiver, content, workflow_id="default"):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.workflow_id = workflow_id

    def __repr__(self):
        return f"Message(from={self.sender}, to={self.receiver}, content={self.content}, workflow_id={self.workflow_id})"
