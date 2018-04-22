
const SDR = require('../SDR')

module.exports = {

    compute(inputs){
        return SDR.Sparsify(inputs)
    }

}