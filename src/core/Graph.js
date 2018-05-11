
const NODES = {
    const: require('./nodes/const'),
    sdr: require('./nodes/sdr'),
    or: require('./nodes/or'),
    and: require('./nodes/and'),
    xor: require('./nodes/xor'),
    sparsify: require('./nodes/xor'),
    map: require('./nodes/map'),
    classifier: require('./nodes/classifier'),
    reencoder: require('./nodes/reencoder'),
    image: require('./nodes/image'),
    imageEncoder: require('./nodes/imageEncoder'),
    partition: require('./nodes/partition')
}

module.exports = class Graph {

    constructor(nodes){
        this.nodes = {}
        if(nodes)
            this.fromJSON(nodes)
    }

    create({id,type='sdr',sources=[],state=[],params={}} = {}){
        id = id || Math.random().toString(36).substring(7)
        const node = {
            id,
            type,
            sources: sources.map(s => typeof s == 'string' ? s : s.id),
            state,
            _state: [],
            params
        }
        if(NODES[node.type].create)
            NODES[node.type].create(node)
        this.nodes[node.id] = node
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
        return this.nodes = Graph.Compute(this.nodes)
    }

    static Compute(nodes){

        for(var i in nodes)
            nodes[i]._state = nodes[i].state

        for(var i in nodes){
            const node = nodes[i]
            const sources = []
<<<<<<< HEAD
            if((node.sources && node.sources.length) || node.value){
=======
            if(node.sources && node.sources.length){
>>>>>>> 9e694e502de5c6d78392be1f3c36fcd2aa045ac7
                for(var i = 0; i < node.sources.length; i++)
                    sources.push(nodes[node.sources[i]]._state)
                node.state = NODES[node.type].compute(sources,node)
            }
        }

        return nodes
    }

    fromJSON(json){
        for(var i in json){
            json[i].id = i
            this.create(json[i])
        }
    }

    toJSON(){
        return JSON.parse(JSON.stringify(this.nodes))
    }

}