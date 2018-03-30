from .SDR import *
from .SDRMap import *

class SDRDictionary:

    def __init__(self):
        self.map = SDRMap()
        self.dict = {}

    def set(self,key,value):
        secondKey = SDR(2048).indices
        self.map.set(key,secondKey)
        self.dict[''.join(map(str,secondKey))] = value

    def get(self,key):
        secondKey = self.map.get(key)
        return self.dict.get(''.join(map(str,secondKey)))