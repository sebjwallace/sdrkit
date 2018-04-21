const Graph = require('../Graph')

module.exports = {

    build: args => {

        const partitions = args.partitions
        const numLayers = args.layers
        const windowSize = args.windowSize
        const graph = new Graph()
        const layers = []

        for(var i = 0; i < layers.length; i++){

            const node = graph.create({
                type: 'classifier'
            })

            layers.push(node)

            for(var j = 0; j < (layers[i-1] || []); j++){
                
            }

        }

    }

}