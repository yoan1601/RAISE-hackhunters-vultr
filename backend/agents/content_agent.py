from mcp.message import Message


class ContentAgent:
    def __init__(self, name, bus, context_manager):
        self.name = name
        self.bus = bus
        self.context = context_manager

    def receive(self, message):
        print(f"[{self.name}] Received: {message.content} from {message.sender}")

        if message.content == "write_content_copy":
            self.context.set(message.workflow_id, "stage", "content_copy_written")
            print(f"[{self.name}] Content copy written.")

            # Notify SalesAgent or complete workflow
            new_msg = Message(
                sender=self.name,
                receiver="SalesAgent",
                content="finalize_sales_material",
                workflow_id=message.workflow_id
            )
            self.bus.send(new_msg)
