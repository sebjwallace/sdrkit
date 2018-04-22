
const Matrix = module.exports = {

    create({size,value=0}){
        var matrix = []
        for(var y = 0; y < size; y++){
            matrix[y] = []
            for(var x = 0; x < size; x++){
                matrix[y][x] = value
            }
        }
        return matrix
    },

    iterate({matrix,callback}){
        for(var y = 0; y < matrix.length; y++)
            for(var x = 0; x < matrix[y].length; x++)
                callback(matrix[y][x],x,y)
    },

    merge(matrices,size){
        size = size || matrices[0].length
        const merged = []
        for(var y = 0; y < size; y++){
            merged[y] = []
            for(var x = 0; x < size; x++){
                merged[y][x] = []
                for(var i = 0; i < matrices.length; i++)
                    merged[y][x].push(matrices[i][y][x])
            }
        }
        return merged
    },

    partition({matrix,size}){
        const partitioned = []
        for(var yi = 0; yi < matrix.length; yi+=size){
            partitioned[yi/size] = []
            for(var xi = 0; xi < matrix[yi].length; xi+=size){
                partitioned[yi/size][xi/size] = []
                for(var y = 0; y < size; y++){
                    partitioned[yi/size][xi/size][y] = []
                    for(var x = 0; x < size; x++){
                        partitioned[yi/size][xi/size][y][x] = matrix[yi+y][xi+x]
                    }
                }
            }
        }
        return partitioned
    },

    neighborhood({matrix,x,y,size,fallback=0}){
        const neighbors = []
        const radius = Math.floor(size / 2)
        for(var yi = -radius; yi <= radius; yi++){
            for(var xi = -radius; xi <= radius; xi++){
                if(matrix[y+yi] && matrix[y+yi][x+xi])
                    neighbors.push(matrix[y+yi][x+xi])
                else neighbors.push(fallback)
            }
        }
        return neighbors
    },

    convolve({matrix,size,stride=1,fallback}){
        const convolved = []
        for(var y = 0; y < matrix.length; y += stride){
            convolved[y] = []
            for(var x = 0; x < matrix[y].length; x += stride){
                convolved[y][x] = Matrix.neighborhood({matrix,x,y,size,fallback})
            }
        }
        return convolved
    },

    process({matrix,operation}){
        const processed = []
        for(var y = 0; y < matrix.length; y++){
            processed[y] = []
            for(var x = 0; x < matrix[y].length; x++){
                processed[y][x] = operation(matrix[y][x])
            }
        }
        return processed
    }

}

var matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10,11,12],
    [13,14,15,16]
]
var neighbors = Matrix.neighborhood({matrix,x:1,y:2,size:3})