from src.core.encoders.IntegerEncoder import *
from src.core.SDR import *
from src.core.SDRChain import *
from src.core.SDRStack import *
from src.core.SDRDictionary import *
from src.core.SDRClassifier import *

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
chain = SDRChain()
chain.append([1,2,3,4,5,6,7,8])
chain.append([10,11,12,13,14,15])
chain.append([21,22,23,24,25])
print(chain.next([1,2,3,4,5,6,7,8]))
print(chain.next())

print('random')
sdr.random()
print(sdr.indices)

print('composite')
comp = SDRStack()
comp.add([1,2,3,4])
comp.subtract([3,4,5,7])
print(comp.compile())

print('dictionary')
cat = SDR()
dog = SDR()
dict = SDRDictionary()
dict.set(cat.indices,'cat')
dict.set(dog.indices,'dog')
print(dict.get(cat.indices))
print(dict.get(SDR.Subsample(cat.indices,5)))
print(dict.get(dog.indices))
print(dict.get(SDR.Subsample(dog.indices,5)))

print('classifier')

c1 = SDRClassifier(16)
a1 = SDR()
b1 = SDR()
o1 = c1.get(SDR.Union([a1.indices,b1.indices]))

c2 = SDRClassifier(16)
a2 = SDR()
b2 = SDR()
o2 = c2.get(SDR.Union([a2.indices,b2.indices]))

c3 = SDRClassifier(16)
o3 = c3.get(SDR.Union([o1,o2]))

print(o3)