
const SDR = require('../core/SDR')

module.exports = {

    matrix: function({matrix,windowSize,stepSize,callback}){

        var steps = matrix.length - stepSize
        var partitions = []

        for(var yi = 0; yi < steps; yi += stepSize){
            partitions[yi/stepSize] = []
            for(var xi = 0; xi < steps; xi += stepSize){
                partitions[yi/stepSize][xi/stepSize] = []
                for(var y = 0; y < windowSize; y++){
                    partitions[yi/stepSize][xi/stepSize][y] = []
                    for(var x = 0; x < windowSize; x++){
                        var val = matrix[yi+y][xi+x]
                        partitions[yi/stepSize][xi/stepSize][y][x] = val
                        if(callback)
                            callback(val,xi,yi,x,y)
                    }
                }
            }
        }

        return partitions

    },

    SDRMatrix: function({matrix,windowSize,stepSize,range,callback}){

        var steps = matrix.length - stepSize
        var partitions = []

        for(var yi = 0; yi < steps; yi += stepSize){
            partitions[yi/stepSize] = []
            for(var xi = 0; xi < steps; xi += stepSize){
                var partition = []
                for(var y = 0; y < windowSize; y++){
                    for(var x = 0; x < windowSize; x++){
                        var val = matrix[yi+y][xi+x]
                        partition.push(val)
                        if(callback)
                            callback(val,xi,yi,x,y)
                    }
                }
                partitions[yi/stepSize][xi/stepSize] = SDR.Concat(partition,range)
            }
        }

        return partitions

    }

}