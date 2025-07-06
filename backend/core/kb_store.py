class KBStore:
    def __init__(self):
        self.knowledge = {}

    def save(self, key, value):
        self.knowledge[key] = value
        print(f"[KB] Updated: {key} => {value}")
