
const SDR = require('../SDR')

module.exports = {

    compute(sources){
        return SDR.Sparsify(sources)
    }

}