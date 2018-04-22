
const ImageEncoder = require('../encoders/ImageEncoder')

module.exports = {

    compute(inputs){
        return ImageEncoder.encode(inputs[0])
    }

}