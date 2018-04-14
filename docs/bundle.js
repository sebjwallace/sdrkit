(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

window.SDRKit = {
    SDR: require('../src/core/SDR'),
    SDRMap: require('../src/core/SDRMap'),
    SDRDictionary: require('../src/core/SDRDictionary'),
    Graph: require('../src/core/Graph'),

    SDRViz: require('../src/visual/SDRViz')
}
},{"../src/core/Graph":2,"../src/core/SDR":3,"../src/core/SDRDictionary":4,"../src/core/SDRMap":5,"../src/visual/SDRViz":6}],2:[function(require,module,exports){

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
},{"./SDR":3}],3:[function(require,module,exports){

module.exports = class SDR {

    static Union(arrs){
        const union = []
        for(var i = 0; i < arrs.length; i++)
            for(var j = 0; j < arrs[i].length; j++)
                union.push(arrs[i][j])
        return union
    }

    static Intersect(arrs){
        return SDR.Filter(arrs,2)
    }

    static Difference(arrs){
        return SDR.Filter(arrs,0,1)
    }

    static Subtract(arrs){
        return SDR.Filter(arrs,0,1)
    }

    static Subsample(arr,{size=8}={}){
        const subsampled = []
        for(var i = 0; i < size; i++)
            subsampled.push(arr[i * Math.floor(arr.length / size)])
        return subsampled
    }

    static Filter(arrs,min=0,max=Infinity){
        let counts = {}
        for(var x = 0; x < arrs.length; x++)
            for(var y = 0; y < arrs[x].length; y++)
                counts[arrs[x][y]] = (counts[arrs[x][y]] || 0) + 1
        const filtered = []
        for(var i in counts)
            if(counts[i] >= min && counts[i] <= max)
                filtered.push(parseInt(i))
        return filtered
    }

    static BinaryToIndexArray(arr){
        const indices = []
        for(var i = 0; i < arr.length; i++)
            if(arr[i] > 0)
                indices.push(i)
        return indices
    }

    static IndexArrayToBinary(arr,length){
        const binary = []
        for(var i = 0; i < length; i++)
            binary[i] = arr.indexOf(i) != -1 ? 1 : 0
        return binary
    }

    static Sort(arr,arrs){
        return arrs.concat([]).sort((a,b) => {
            return SDR.Intersect([a,b]).length
        })
    }

    static Match(arr,arrs){
        return SDR.Sort(arr,arrs)[0]
    }

    constructor({length=2048,indices=[],binaryArray=null} = {}){
        this.indices = indices
        this.length = length
        if(binaryArray)
            this.fromBinaryArray(binaryArray)
        if(!this.indices.length)
            this.random()
    }

    random(size = 8){
        this.indices = []
        const r = this.length / size
        for(var i = 0; i < size; i++)
            this.indices.push(Math.floor((r * i) + (Math.random() * r)))
    }

    union(arrs){
        return SDR.Union(arrs.concat(this.indices))
    }

    intersect(arrs){
        return SDR.Intersect(arrs.concat(this.indices))
    }

    difference(arrs){
        return SDR.Difference(arrs.concat(this.indices))
    }

    subtract(arrs){
        return SDR.Subtract(arrs.concat(this.indices))
    }

    subsample(size){
        return SDR.Subsample(this.indices,size)
    }

    sort(arrs){
        return SDR.Sort(this.indices,arrs)
    }

    match(arrs){
        return SDR.Match(this.indices,arrs)
    }

    density(){
        return this.indices.length / this.length
    }

    sparsity(){
        return 1 - this.density()
    }

    population(){
        const uniqueBits = {}
        for(var i = 0; i < this.indices.length; i++)
            uniqueBits[this.indices[i]] = true
        return Object.keys(uniqueBits).length
    }

    depthMap(){
        const map = {}
        for(var i = 0; i < this.indices.length; i++)
            map[this.indices[i]] = (map[this.indices[i]] || 0) + 1
        return map
    }

    depth(){
        let largest = 0
        const map = this.depthMap()
        for(var i in map)
            largest = map[i] > largest ? map[i] : largest
        return largest
    }

    get(){
        return this.indices.concat([])
    }

    fromIndexArray(arr){
        this.indices = arr.concat([])
    }

    fromBinaryArray(arr){
        this.indices = SDR.BinaryToIndexArray(arr)
        this.length = arr.length
    }

    toIndexArray(){
        return this.indices.concat([])
    }

    toBinaryArray(){
        return SDR.IndexArrayToBinary(this.indices,this.length)
    }

}
},{}],4:[function(require,module,exports){

const SDR = require('./SDR')
const SDRMap = require('./SDRMap')

module.exports = class SDRDictionary {

    constructor(){
        this.map = new SDRMap()
        this.dict = {}
        this.mirrorDict = {}
        this.secondKeys = []
    }

    set(key,val){
        const secondKey = new SDR({length:2048}).indices
        this.secondKeys.push(secondKey)
        this.map.set(key,secondKey)
        this.dict[secondKey.join()] = val
        this.mirrorDict[val] = key
        return key
    }

    get(key){
        if(typeof key == 'string')
            return this.mirrorDict[key]
        const secondKey = this.map.get(key)
        if(secondKey && secondKey.length > 8){
            const vals = []
            for(var i = 0; i < this.secondKeys.length; i++){
                const overlap = SDR.Intersect([secondKey,this.secondKeys[i]])
                if(overlap.length >= 8)
                    vals.push(this.dict[overlap.join()])
            }
            return vals
        }
        return this.dict[(secondKey || []).join()] || null
    }

}
},{"./SDR":3,"./SDRMap":5}],5:[function(require,module,exports){

module.exports = class SDRMap {

    constructor(size=8,threshold=0.5){
        this.weights = {}
        this.size = size
        this.threshold = threshold
    }

    set(key,val){
        for(var i = 0; i < key.length; i++){
            if(!this.weights[key[i]])
                this.weights[key[i]] = {}
            for(var j = 0; j < val.length; j++)
                this.weights[key[i]][val[j]] = 1
        }
    }

    get(key){
        const sum = {}
        for(var i = 0; i < key.length; i++){
            const weights = this.weights[key[i]] || {}
            for(var j in weights)
                sum[j] = (sum[j] || 0) + weights[j]
        }
        const val = []
        const threshold = this.size * this.threshold
        for(var i in sum)
            if(sum[i] > threshold)
                val.push(parseInt(i))
        return val.length > 0 ? val : null
    }

}
},{}],6:[function(require,module,exports){

var SDR = require('../core/SDR')

module.exports = {

    row({container=document.body,width=900,height=5,arr,sdr} = {}){
        var sdr = sdr || new SDR()
        if(arr)
            sdr.fromBinaryArray(arr)
        const wrap = document.createElement('div')
        wrap.className = 'viz-container'
        wrap.innerHTML += '<span><b>Length:</b> ' + sdr.length + '</span>'
        wrap.innerHTML += '<span><b>Population:</b> ' + sdr.population() + '</span>'
        wrap.innerHTML += '<span><b>Density:</b> ' + sdr.density() + '</span>'
        wrap.innerHTML += '<span><b>Indicies:</b> [' + sdr.indices.join(', ') + ']</span>'
        container.appendChild(wrap)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        wrap.appendChild(canvas)
        const depth = sdr.depth()
        const depthMap = sdr.depthMap()
        arr = sdr.toBinaryArray()
        const ctx = canvas.getContext('2d')
        for(var i = 0; i < arr.length; i++){
            ctx.fillStyle = arr[i] ? 'rgba(0,0,0,'+(depthMap[i]/depth)+')' : 'white'
            ctx.fillRect(i*4,0,4,height)
        }
    }

}
},{"../core/SDR":3}]},{},[1]);
