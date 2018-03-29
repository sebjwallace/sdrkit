from src.core.SDRMap import *

map = SDRMap()

map.set([1,2,3,4,5,6,7,8],[11,12,13,14])

if(map.get([1,2,3,4,5,6,7,8]) == [11,12,13,14]):
    print('Basic retrieval: Success')

if (map.get([1,2,3,4,5]) == [11,12,13,14]):
    print('Incomplete retrieval: Success')

if (map.get([4,2,8,7,1]) == [11,12,13,14]):
    print('Incomplete retrieval: Success')

if (map.get([1,2,3,4]) != [11,12,13,14]):
    print('Too much incompleteness - retrieval fail: Success')

map.threshold = 0.4
if (map.get([1,2,3,4]) == [11,12,13,14]):
    print('Incomplete retrieval with threshold = 0.4: Success')

map.threshold = 0.2
if (map.get([1,2]) == [11,12,13,14]):
    print('Incomplete retrieval with threshold = 0.2: Success')