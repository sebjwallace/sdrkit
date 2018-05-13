
const SDR = require('../core/SDR')

module.exports = class {

    constructor(size=8){
        this.size = size
        this.queue = []
    }

    next(sdr){
        this.queue.push(sdr)
        if(this.queue.length > this.size)
            this.queue.shift()
        return SDR.Sum(this.queue)
    }

    clear(){
        this.queue = []
    }

}