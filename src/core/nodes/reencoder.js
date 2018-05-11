
const SDR = require('../SDR')
const SDRMap = require('../SDRMap')

module.exports = {

    create(node){
        node.instance = new SDRMap()
    },

    compute(sources,node){
        const key = SDR.OR(sources)
        let val = node.instance.get(key)
        if(!val){
            val = SDR.Random(8,2048)
            node.instance.set(key,val)
            return val
        }
        else {
            return val
        }
    }

}