
const Load = require('../../util/Load')

module.exports = {

    compute(sources,node){
        return Load.imageDataGrayscale(node.params.image)
    }

}