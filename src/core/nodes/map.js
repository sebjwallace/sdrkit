
const SDRMap = require('../SDRMap')

module.exports = {

    create(node){
        node.instance = new SDRMap(node.params.population,node.params.threshold)
    },

    compute(sources,node){
        const key = sources[0]
        const val = sources[1]
        if(key && val){
            node.instance.set(key,val)
            return val
        }
        else {
            return node.instance.get(key) || []
        }
    }

}