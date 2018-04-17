
const SDR = require('./SDR')
const SDRMap = require('./SDRMap')
const SDRDictionary = require('./SDRDictionary')

module.exports = class SDRClassifier {

    constructor(population=8,threshold=0.5){
        this.map = new SDRMap(population,threshold)
        this.dict = new SDRDictionary()
        this.keys = []
    }

    get(key,match=true){

        let val = this.map.get(key)
        
        // if there is more then one match
        if(val && val.length > this.map.population && match){
            const keys = this.dict.get(val).map(v => v.split(',').map(i => parseInt(i)))
            val = this.map.get(SDR.Match(key,keys))
        }

        // if there is no match
        else if(!val){
            this.keys.push(key)
            val = SDR.Random(8,2048)
            this.map.set(key,val)
            this.dict.set(val,key.join(','))
        }

        return val

    }

}