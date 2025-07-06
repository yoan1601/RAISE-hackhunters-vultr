

class Message:
    def __init__(self, sender, receiver, content, workflow_id=None, metadata=None):
        self.sender = sender
        self.receiver = receiver
        self.content = content
        self.workflow_id = workflow_id
        self.metadata = metadata or {}  # default to empty dict if None

    def __repr__(self):
        return (
            f"Message(from={self.sender}, to={self.receiver}, content={self.content}, "
            f"workflow_id={self.workflow_id}, metadata={self.metadata})"
        )
