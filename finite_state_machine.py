from src.core.SDR import *
from src.core.SDRMap import *
from src.core.SDRDictionary import *

dict = SDRDictionary()

# states
lockedState = SDR()
unlockedState = SDR()

dict.set(lockedState(),'locked')
dict.set(unlockedState(),'unlocked')

# transitions
pushTrans = SDR()
coinTrans = SDR()

# mapping
map = SDRMap()
map.set(
    SDR.Subsample(lockedState.union([coinTrans()]),8),
    unlockedState()
)
map.set(
    SDR.Subsample(lockedState.union([pushTrans()]),8),
    lockedState()
)
map.set(
    SDR.Subsample(unlockedState.union([pushTrans()]),8),
    lockedState()
)
map.set(
    SDR.Subsample(unlockedState.union([coinTrans()]),8),
    unlockedState()
)

# running
state = map.get(SDR.Subsample(lockedState.union([coinTrans()]),8))
print(dict.get(state))
state = map.get(SDR.Subsample(pushTrans.union([state])))
print(dict.get(state))