class SDRMap:

    def __init__(self,size=8,threshold=0.5):
        self.weights = {}
        self.size = size
        self.threshold = threshold

    def set(self,key,val):
        for i in key:
            if(self.weights.get(i) == None):
                self.weights[i] = {}
            for v in val:
                self.weights[i][v] = 1

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