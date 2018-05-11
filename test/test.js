const chai = require('chai')
const expect = chai.expect
const SDR = require('../src/core/SDR')
const SDRMap = require('../src/core/SDRMap')
const SDRAMap = require('../src/core/SDRAMap')
const SDRDictionary = require('../src/core/SDRDictionary')
const SDRRepository = require('../src/core/SDRRepository')
const Graph = require('../src/core/Graph')
const Matrix = require('../src/core/Matrix')

describe('SDR', () => {

    it('should initialize with a random set of 8 indicies', () => {
        const sdr = new SDR()
        expect(sdr.indices.length).to.equal(8)
        let last = -1
        for(var i = 0; i < sdr.indices.length; i++){
            expect(sdr.indices[i]).to.be.above(last)
            last = sdr.indices[i]
        }
    })

    it('should initialize with a random set of n indicies', () => {
        const sdr = new SDR({population:16})
        expect(sdr.indices.length).to.equal(16)
        let last = -1
        for(var i = 0; i < sdr.indices.length; i++){
            expect(sdr.indices[i]).to.be.above(last)
            last = sdr.indices[i]
        }
    })

    it('should initialize with an injected set of indicies', () => {
        const sdr = new SDR({indices:[10,20,30,40,50,60,70,80]})
        expect(sdr.indices).to.deep.equal([10,20,30,40,50,60,70,80])
    })

    it('should initialise from a binary array', () => {
        const sdr = new SDR({binaryArray:[1,0,1,1,0]})
        expect(sdr.indices).to.deep.equal([0,2,3])
    })

    it('should calculate the population of active bits', () => {
        const sdr = new SDR()
        expect(sdr.population()).to.equal(8)
    })

    it('should calculate the population of overlapping active bits', () => {
        const sdr = new SDR({indices:[10,10,20,20,30,30,40,40]})
        expect(sdr.population()).to.equal(4)
    })

    it('should calculate the density of the SDR', () => {
        let sdr = new SDR({range:16,population:8})
        expect(sdr.density()).to.equal(0.5)
        sdr = new SDR({range:32,population:8})
        expect(sdr.density()).to.equal(8/32)
        sdr = new SDR({range:1024,population:8})
        expect(sdr.density()).to.equal(8/1024)
    })

    it('should calculate the depth of the overlapping bits', () => {
        const sdr = new SDR({indices:[10,20,20,40,50,60,70,70,80,80,80,80]})
        expect(sdr.depth()).to.equal(4)
    })

    it('should calculate the depth map of the overlapping bits', () => {
        const sdr = new SDR({indices:[10,20,20,40,50,60,70,70,80,80,80,80]})
        expect(sdr.depthMap()).to.deep.equal({
            10: 1, 20: 2, 40: 1, 50: 1, 60: 1, 70: 2, 80: 4
        })
    })

    it('should flatten overlapping indices', () => {
        const sdr = new SDR({indices:[4,18,22,22,83,83,127,127,127,254,254,391,391,391,411,411,411,411]})
        expect(sdr.flatten()).to.deep.equal([4,18,22,83,127,254,391,411])
    })

    it('should filter the depth of the indices', () => {
        const sdr = new SDR({indices:[4,18,22,22,83,83,127,127,127,254,254,391,391,391,411,411,411,411]})
        expect(sdr.filter({min:1,ceil:1})).to.deep.equal([4,18,22,83,127,254,391,411])
        expect(sdr.filter({min:1,ceil:2})).to.deep.equal([4,18,22,22,83,83,127,127,254,254,391,391,411,411])
        expect(sdr.filter({min:1,ceil:3})).to.deep.equal([4,18,22,22,83,83,127,127,127,254,254,391,391,391,411,411,411])
        expect(sdr.filter({min:1,ceil:4})).to.deep.equal([4,18,22,22,83,83,127,127,127,254,254,391,391,391,411,411,411,411])
        expect(sdr.filter({min:2,ceil:4})).to.deep.equal([22,22,83,83,127,127,127,254,254,391,391,391,411,411,411,411])
        expect(sdr.filter({min:3,ceil:4})).to.deep.equal([127,127,127,391,391,391,411,411,411,411])
        expect(sdr.filter({min:4,ceil:4})).to.deep.equal([411,411,411,411])
        expect(sdr.filter({min:4,ceil:5})).to.deep.equal([411,411,411,411])
        expect(sdr.filter({min:5,ceil:9})).to.deep.equal([])
    })

    it('should add indices from another set', () => {
        const sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.add([8,22,37,44,54,61,79,99])).to.deep.equal([1,8,8,14,19,22,27,37,44,44,52,54,61,79,79,99])
        var sum = SDR.Sum([[1, 21, 38, 52, 65, 81, 96, 126],[9, 21, 21, 38, 48, 77, 81, 107, 116]])
        expect(sum).to.deep.equal([1, 9, 21, 21, 21, 38, 38, 48, 52, 65, 77, 81, 81, 96, 107, 116, 126])
    })

    it('should subtract indices from another set', () => {
        let sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.subtract([8,22,37,44,54,61,79,99])).to.deep.equal([1,14,19,27,52])
        sdr = new SDR({indices:[1,8,14,19,27,27,44,52,79,79,79]})
        expect(sdr.subtract([8,22,27,37,44,54,61,79,99])).to.deep.equal([1,14,19,27,52,79,79])
    })

    it('should OR indices from another set', () => {
        const sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.or([8,22,37,44,54,61,79,99])).to.deep.equal([1,8,14,19,22,27,37,44,52,54,61,79,99])
        const union = SDR.OR([[12, 23, 42, 52, 69, 84, 102, 116],[1, 16, 47, 60, 70, 87, 104, 121]])
        expect(union).to.deep.equal( [1, 12, 16, 23, 42, 47, 52, 60, 69, 70, 84, 87, 102, 104, 116, 121])
    })

    it('should AND indices from another set', () => {
        const sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.and([8,22,37,44,54,61,79,99])).to.deep.equal([8,44,79])
    })

    it('should XOR indices from another set', () => {
        const sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.xor([8,22,37,44,54,61,79,99])).to.deep.equal([1,14,19,22,27,37,52,54,61,99])
    })

    it('should gate indices using OR', () => {
        const a = [1,8,14,19,27,44,52,79]
        const b = [8,22,37,44,54,61,79,99]
        const c = [1,14,19,22,27,37,52,54,61,99]
        expect(SDR.GOR(c,[a,b])).to.deep.equal([1,14,19,22,27,37,52,54,61,99])
        expect(SDR.GOR(c,[a,[]])).to.deep.equal([1,14,19,22,27,37,52,54,61,99])
        expect(SDR.GOR(c,[[],[]])).to.deep.equal([])
    })

    it('should gate indices using AND', () => {
        const a = [1,8,14,19,27,44,52,79]
        const b = [8,22,37,44,54,61,79,99]
        const c = [1,14,19,22,27,37,52,54,61,99]
        expect(SDR.GAND(c,[a,b])).to.deep.equal([1,14,19,22,27,37,52,54,61,99])
        expect(SDR.GAND(c,[a,[]])).to.deep.equal([])
        expect(SDR.GAND(c,[[],[]])).to.deep.equal([])
    })

    it('should return a subsample of the origional index array', () => {
        const sdr = new SDR({indices:[1,2,3,4,5,6,7,8]})
        expect(sdr.subsample(4)).to.deep.equal([1,3,5,7])
    })

    it('should union and evenly sparsify an array of SDRs', () => {
        let sparsified = SDR.Sparsify([
            [0, 22, 42, 63, 68, 87, 97, 126],
            [4, 26, 34, 50, 69, 88, 96, 117],
        ],8)
        expect(sparsified).to.deep.equal([0,26,42,50,68,88,97,117])
        sparsified = SDR.Sparsify([
            [12, 18, 44, 58, 68, 85, 99, 121],
            [9, 22, 35, 56, 66, 89, 105, 127],
            [7, 19, 32, 51, 74, 82, 100, 122]
        ],8)
        expect(sparsified).to.deep.equal([12,22,32,58,66,82,99,127])
        sparsified = SDR.Sparsify([
            [1, 20, 39, 61, 79, 94, 107, 112],
            [4, 31, 37, 57, 65, 81, 102, 118],
            [9, 29, 35, 63, 72, 84, 109, 119],
            [8, 24, 32, 60, 70, 92, 104, 116],
            [13, 16, 43, 58, 76, 91, 101, 117]
        ],8)
        expect(sparsified).to.deep.equal([1,31,35,60,76,94,102,119])
    })

    it('should return indices of the highest reoccuring indices of a fixed population', () => {
        const trimmed = SDR.Trim([2,12,16,16,43,43,43,58,76,91,91,91,91,101,101,117,117,200,200,278,340,340,421,500,500],8)
        expect(trimmed).to.deep.equal([16,43,91,101,117,200,340,500])
    })

    it('should return a sorted list of index array with the most similar at index 0', () => {
        const sdr = new SDR({indices:[1,2,3,4,5,6,7,8]})
        expect(sdr.sort([[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]))
            .to.deep.equal([[1,2,3,4,5],[1,2,3,4],[1,2,3],[1,2]])
    })

    it('should return a the most similar index array', () => {
        const sdr = new SDR({indices:[1,2,3,4,5,6,7,8]})
        expect(sdr.match([[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]))
            .to.deep.equal([1,2,3,4,5])
    })

    it('should concat an array of index arrays', () => {
        expect(SDR.Concat([
            [12, 18, 44, 58, 68, 85, 99, 121],
            [8, 24, 32, 60, 70, 92, 104, 116],
            [13, 16, 43, 58, 76, 91, 101, 117]
        ],128)).to.deep.equal([12,18,44,58,68,85,99,121,136,152,160,188,198,220,232,244,269,272,299,314,332,347,357,373])
    })

})

