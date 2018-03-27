from .AssociativeMap import *

class AssociativeChain:

    def __init__(self):
        self.map = AssociativeMap()
        self.arrs = []
        self.prev = None

    def append(self,arr):
        if(len(self.arrs)):
            self.map.set(self.arrs[-1],arr)
        self.arrs.append(arr)

    def next(self,arr = None):
        next = self.map.get(self.prev or arr or self.arrs[-1])
        self.prev = next
        return next