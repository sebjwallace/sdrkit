
const Ops = require('./Operations')

module.exports = class {

    constructor(){
        this.sdrs = {}
        this.index = {}
    }

    insert(sdr){
        const key = JSON.stringify(sdr)
        this.sdrs[key] = sdr
        for(var i in sdr){
            if(!this.index[i])
                this.index[i] = []
            this.index[i].push(key)
        }
        return this
    }

    find(sdr){
        const results = []
        const seen = {}
        for(var i in sdr)
            for(var j = 0; j < this.index[i].length; j++)
                if(!seen[this.index[i][j]])
                    results.push(seen[this.index[i][j]] = this.sdrs[this.index[i][j]])
        return results.sort((a,b) => Ops.diff(sdr,b) - Ops.diff(sdr,a)).reverse()
    }
    
}