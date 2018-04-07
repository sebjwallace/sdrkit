from .SDR import *
from .SDRMap import *

class SDRDictionary:

    def __init__(self):
        self.map = SDRMap()
        self.dict = {}
        self.mirrorDict = {}
        self.secondKeys = []

    def set(self,key,value):
        secondKey = SDR(range=2048).indices
        self.secondKeys.append(secondKey)
        self.map.set(key,secondKey)
        self.dict[','.join(map(str,secondKey))] = value
        self.mirrorDict[value] = key
        return key

    def get(self,key):

        if(type(key) is str):
            return self.mirrorDict[key]

        secondKey = self.map.get(key)
        if(len(secondKey) > 8):
            values = []
            for k in self.secondKeys:
                overlap = SDR.Overlap(k,secondKey)
                if(len(overlap) >= 8):
                    values.append(self.dict.get(','.join(map(str,overlap))))
            return values
        return self.dict.get(','.join(map(str,secondKey)))