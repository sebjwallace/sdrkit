from .SDR import *
from .SDRMap import *
from .SDRDictionary import *

class SDRClassifier:

    def __init__(self,size=8,threshold=0.5):
        self.map = SDRMap(size=size,threshold=threshold)
        self.dict = SDRDictionary()
        self.patterns = []

    def get(self,arr,match=True):
        out = self.map.get(arr)

        # if there is not match
        if(len(out) == 0):
            self.patterns.append(arr)
            sdr = SDR(2048)
            self.map.set(arr,sdr.indices)
            out = sdr.indices
            self.dict.set(out,','.join(map(str, arr)))

        # if there is more than one match
        elif(len(out) > self.map.size and match == True):
            sdrs = [[int(x) for x in i.split(',')] for i in self.dict.get(out)]
            match = SDR.Match(arr,sdrs)
            out = self.map.get(match)

        return out