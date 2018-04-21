
module.exports = {

    matrix: function({matrix,windowSize,stepSize,callback}){

        var steps = matrix.length - (windowSize - 1)
        var partitions = []

        for(var yi = 0; yi < steps; yi += stepSize){
            for(var xi = 0; xi < steps; xi += stepSize){
                var partition = []
                partitions.push(partition)
                for(var y = 0; y < windowSize; y++){
                    for(var x = 0; x < windowSize; x++){
                        var pixel = matrix[yi+y][xi+x]
                        partition.push(pixel)
                        if(callback)
                            callback(pixel,xi,yi,x,y)
                    }
                }
            }
        }

        return partitions

    }

}