const SDRClassifier = require('../SDRClassifier')

module.exports = {

    create(node){
        node.instance = new SDRClassifier()
    },

    compute(sources,node){
        return node.instance.get(SDR.Sparsify(sources),node.params.population)
    }

}