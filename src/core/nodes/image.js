
const Load = require('../../util/Load')

module.exports = {

    compute(inputs,node){
        return Load.imageDataGrayscale(node.params.image)
    }

}