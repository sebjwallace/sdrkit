from .SDR import *
from .SDRMap import *

class SDRClassifier:

    def __init__(self,size=8,threshold=0.8):
        self.map = SDRMap(size=size,threshold=threshold)
        self.patterns = []

    def get(self,arr):
        out = self.map.get(arr)
        if(len(out) == 0):
            self.patterns.append(arr)
            sdr = SDR(2048)
            self.map.set(arr,sdr.indices)
            out = sdr.indices
        return out