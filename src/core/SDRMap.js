
module.exports = class SDRMap {

    constructor(size=8,threshold=0.5){
        this.weights = {}
        this.size = size
        this.threshold = threshold
    }

    set(key,val,weight=1){
        const depthMap = {}
        for(var i = 0; i < key.length; i++)
            depthMap[key[i]] = (depthMap[key[i]] || 0) + 1
        for(var i = 0; i < key.length; i++){
            const kv = key[i]
            this.weights[kv] = this.weights[kv] || {}
            for(var j = 0; j < val.length; j++){
                const vv = val[j]
                this.weights[kv][vv] = (this.weights[kv][vv] || 0) + (weight / depthMap[kv])
            }
        }
    }

    get(key){
        const sum = {}
        for(var i = 0; i < key.length; i++){
            const weights = this.weights[key[i]] || {}
            for(var j in weights)
                sum[j] = (sum[j] || 0) + weights[j]
        }
        const val = []
        const threshold = this.size * this.threshold
        for(var i in sum){
            if(sum[i] > threshold){
                var n = sum[i] / key.length
                for(var j = 0; j < n; j++)
                    val.push(parseInt(i))
            }
            else return null
        }
        return val
    }

}