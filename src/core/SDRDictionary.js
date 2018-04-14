
const SDR = require('./SDR')
const SDRMap = require('./SDRMap')

module.exports = class SDRDictionary {

    constructor(){
        this.map = new SDRMap()
        this.dict = {}
        this.mirrorDict = {}
        this.secondKeys = []
    }

    set(key,val){
        const secondKey = new SDR({length:2048}).indices
        this.secondKeys.push(secondKey)
        this.map.set(key,secondKey)
        this.dict[secondKey.join()] = val
        this.mirrorDict[val] = key
        return key
    }

    get(key){
        if(typeof key == 'string')
            return this.mirrorDict[key]
        const secondKey = this.map.get(key)
        if(secondKey && secondKey.length > 8){
            const vals = []
            for(var i = 0; i < this.secondKeys.length; i++){
                const overlap = SDR.AND([secondKey,this.secondKeys[i]])
                if(overlap.length >= 8)
                    vals.push(this.dict[overlap.join()])
            }
            return vals
        }
        return this.dict[(secondKey || []).join()] || null
    }

}