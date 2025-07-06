class StateStore:
    def __init__(self):
        self.db = {}

    def save(self, key, value):
        self.db[key] = value
        print(f"[DB] State saved: {key} => {value}")
