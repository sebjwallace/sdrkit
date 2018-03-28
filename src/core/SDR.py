from math import floor
from random import randint

class SDR:

    @staticmethod
    def Overlap(arr1,arr2):
        return [i for i in arr1 if i in arr2]

    @staticmethod
    def Union(arrs):
        return sum(arrs,[])

    @staticmethod
    def Subtract(arr1,arr2):
        return [i for i in arr1 if i not in arr2]

    @staticmethod
    def Difference(arr1,arr2):
        return [i for i in arr1 + arr2 if i not in SDR.Overlap(arr1,arr2)]

    def __init__(self):
        self.indices = []
        self.range = 2048
        self.random()

    def random(self,size = 8):
        self.indices = []
        r = self.range / size
        for i in range(size):
            self.indices.append(int((r*i)+randint(0,r)))

    def union(self,arrs):
        return sum(arrs,self.indices)

    def overlap(self,arr):
        return SDR.Overlap(self.indices,arr)

    def subtract(self,arr):
        return SDR.Subtract(self.indices,arr)

    def difference(self,arr):
        return SDR.Difference(self.indices,arr)

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

    def fromIndexArray(self,arr):
        self.indices = arr

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