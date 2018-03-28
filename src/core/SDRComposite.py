from .SDR import *

class SDRComposite:
    
    def __init__(self):
        self.arrs = []

    def append(self,arr,operation = 'add'):
        self.arrs.append({
            'operation': operation,
            'arr': arr
        })

    def add(self,arr):
        self.append(arr,'add')

    def subtract(self,arr):
        self.append(arr,'subtract')

    def compile(self):
        out = []
        for arr in self.arrs:
            if(arr['operation'] == 'add'):
                out = SDR.Union([out,arr['arr']])
            elif(arr['operation'] == 'subtract'):
                out = SDR.Subtract(out,arr['arr'])
        return out