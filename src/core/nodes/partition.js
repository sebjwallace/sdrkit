
const Partition = require('../../util/Partition')

module.exports = {

    compute(inputs,node){
        return Partition.SDRMatrix({matrix:inputs[0]}, ...node.params)
    }

}