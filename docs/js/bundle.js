(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

window.SDRKit = {
    SDR: require('../src/core/SDR'),
    SDRMap: require('../src/core/SDRMap'),
    SDRDictionary: require('../src/core/SDRDictionary'),
    Graph: require('../src/core/Graph'),

    notebook: require('../src/visual/Notebook'),
    visual: require('../src/visual/Visual')
}
},{"../src/core/Graph":2,"../src/core/SDR":3,"../src/core/SDRDictionary":4,"../src/core/SDRMap":5,"../src/visual/Notebook":6,"../src/visual/Visual":7}],2:[function(require,module,exports){

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

    static Random(population,range){
        const indices = []
        const r = range / population
        for(var i = 0; i < population; i++)
            indices.push(Math.floor((r * i) + (Math.random() * r)))
        return indices
    }

    static DepthMap(indices){
        const map = {}
        for(var i = 0; i < indices.length; i++)
            map[indices[i]] = (map[indices[i]] || 0) + 1
        return map
    }

    static Depth(indices){
        let largest = 0
        const map = SDR.DepthMap(indices)
        for(var i in map)
            largest = map[i] > largest ? map[i] : largest
        return largest
    }

    static Filter({indices,min=1,max=Infinity,ceil=Infinity}){
        const map = SDR.DepthMap(indices)
        const filtered = []
        for(var i in map)
            if(map[i] >= min && map[i] <= max)
                for(var j = 0; j < map[i]; j++)
                    if(j < ceil)
                        filtered.push(parseInt(i))
        return filtered
    }

    static Sum(arrs){
        const union = []
        for(var i = 0; i < arrs.length; i++)
            for(var j = 0; j < arrs[i].length; j++)
                union.push(arrs[i][j])
        return union.sort((a,b) => a - b)
    }

    static Subtract(indices1,indices2){
        indices1 = indices1.concat([])
        for(var i = 0; i < indices2.length; i++){
            const index = indices1.indexOf(indices2[i])
            if(index >= 0)
                indices1.splice(index,1)
        }
        return indices1
    }

    static OR(arrs){
        return SDR.Filter({indices:SDR.Sum(arrs),min:1,ceil:1})
    }

    static AND(arrs){
        return SDR.Filter({indices:SDR.Sum(arrs),min:2,ceil:1})
    }

    static XOR(arrs){
        return SDR.Filter({indices:SDR.Sum(arrs),min:1,max:1})
    }

    static Flatten(indices){
        return SDR.OR([indices])
    }

    static Subsample(indices,size=8){
        const subsampled = []
        for(var i = 0; i < size; i++)
            subsampled.push(indices[i * Math.floor(indices.length / size)])
        return subsampled
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
            return SDR.AND([a,b]).length
        })
    }

    static Match(arr,arrs){
        return SDR.Sort(arr,arrs)[0]
    }

    constructor({ range = 2048, population = 8, indices = [], binaryArray } = {}){
        this.indices = indices
        this.range = range
        if(binaryArray)
            this.fromBinaryArray(binaryArray)
        if(!this.indices.length)
            this.random(population)
    }

    random(population = 8){
        this.indices = SDR.Random(population,this.range)
    }

    flatten(){
        return SDR.Flatten(this.indices)
    }

    add(indices){
        return SDR.Sum([this.indices,indices])
    }

    subtract(indices){
        return SDR.Subtract(this.indices,indices)
    }

    or(indices){
        return SDR.OR([this.indices,indices])
    }

    xor(indices){
        return SDR.XOR([this.indices,indices])
    }

    and(indices){
        return SDR.AND([this.indices,indices])
    }

    union(indices){ // alias
        return this.or(indices)
    }

    overlap(indices){ // alias
        return this.and(indices)
    }

    subsample(size){
        return SDR.Subsample(this.indices,size)
    }

    filter({min=1,max=Infinity,ceil=Infinity} = {}){
        return SDR.Filter({indices:this.indices,min,max,ceil})
    }

    sort(arrs){
        return SDR.Sort(this.indices,arrs)
    }

    match(arrs){
        return SDR.Match(this.indices,arrs)
    }

    density(){
        return this.population() / this.range
    }

    sparsity(){
        return 1 - this.density()
    }

    population(){
        return Object.keys(this.depthMap()).length
    }

    depthMap(){
        return SDR.DepthMap(this.indices)
    }

    depth(){
        return SDR.Depth(this.indices)
    }

    fromIndexArray(arr){
        this.indices = arr.concat([])
    }

    fromBinaryArray(arr){
        this.indices = SDR.BinaryToIndexArray(arr)
        this.range = arr.length
    }

    toIndexArray(){
        return this.indices.concat([])
    }

    toBinaryArray(){
        return SDR.IndexArrayToBinary(this.indices,this.range)
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
                const overlap = SDR.AND([secondKey,this.secondKeys[i]])
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
            this.weights[key[i]] = (this.weights[key[i]] || {})
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

module.exports = {

    print: function(id,a,b){
        $('[nb="'+id+'"]').after(
            '<div class="notebook-print">'
                + a.toString() + '&nbsp;' + (b || '').toString()
            + '</div>'
        )
    },

    render: function(){

        $('[nb]').each(function(){
            $(this).after(
                '<pre class="notebook"><code class="language-javascript">'
                    + $(this).html().split(';;').join('<br>')
                + '</code></pre>'
            )
        })

    }

}
},{}],7:[function(require,module,exports){

var SDR = require('../core/SDR')

function createWrapper(container){
    const wrap = document.createElement('div')
    wrap.className = 'viz-container'
    container.appendChild(wrap)
    return wrap
}

function createCanvas(container,width,height){
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    container.appendChild(canvas)
    return canvas
}

module.exports = {

    printSDR({container=document.body,width=900,height=5,arr,indices,range,sdr,title} = {}){
        var sdr = sdr || new SDR({indices,range})
        if(arr)
            sdr.fromBinaryArray(arr)
        const wrap = createWrapper(container)
        wrap.innerHTML += '<span><b>Range:</b> ' + sdr.range + '</span>'
        wrap.innerHTML += '<span><b>Population:</b> ' + sdr.population() + '</span>'
        wrap.innerHTML += '<span><b>Density:</b> ' + sdr.density() + '</span>'
        wrap.innerHTML += '<span><b>Indicies:</b> [' + sdr.indices.join(', ') + ']</span>'
        if(title)
            wrap.innerHTML += '<span><b>Title:</b> ' + title + '</span>'
        const canvas = createCanvas(wrap,width,height)
        const depth = sdr.depth()
        const depthMap = sdr.depthMap()
        arr = sdr.toBinaryArray()
        const ctx = canvas.getContext('2d')
        for(var i = 0; i < arr.length; i++){
            ctx.fillStyle = arr[i] ? 'rgba(0,0,0,'+(depthMap[i]/depth)+')' : 'rgba(0,0,0,0.1)'
            ctx.fillRect(i*4,0,4,height)
        }
    }

}
},{"../core/SDR":3}]},{},[1]);
