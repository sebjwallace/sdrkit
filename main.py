from src.core.encoders.IntegerEncoder import *
from src.core.SDR import *
from src.core.AssociativeChain import *

encoder = IntegerEncoder()

print(encoder.encode(124))

sdr = SDR()

sdr.fromBinaryArray([0,1,1,0,0,1])
print(sdr.indices)

print('union')
print(sdr.union([[11,12],[14,15]]))

print('subsample')
sdr.indices = [8,4,3,2,9,6,10,1,5,7]
print(sdr.subsample(5))

print(sdr.overlap([2,4,6,10,12,15]))
print(sdr.subtract([2,5]))
print(sdr.difference([9,10,11,12]))

print('sort')
print(sdr.sort([[1,2,3,4,5,6,7,8],[1,2],[1,2,3,4]]))
print('match')
print(sdr.match([[1,2,3,4,5,6,7,8],[1,2],[1,2,3,4]]))

print('chain')
chain = AssociativeChain()
chain.append([1,2,3,4,5,6,7,8])
chain.append([10,11,12,13,14,15])
chain.append([21,22,23,24,25])
print(chain.next([1,2,3,4,5,6,7,8]))
print(chain.next())