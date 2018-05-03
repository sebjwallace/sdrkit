
const ImageEncoder = require('../encoders/ImageEncoder')

module.exports = {

    compute(sources){
        return ImageEncoder.encode(sources[0])
    }

}