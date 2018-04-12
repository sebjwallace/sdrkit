
module.exports = class SDR {

    static Union(arrs){
        return SDR.Filter(arrs)
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

    static IndexArrayToBinary(arr){
        const binary = []
        for(var i = 0; i < this.range; i++)
            binary[i] = 0
        for(var i = 0; i < this.indices.length; i++)
            binary[this.indices[i]] = 1
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

    constructor({range=2048,indices=[],binaryArray=null} = {}){
        this.indices = indices
        this.range = range
        if(binaryArray)
            this.fromBinaryArray(binaryArray)
        if(!this.indices.length)
            this.random()
    }

    random(size = 8){
        this.indices = []
        const r = this.range / size
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
        return this.indices.length / this.range
    }

    sparsity(){
        return 1 - this.density()
    }

    get(){
        return this.indices.concat([])
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
        return SDR.IndexArrayToBinary(this.indices)
    }

}