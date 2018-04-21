
const SDR = require('./SDR')
const SDRClassifier = require('./SDRClassifier')

module.exports = class Graph {

    constructor(){
        this.graph = []
    }

    create({type='sdr',sources=[],state=[]} = {}){
        const node = {
            id: Math.random().toString(36).substring(7),
            type,
            sources: sources.map(s => typeof s == 'string' ? s : s.id),
            state,
            _state: [],
            params: {}
        }
        if(type == 'node')
            node.instance = node.constructor()
        if(type == 'classifier')
            node.instance = new SDRClassifier()
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

        const operations = {
            node(){
                return node.compute(inputs,node)
            },
            sdr(inputs){
                return SDR.OR(inputs)
            },
            or(inputs){
                return SDR.OR(inputs)
            },
            and(inputs){
                return SDR.AND(inputs)
            },
            xor(inputs){
                return SDR.Difference(inputs)
            },
            sparsify(inputs){
                return SDR.Sparsify(inputs)
            },
            classifier(inputs,node){
                return node.instance.get(SDR.Sparsify(inputs),node.params.population)
            }
        }

        const nodes = {}

        return graph
            .map(node => {
                node._state = node.state
                nodes[node.id] = node
                return node
            })
            .map(node => {
                const inputs = []
                if(node.sources && node.sources.length){
                    for(var i = 0; i < node.sources.length; i++)
                        inputs.push(nodes[node.sources[i]]._state)
                    node.state = operations[node.type](inputs,node)
                }
                return node
            })
    }

}