describe('SDRMap', () => {

    it('should assign a key with a value', () => {
        let map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([1,2,3,4,5,6,7,8])).to.deep.equal([11,12,13,14,15,16,17,18])
        const sdr1 = new SDR()
        const sdr2 = new SDR()
        map = new SDRMap()
        map.set(sdr1.indices,sdr2.indices)
        expect(map.get(sdr1.indices)).to.deep.equal(sdr2.indices)
    })

    it('should get value with missing bits', () => {
        let map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([2,3,4,5,7,8])).to.deep.equal([11,12,13,14,15,16,17,18])
        const sdr1 = new SDR()
        const sdr2 = new SDR()
        map = new SDRMap()
        map.set(sdr1.indices,sdr2.indices)
        expect(map.get(sdr1.subsample(5))).to.deep.equal(sdr2.indices)
    })

    it('should get value with too many bits', () => {
        const map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([1,2,3,4,5,6,7,8,9,10,11,12])).to.deep.equal([11,12,13,14,15,16,17,18])
    })

    it('should get value with some wrong bits', () => {
        const map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([1,2,3,9,5,18,7,10])).to.deep.equal([11,12,13,14,15,16,17,18])
    })

    it('should not get value with too many missing bits', () => {
        const map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([2,3,4,7])).to.equal(null)
    })

    it('should handle many-to-one assignments', () => {
        // this was adopted from an issue in a state machine example
        var a = [5, 43, 74, 100, 143, 191, 218, 243]
        var b = [2, 35, 64, 109, 139, 187, 195, 234]
        var c = [17, 46, 86, 123, 156, 189, 212, 251]
        var d = [19, 33, 95, 124, 149, 187, 205, 241]
        const map = new SDRMap()
        map.threshold = 0.7
        map.set(SDR.Subsample(SDR.OR([a,d]),8),b)
        map.set(SDR.Subsample(SDR.OR([a,c]),8),a)
        map.set(SDR.Subsample(SDR.OR([b,c]),8),a)
        map.set(SDR.Subsample(SDR.OR([b,d]),8),b)
        // if the map had a threshold of 0.5 ths map would return a & b
        var state = map.get(SDR.Subsample(SDR.OR([a,d]),8))
        expect(state).to.deep.equal(b)
    })

    it('should get a value of a large key', () => {
        let map = new SDRMap()
        map.population = 32
        var a = [5, 43, 74, 100, 143, 191, 218, 243]
        var b = [2, 35, 64, 109, 139, 187, 195, 234]
        var c = [17, 46, 86, 123, 156, 189, 212, 251]
        var d = [19, 33, 95, 124, 149, 187, 205, 241]
        map.set(SDR.OR([a,b,c,d]),[11,12,13,14,15,16,17,18])
        expect(map.get(SDR.OR([a,b,c,d]))).to.deep.equal([11,12,13,14,15,16,17,18])
        expect(map.get(SDR.Subsample(SDR.OR([a,b,c,d]),17))).to.deep.equal([11,12,13,14,15,16,17,18])
    })

})

