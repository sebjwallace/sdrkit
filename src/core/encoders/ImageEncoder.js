
const Partition = require('../../util/Partition')
const SDR = require('../SDR')

var H = SDR.Random(8,2048) // horizontal
var V = SDR.Random(8,2048) // vertical
var DU = SDR.Random(8,2048) // diagonal up
var DD = SDR.Random(8,2048) // diagonal down
var E = SDR.Random(8,2048) // empty
var F = SDR.Random(8,2048) // full

const pixelMap = {
    '0,0,0,0': E,
    '1,1,1,1': F,
    '1,0,0,0': DU,
    '0,1,0,0': DD,
    '0,0,1,0': DD,
    '0,0,0,1': DU,
    '1,1,0,0': H,
    '0,0,1,1': H,
    '1,0,1,0': V,
    '0,1,0,1': V,
    '0,1,1,0': DU,
    '1,0,0,1': DD,
    '1,1,1,0': DU,
    '1,0,1,1': DD,
    '1,1,0,1': DD,
    '0,1,1,1': DU
}

module.exports = {

    H, V, DU, DD, E, F,

    pixelMap,

    encode(matrix){

        const partitions = Partition.matrix({matrix,windowSize:2,stepSize:1})
        const sdrMatrix = []

        for(var yi = 0; yi < partitions.length; yi++){
            sdrMatrix[yi] = []
            for(var xi = 0; xi < partitions[yi].length; xi++){
                var partition = []
                for(var y = 0; y < partitions[yi][xi].length; y++){
                    for(var x = 0; x < partitions[yi][xi][y].length; x++){
                        partition.push(partitions[yi][xi][y][x] / 127 < 1 ? 1 : 0)
                    }
                }
                sdrMatrix[yi][xi] = pixelMap[partition.join(',')]
            }
        }

        return sdrMatrix

    }

}