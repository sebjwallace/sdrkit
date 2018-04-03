from .SDR import *
from .SDRMap import *

class SDRChunkMap:

    def __init__(self,sdr):
        self.sdr = sdr
        self.map = SDRMap()

    def chunk(self):
        def chunk(binaryArray):
            size = int(len(binaryArray)/2)
            if(size >= 2):
                chunks = SDR.Chunk(binaryArray=binaryArray, size=size, offset=size, asBinary=True)
                print(chunks)
                for cnk in chunks:
                    self.map.set(SDR.BinaryToIndexArray(binaryArray),SDR.BinaryToIndexArray(cnk))
                    chunk(cnk)
        chunk(self.sdr.toBinaryArray())