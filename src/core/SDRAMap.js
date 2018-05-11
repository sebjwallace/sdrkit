
const SDR = require('./SDR')
const SDRMap = require('./SDRMap')

module.exports = class {

    constructor(population,threshold){
        this.map = new SDRMap(population,threshold)
        this.analogs = {}
    }

    set(key,value){
        this.analogs[SDR.Flatten(value).join(',')] = value
        return this.map.set(key,value)
    }

    get(key){
        const value = this.map.get(key)
        return this.analogs[(value || []).join(',')] || []
    }

}