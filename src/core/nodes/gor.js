
const SDR = require('../SDR')

module.exports = {

    compute(sources,node){
        return SDR.GOR(SDR.OR(sources),node.params.inputs)
    }

}