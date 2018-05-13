
const SDR = require('../core/SDR')

module.exports = class {

    constructor(size=8){
        this.size = size
        this.indices = []
    }

    next(sdrs){
        this.indices = SDR.Subtract(this.indices,SDR.Flatten(this.indices))
        this.indices = this.indices.concat(sdrs)
        return this.indices
    }

    clear(){
        this.indices = []
    }

}