
const NODES = {
    sdr: require('./nodes/sdr'),
    or: require('./nodes/or'),
    and: require('./nodes/and'),
    xor: require('./nodes/xor'),
    sparsify: require('./nodes/xor'),
    classifier: require('./nodes/classifier'),
    image: require('./nodes/image'),
    imageEncoder: require('./nodes/imageEncoder'),
    partition: require('./nodes/partition')
}

module.exports = class Graph {

    constructor(){
        this.graph = []
    }

    create({type='sdr',sources=[],state=[],params={}} = {}){
        const node = {
            id: Math.random().toString(36).substring(7),
            type,
            sources: sources.map(s => typeof s == 'string' ? s : s.id),
            state,
            _state: [],
            params
        }
        if(NODES[node.type].create)
            NODES[node.type].create(node)
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
                    node.state = NODES[node.type].compute(inputs,node)
                }
                return node
            })
    }

}