class ContextManager:
    def __init__(self):
        self.contexts = {}

    def get(self, workflow_id, key):
        return self.contexts.get(workflow_id, {}).get(key)

    def set(self, workflow_id, key, value):
        if workflow_id not in self.contexts:
            self.contexts[workflow_id] = {}
        self.contexts[workflow_id][key] = value

    def get_context(self, workflow_id):
        return self.contexts.get(workflow_id, {})
