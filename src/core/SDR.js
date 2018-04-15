
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