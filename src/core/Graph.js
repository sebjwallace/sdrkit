
const SDR = require('./SDR')

module.exports = class Graph {

    constructor(){
        this.graph = []
    }

    create({type='sdr',sources=[],state=[]} = {}){
        const node = {
            id: Math.random(),
            type,
            sources,
            state,
            params: {}
        }
        this.graph.push(node)
        return node
    }

    connect(source,target){
        target.sources.push(source.id)
        return this
    }

    disconnect(source,target){
        for(var i = 0; i < target.sources.length; i++)
            if(target.sources[i] == source.id)
                target.sources.splice(i,1)
    }

    compute(){
        return this.graph = Graph.Compute(this.graph)
    }

    static Compute(graph){

        const buffer = {}
        for(var i = 0; i < graph.length; i++)
            buffer[graph[i].id] = graph[i]

        const operations = {
            sdr(inputs){
                return SDR.Union(inputs)
            },
            union(inputs){
                return SDR.Union(inputs)
            },
            intersect(inputs){
                return SDR.Intersect(inputs)
            },
            difference(inputs){
                return SDR.Difference(inputs)
            },
            subsample(inputs){
                return SDR.Subsample(SDR.Union(inputs))
            }
        }

        return graph.map(node => {
            node = JSON.parse(JSON.stringify(node))
            const inputs = []
            if(node.sources && node.sources.length){
                for(var i = 0; i < node.sources.length; i++)
                    inputs.push(buffer[node.sources[i]].state)
                node.state = operations[node.type](inputs,node.params)
            }
            return node
        })
    }

}