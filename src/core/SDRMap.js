
module.exports = class SDRMap {

    constructor(size=8,threshold=0.5){
        this.weights = {}
        this.size = size
        this.threshold = threshold
    }

    set(key,val,weight=1){
        for(var i = 0; i < key.length; i++){
            if(!this.weights[key[i]])
                this.weights[key[i]] = {}
            for(var j = 0; j < val.length; j++)
                this.weights[key[i]][val[j]] = (this.weights[key[i]][val[j]] || 0) + weight
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
        }
        return val.length > 0 ? val : null
    }

}

map = new module.exports()
map.set([9,12,56,150,285,431,559,723],[2,2,2,2,104,108,204,204,307])
map.get([9,12,56,285,723])