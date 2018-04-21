
module.exports = {

    matrix: function({matrix,windowSize,stepSize,callback}){

        var steps = matrix.length - (windowSize - 1)
        var partitions = []

        for(var yi = 0; yi < steps; yi += stepSize){
            partitions[yi] = []
            for(var xi = 0; xi < steps; xi += stepSize){
                partitions[yi][xi] = []
                for(var y = 0; y < windowSize; y++){
                    partitions[yi][xi][y] = []
                    for(var x = 0; x < windowSize; x++){
                        var pixel = matrix[yi+y][xi+x]
                        partitions[yi][xi][y][x] = pixel
                        if(callback)
                            callback(pixel,xi,yi,x,y)
                    }
                }
            }
        }

        return partitions

    }

}