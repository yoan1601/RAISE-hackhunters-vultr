class WorkflowCoordinator:
    def __init__(self, state_store):
        self.state_store = state_store

    def update_stage(self, workflow_id, stage):
        self.state_store.save(workflow_id, {"stage": stage})
        print(f"[Workflow] Stage updated to {stage}")
