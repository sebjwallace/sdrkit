from math import floor
from random import randint

class SDR:

    def __init__(self):
        self.indices = []
        self.range = 256

    def random(self,size = 8):
        self.indices = []
        r = self.range / size
        for i in range(size):
            self.indices.append(int((r*i)+randint(0,r)))

    def union(self,arrs):
        return sum(arrs,self.indices)

    def overlap(self,arr):
        return [i for i in self.indices if i in arr]

    def subtract(self,arr):
        return [i for i in self.indices if i not in arr]

    def difference(self,arr):
        return [i for i in self.indices + arr if i not in self.overlap(arr)]

    def subsample(self,size = 8):
        indices = sorted(list(self.indices))
        out = []
        for i in range(size):
            out.append(indices[i*floor(len(indices)/size)])
        return out

    def match(self,arrs):
        return self.sort(arrs)[-1]

    def sort(self,arrs):
        return sorted(arrs,key=lambda arr: self.overlap(arr))

    def toBinaryArray(self):
        arr = [0] * self.range
        for index in self.indices:
            arr[index] = 1
        return arr

    def fromBinaryArray(self,arr):
        self.indices = []
        for i, b in enumerate(arr):
            if(b == 1):
                self.indices.append(i)