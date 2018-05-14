
const SDR = require('../core/SDR')

module.exports = class {

    constructor(){
        this.sdrs = {}
        this.index = {}
        this.map = {}
    }

    set(key,val){
        this.add(key)
        this.map[key] = val
    }

    get(key){
        return this.map[this.match(key)]
    }

    add(sdr){
        var id = sdr.toString(',')
        if(!this.sdrs[id]){
            this.sdrs[id] = sdr
            for(var i = 0; i < sdr.length; i++){
                if(!this.index[sdr[i]])
                    this.index[sdr[i]] = []
                this.index[sdr[i]].push(id)
            }
        }
    }

    sort(sdr){
        const matches = {}
        var results = []
        for(var i = 0; i < sdr.length; i++){
            const index = sdr[i]
            const indexMatches = this.index[index]
            for(var j = 0; j < (indexMatches || []).length; j++){
                const match = indexMatches[j]
                if(!matches[match]){
                    matches[match] = 0
                    results.push(this.sdrs[match])
                }
                matches[match]++
            }
        }
        for(var i = 0; i < results.length; i++){
            const GANDDistance = SDR.Flatten(SDR.GAND([results[i],sdr])).length || 0
            const XORDistance = SDR.Subtract(results[i],sdr).length
            matches[results[i].toString(',')] /= (XORDistance / (GANDDistance + 1)) + 1
        }
        return results.sort((a,b) => {
            return matches[a.toString(',')] - matches[b.toString(',')]
        }).reverse()
    }

    match(sdr){
        const sorted = this.sort(sdr)
        return sorted[0]
    }

}