describe('SDRAMap', () => {

    it('should store and retrieve an analog value', () => {
        const map = new SDRAMap()
        map.set([1,2,3,4,5,6,7,8],[11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18])
        const result = map.get([1,2,3,4,5,6,7,8])
        expect(result).to.deep.equal([11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18])
    })

})

describe('SDRDictionary', () => {

    it('should assign an index array to a string', () => {
        const dict = new SDRDictionary()
        dict.set([1,2,3,4,5,6,7,8],'white')
        expect(dict.get([1,2,3,4,5,6,7,8])).to.equal('white')
    })

    it('should get a string from index array with missing bits', () => {
        const dict = new SDRDictionary()
        dict.set([1,2,3,4,5,6,7,8],'white')
        expect(dict.get([1,2,4,5,8])).to.equal('white')
    })

    it('should not get a string from index array with too many missing bits', () => {
        const dict = new SDRDictionary()
        dict.set([1,2,3,4,5,6,7,8],'white')
        expect(dict.get([1,2,4,5])).to.equal(null)
    })

    it('should get the key from the value', () => {
        const dict = new SDRDictionary()
        dict.set([1,2,3,4,5,6,7,8],'white')
        expect(dict.get('white')).to.deep.equal([1,2,3,4,5,6,7,8])
    })

    it('should get multiple values from a key that overlaps', () => {
        const dict = new SDRDictionary()
        dict.set([1,2,3,4,5,6,7,8],'white')
        dict.set([9,10,11,12,13,14,15,16],'black')
        expect(dict.get([4,5,6,7,8,9,10,11,12,13])).to.deep.equal(['white','black'])
    })

})

