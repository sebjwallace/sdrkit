
module.exports = class {

    constructor(){
        this.sdrs = {}
        this.index = {}
    }

    add(sdr){
        var id = sdr.toString(',')
        this.sdrs[id] = sdr
        for(var i = 0; i < sdr.length; i++){
            if(!this.index[sdr[i]])
                this.index[sdr[i]] = []
            this.index[sdr[i]].push(id)
        }
    }

    get(sdr,args={}){
        const matches = {}
        var results = []
        for(var i = 0; i < sdr.length; i++){
            for(var j = 0; j < this.index[sdr[i]].length; j++){
                if(!matches[this.index[sdr[i]][j]]){
                    matches[this.index[sdr[i]][j]] = 0
                    results.push(this.sdrs[this.index[sdr[i]][j]])
                }
                matches[this.index[sdr[i]][j]]++
            }
        }
        return results.sort((a,b) => {
            matches[a.toString(',')] - matches[b.toString(',')]
        })
    }

}