from src.core.SDR import *
from src.core.SDRMap import SDRMap

a = SDR()
a.random(8)
print('a')
print(a.indices)

b = SDR()
b.random(8)
print('b')
print(b.indices)

c = SDR()
c.random(8)
print('c')
print(c.indices)

d = SDR()
d.fromIndexArray(a.union([b.indices]))
print('union of a AND b')
print(d.indices)

map = SDRMap()
map.size = 16
map.set(d.indices,c.indices)
print('a AND b = c')
print(map.get(a.union([b.indices])))

print('a OR b != c')
print(map.get(a.indices))
print(map.get(b.indices))