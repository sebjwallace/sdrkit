class SDRMap:

    """
    This is an implementation of the pattern-association network
    outlined by Rolls in Cerebral Cortex - Principles Of Operation

    SDRMap is treated as a key-value pair data structure. The key
    is an array of indices that map to a value which is also an array
    of indices.

    The key is resilient to noise and degradation. Only some of the
    indices are needed to retrieve the value. Some of the indices
    in the key could be different but still able to retrieve the value.
    """

    def __init__(self,size = 8):
        self.weights = {}
        self.size = size
        self.threshold = 0.5

    def set(self,key,val):
        for i in key:
            if(self.weights.get(i) == None):
                self.weights[i] = {}
            for v in val:
                w = self.weights[i].get(v) or 0
                self.weights[i][v] = w + 1

    def get(self,key):
        sum = {}
        for k in key:
            weights = self.weights.get(k) or {}
            for index, weight in weights.items():
                sum[index] = (sum.get(index) or 0) + weight
        val = []
        for output in sum:
            t = self.size * self.threshold
            if(sum[output] > t):
                val.append(output)
        return val