from .SDR import *
from .SDRMap import *

class SDRClassifier:

    def __init__(self,size = 8):
        self.map = SDRMap(size)

    def get(self,arr):
        out = self.map.get(arr)
        if(len(out) == 0):
            sdr = SDR(2048)
            self.map.set(arr,sdr.indices)
            out = sdr.indices
        return out