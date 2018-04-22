const SDRClassifier = require('../SDRClassifier')

module.exports = {

    create(node){
        node.instance = new SDRClassifier()
    },

    compute(inputs,node){
        return node.instance.get(SDR.Sparsify(inputs),node.params.population)
    }

}