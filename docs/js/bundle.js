(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

window.SDRKit = {

    // core
    SDR: require('../src/core/SDR'),
    SDRMap: require('../src/core/SDRMap'),
    SDRAMap: require('../src/core/SDRAMap'),
    SDRDictionary: require('../src/core/SDRDictionary'),
    SDRClassifier: require('../src/core/SDRClassifier'),
    Graph: require('../src/core/Graph'),

    // encoders
    encoders: {
        ImageEncoder: require('../src/core/encoders/ImageEncoder')
    },

    // util
    Partition: require('../src/util/Partition'),
    Load: require('../src/util/Load'),

    // visual
    notebook: require('../src/visual/Notebook'),
    visual: require('../src/visual/Visual')
    
}
},{"../src/core/Graph":2,"../src/core/SDR":3,"../src/core/SDRAMap":4,"../src/core/SDRClassifier":5,"../src/core/SDRDictionary":6,"../src/core/SDRMap":7,"../src/core/encoders/ImageEncoder":8,"../src/util/Load":17,"../src/util/Partition":18,"../src/visual/Notebook":19,"../src/visual/Visual":20}],2:[function(require,module,exports){

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
},{"./nodes/and":9,"./nodes/classifier":10,"./nodes/image":11,"./nodes/imageEncoder":12,"./nodes/or":13,"./nodes/partition":14,"./nodes/sdr":15,"./nodes/xor":16}],3:[function(require,module,exports){

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

    static Trim(indices,population){
        const trimmed = []
        const depthMap = SDR.DepthMap(indices)
        for(var i in depthMap)
            trimmed.push({index:parseInt(i),depth:depthMap[i]})
        return trimmed
            .sort((a,b) => b.depth - a.depth)
            .map(i => i.index)
            .splice(0,population)
            .sort((a,b) => a - b)
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

    static Multiply(indices,multiplier){
        const product = []
        for(var i = 0; i < indices.length; i++)
            for(var j = 0; j < multiplier; j++)
                product.push(indices[i])
        return product
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

    static Subsample(indices,population=8){
        const subsampled = []
        for(var i = 0; i < population; i++)
            subsampled.push(indices[i * Math.floor(indices.length / population)])
        return subsampled
    }

    static Sparsify(arrs,population=8){
        const sparsified = []
        let offset = -1
        let index = 0
        for(var i = 0; i < population; i++){
            const window = Math.floor(arrs[index].length / population)
            offset = offset + 1 == window ? 0 : offset + 1
            sparsified.push(arrs[index][(i * window) + offset])
            index = index + 1 == arrs.length ? 0 : index + 1
        }
        return sparsified
    }

    static Concat(arrs,range){
        const indices = []
        for(var i = 0; i < arrs.length; i++)
            for(var j = 0; j < arrs[i].length; j++)
                indices.push((i * range) + arrs[i][j])
        return indices
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

    static Sort(indices,arrs){
        return arrs.concat([]).sort((a,b) => {
            return SDR.Subtract(indices,a).length - SDR.Subtract(indices,b).length
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

module.exports = class {

    constructor(population,threshold){
        this.map = new SDRMap(population,threshold)
        this.analogs = {}
    }

    set(key,value){
        this.analogs[SDR.Flatten(value).join(',')] = value
        return this.map.set(key,value)
    }

    get(key){
        const value = this.map.get(key)
        return this.analogs[(value || []).join(',')] || []
    }

}
},{"./SDR":3,"./SDRMap":7}],5:[function(require,module,exports){

const SDR = require('./SDR')
const SDRMap = require('./SDRMap')
const SDRDictionary = require('./SDRDictionary')

module.exports = class SDRClassifier {

    constructor(population=8,threshold=0.5){
        this.map = new SDRMap(population,threshold)
        this.dict = new SDRDictionary()
        this.keys = []
    }

    get(key,match=true){

        let val = this.map.get(key)
        
        // if there is more then one match
        if(val && val.length > this.map.population && match){
            const keys = this.dict.get(val).map(v => v.split(',').map(i => parseInt(i)))
            val = this.map.get(SDR.Match(key,keys))
        }

        // if there is no match
        else if(!val){
            this.keys.push(key)
            val = SDR.Random(8,2048)
            this.map.set(key,val)
            this.dict.set(val,key.join(','))
        }

        return val

    }

}
},{"./SDR":3,"./SDRDictionary":6,"./SDRMap":7}],6:[function(require,module,exports){

const SDR = require('./SDR')
const SDRMap = require('./SDRMap')

module.exports = class SDRDictionary {

    constructor(population=8,threshold){
        this.map = new SDRMap(population,threshold)
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
        if(secondKey && secondKey.length > this.map.population){
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
},{"./SDR":3,"./SDRMap":7}],7:[function(require,module,exports){

module.exports = class SDRMap {

    constructor(population=8,threshold=0.5){
        this.weights = {}
        this.population = population
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
        const threshold = this.population * this.threshold
        for(var i in sum)
            if(sum[i] > threshold)
                val.push(parseInt(i))
        return val.length > 0 ? val : null
    }

    clear(){
        this.weights = {}
    }

}
},{}],8:[function(require,module,exports){

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
},{"../../util/Partition":18,"../SDR":3}],9:[function(require,module,exports){

const SDR = require('../SDR')

module.exports = {

    compute(inputs){
        return SDR.AND(inputs)
    }

}
},{"../SDR":3}],10:[function(require,module,exports){
const SDRClassifier = require('../SDRClassifier')

module.exports = {

    create(node){
        node.instance = new SDRClassifier()
    },

    compute(inputs,node){
        return node.instance.get(SDR.Sparsify(inputs),node.params.population)
    }

}
},{"../SDRClassifier":5}],11:[function(require,module,exports){

const Load = require('../../util/Load')

module.exports = {

    compute(inputs,node){
        return Load.imageDataGrayscale(node.params.image)
    }

}
},{"../../util/Load":17}],12:[function(require,module,exports){

const ImageEncoder = require('../encoders/ImageEncoder')

module.exports = {

    compute(inputs){
        return ImageEncoder.encode(inputs[0])
    }

}
},{"../encoders/ImageEncoder":8}],13:[function(require,module,exports){

const SDR = require('../SDR')

module.exports = {

    compute(inputs){
        return SDR.OR(inputs)
    }

}
},{"../SDR":3}],14:[function(require,module,exports){

const Partition = require('../../util/Partition')

module.exports = {

    compute(inputs,node){
        return Partition.SDRMatrix({matrix:inputs[0]}, ...node.params)
    }

}
},{"../../util/Partition":18}],15:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"../SDR":3,"dup":13}],16:[function(require,module,exports){

const SDR = require('../SDR')

module.exports = {

    compute(inputs){
        return SDR.XOR(inputs)
    }

}
},{"../SDR":3}],17:[function(require,module,exports){

module.exports = {

    imageDataGrayscale: (img) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img,0,0)
        const data = ctx.getImageData(0,0,img.width,img.height).data
        var i = 0
        const grid = []
        for(var y = 0; y < img.height; y++){
            grid[y] = []
            for(var x = 0; x < img.width; x++){
                const pixel = data[i]
                i+=4
                grid[y][x] = data[i]
            }
        }
        return grid
    }

}
},{}],18:[function(require,module,exports){

const SDR = require('../core/SDR')

module.exports = {

    matrix: function({matrix,windowSize,stepSize,callback}){

        var steps = matrix.length - stepSize
        var partitions = []

        for(var yi = 0; yi < steps; yi += stepSize){
            partitions[yi/stepSize] = []
            for(var xi = 0; xi < steps; xi += stepSize){
                partitions[yi/stepSize][xi/stepSize] = []
                for(var y = 0; y < windowSize; y++){
                    partitions[yi/stepSize][xi/stepSize][y] = []
                    for(var x = 0; x < windowSize; x++){
                        var val = matrix[yi+y][xi+x]
                        partitions[yi/stepSize][xi/stepSize][y][x] = val
                        if(callback)
                            callback(val,xi,yi,x,y)
                    }
                }
            }
        }

        return partitions

    },

    SDRMatrix: function({matrix,windowSize,stepSize,range,callback}){

        var steps = matrix.length - stepSize
        var partitions = []

        for(var yi = 0; yi < steps; yi += stepSize){
            partitions[yi/stepSize] = []
            for(var xi = 0; xi < steps; xi += stepSize){
                var partition = []
                for(var y = 0; y < windowSize; y++){
                    for(var x = 0; x < windowSize; x++){
                        var val = matrix[yi+y][xi+x]
                        partition.push(val)
                        if(callback)
                            callback(val,xi,yi,x,y)
                    }
                }
                partitions[yi/stepSize][xi/stepSize] = SDR.Concat(partition,range)
            }
        }

        return partitions

    }

}
},{"../core/SDR":3}],19:[function(require,module,exports){

module.exports = {

    print: function(id,a,b){
        var $fellow = $('.nb-ref-'+id)
        $fellow = $fellow.length ? $fellow.last() : '[nb="'+id+'"]'
        function format(obj){
            if(Array.isArray(obj))
                return '[' + obj.join(', ') + ']'
            else if(typeof obj == 'object')
                return JSON.stringify(obj)
            return (obj || '').toString()
        }
        $($fellow).after(
            '<div class="notebook-print nb-ref-'+id+'">'
                + format(a) + '&nbsp;' + format(b)
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
},{}],20:[function(require,module,exports){

var SDR = require('../core/SDR')
var Load = require('../util/Load')
var Partition = require('../util/Partition')

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
        wrap.innerHTML += '<br>'
        const canvas = createCanvas(wrap,width,height)
        const depth = sdr.depth()
        const depthMap = sdr.depthMap()
        arr = sdr.toBinaryArray()
        const ctx = canvas.getContext('2d')
        for(var i = 0; i < arr.length; i++){
            ctx.fillStyle = arr[i] ? 'rgba(0,0,0,'+(depthMap[i]/depth)+')' : 'white'
            ctx.fillRect(i*4,0,4,height)
        }
    },

    printImagePartition({container=document.body,width,height,image,windowSize,stepSize,margin=4,scale=1,callback}){
        var wrapper = createWrapper(container)
        const imageData = Load.imageDataGrayscale(image)
        const ctx = createCanvas(wrapper,width,height).getContext('2d')
        const partitions = Partition.matrix({matrix:imageData,windowSize,stepSize,callback: (pixel,xi,yi,x,y) => {
            ctx.fillStyle = pixel == 0 ? 'black' : 'white'
            var px = ((xi * ((windowSize-stepSize) + margin))+x) * scale
            var py = ((yi * ((windowSize-stepSize) + margin))+y) * scale
            ctx.fillRect(px,py,scale,scale)
        }})
    },

    printPartitions({container=document.body,width,height,partitions,callback}){
        var wrapper = createWrapper(container)
        const ctx = createCanvas(wrapper,width,height).getContext('2d')
        for(var y = 0; y < partitions.length; y++){
            for(var x = 0; x < partitions[y].length; x++){
                if(callback)
                    callback(partitions[y][x],x,y,ctx)
            }
        }
    }

}
},{"../core/SDR":3,"../util/Load":17,"../util/Partition":18}]},{},[1]);
