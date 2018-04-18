
module.exports = class SDRMap {

    constructor(population=8,threshold=0.5){
        this.weights = {}
        this.population = population
        this.threshold = threshold
    }

    set(key,val){
        for(var i = 0; i < key.length; i++){
            this.weights[key[i]] = (this.weights[key[i]] || {})
            for(var j = 0; j < val.length; j++)
                this.weights[key[i]][val[j]] = 1
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
        const threshold = this.population * this.threshold
        for(var i in sum)
            if(sum[i] > threshold)
                val.push(parseInt(i))
        return val.length > 0 ? val : null
    }

    clear(){
        this.weights = {}
    }

}