describe('SDRRepository', () => {

    it('should store sdrs and retrieve matching ones in order of similarity', () => {
        const repo = new SDRRepository()
        const sdr1 = [1,2,3,4,5,6,7,8]
        var sdr2 = [7,8,9,10,11,12,13,14]
        var sdr3 = [8,9,10,11,12,13,14,15]
        var sdr4 = [11,12,13,14,15,16,17,18]
        repo.add(sdr1)
        repo.add(sdr2)
        repo.add(sdr3)
        repo.add(sdr4)
        const result = repo.get(sdr1)
        expect(result).to.deep.equal([
            [ 1, 2, 3, 4, 5, 6, 7, 8 ],
            [ 7, 8, 9, 10, 11, 12, 13, 14 ],
            [ 8, 9, 10, 11, 12, 13, 14, 15 ]
        ])
    })

})

describe('Matrix', () => {

    it('should create a matrix', () => {
        var matrix = Matrix.create({size:4,value:1})
        expect(matrix).to.deep.equal([
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1],
            [1,1,1,1]
        ])
    })

    it('should process a matrix', () => {
        var matrix = Matrix.create({size:4,value:1})
        var doubled = Matrix.process({matrix,operation: val => {
            return val * 2
        }})
        expect(doubled).to.deep.equal([
            [2,2,2,2],
            [2,2,2,2],
            [2,2,2,2],
            [2,2,2,2]
        ])
    })

    it('should merge multiple matrices', () => {
        var m1 = Matrix.create({size:4,value:[1,2]})
        var m2 = Matrix.create({size:4,value:[3,4]})
        var merged = Matrix.merge([m1,m2])
        expect(merged).to.deep.equal([
            [[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]]],
            [[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]]],
            [[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]]],
            [[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]],[[1,2],[3,4]]]
        ])
    })

    it('should process an SDR matrix', () => {
        var m1 = Matrix.create({size:4,value:[1,2,3,4,5,6,7,8]})
        var m2 = Matrix.create({size:4,value:[5,6,7,8,9,10,11,12]})
        var merged = Matrix.merge([m1,m2])
        var processed = Matrix.process({matrix:merged,operation: (sdrs) => {
            return SDR.AND(sdrs)
        }})
        expect(processed).to.deep.equal([
            [[5,6,7,8],[5,6,7,8],[5,6,7,8],[5,6,7,8]],
            [[5,6,7,8],[5,6,7,8],[5,6,7,8],[5,6,7,8]],
            [[5,6,7,8],[5,6,7,8],[5,6,7,8],[5,6,7,8]],
            [[5,6,7,8],[5,6,7,8],[5,6,7,8],[5,6,7,8]]
        ])
    })

    it('should partition a matrix', () => {
        var matrix = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10,11,12],
            [13,14,15,16]
        ]
        var partitioned = Matrix.partition({matrix,size:2})
        expect(partitioned).to.deep.equal([
            [ [[1,2],[5,6]], [[3,4],[7,8]] ],
            [ [[9,10],[13,14]], [[11,12],[15,16]] ]
        ])
    })

    it('should get a neighborhood of a cell from a matrix', () => {
        var matrix = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10,11,12],
            [13,14,15,16]
        ]
        var neighbors = Matrix.neighborhood({matrix,x:1,y:2,size:3})
        expect(neighbors).to.deep.equal([5,6,7,9,10,11,13,14,15])
        var neighbors = Matrix.neighborhood({matrix,x:3,y:1,size:3,fallback:0})
        expect(neighbors).to.deep.equal([3,4,0,7,8,0,11,12,0])
    })

    it('should convolve a matrix', () => {
        var matrix = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10,11,12],
            [13,14,15,16]
        ]
        var convolved = Matrix.convolve({matrix,size:3})
        expect(convolved).to.deep.equal([
            [
                [ 0, 0, 0, 0, 1, 2, 0, 5, 6 ],
                [ 0, 0, 0, 1, 2, 3, 5, 6, 7 ],
                [ 0, 0, 0, 2, 3, 4, 6, 7, 8 ],
                [ 0, 0, 0, 3, 4, 0, 7, 8, 0 ]
            ],
            [
                [ 0, 1, 2, 0, 5, 6, 0, 9, 10 ],
                [ 1, 2, 3, 5, 6, 7, 9, 10, 11 ],
                [ 2, 3, 4, 6, 7, 8, 10, 11, 12 ],
                [ 3, 4, 0, 7, 8, 0, 11, 12, 0 ]
            ],
            [
                [ 0, 5, 6, 0, 9, 10, 0, 13, 14 ],
                [ 5, 6, 7, 9, 10, 11, 13, 14, 15 ],
                [ 6, 7, 8, 10, 11, 12, 14, 15, 16 ],
                [ 7, 8, 0, 11, 12, 0, 15, 16, 0 ]
            ],
            [
                [ 0, 9, 10, 0, 13, 14, 0, 0, 0 ],
                [ 9, 10, 11, 13, 14, 15, 0, 0, 0 ],
                [ 10, 11, 12, 14, 15, 16, 0, 0, 0 ],
                [ 11, 12, 0, 15, 16, 0, 0, 0, 0 ]
            ]
        ])
    })

})

describe('Graph', () => {

    it('should compute', () => {
        const graph = Graph.Compute({
            1: {type:'sdr',state:[1,2,3,4,5,6,7,8]},
            2: {type:'sdr',state:[5,6,7,8,9,10,11,12]},
            3: {type:'and',sources:[1,2]}
        })
        expect(graph[3].state).to.deep.equal([5,6,7,8])
    })

    it('can build a graph', () => {
        const graph = new Graph()
        const a = graph.create({type:'sdr',state:[1,2,3,4,5,6,7,8]})
        const b = graph.create({type:'sdr',state:[5,6,7,8,9,10,11,12]})
        const c = graph.create({type:'and'})
        graph.connect(a,c).connect(b,c)
        graph.compute()
        expect(c.state).to.deep.equal([5,6,7,8])
    })

    it('can build a graph from json', () => {
        const graph = new Graph({
            a: {type:'sdr',state:[1,2,3,4,5,6,7,8]},
            b: {type:'sdr',state:[5,6,7,8,9,10,11,12]},
            c: {type:'and',sources:['a','b']}
        })
        graph.compute()
        expect(graph.nodes['c'].state).to.deep.equal([5,6,7,8])
    })

})