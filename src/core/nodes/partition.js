
const Partition = require('../../util/Partition')

module.exports = {

    compute(sources,node){
        return Partition.SDRMatrix({matrix:sources[0]}, ...node.params)
    }

}