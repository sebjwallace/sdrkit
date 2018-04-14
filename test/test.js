const chai = require('chai')
const expect = chai.expect
const SDR = require('../src/core/SDR')
const SDRMap = require('../src/core/SDRMap')
const SDRDictionary = require('../src/core/SDRDictionary')
const Graph = require('../src/core/Graph')

describe('SDR Instance', () => {

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
    })

    it('should AND indices from another set', () => {
        const sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.and([8,22,37,44,54,61,79,99])).to.deep.equal([8,44,79])
    })

    it('should XOR indices from another set', () => {
        const sdr = new SDR({indices:[1,8,14,19,27,44,52,79]})
        expect(sdr.xor([8,22,37,44,54,61,79,99])).to.deep.equal([1,14,19,22,27,37,52,54,61,99])
    })

    it('should return a subsample of the origional index array', () => {
        const sdr = new SDR({indices:[1,2,3,4,5,6,7,8]})
        expect(sdr.subsample(4)).to.deep.equal([1,3,5,7])
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

    it('should set and get value with reoccuring indices', () => {
        let map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,12,13,14,15,16,17,18,18])
        expect(map.get([1,2,3,4,5,6,7,8])).to.deep.equal([11,12,12,13,14,15,16,17,18,18])
        map = new SDRMap()
        map.set([9,12,56,150,285,431,559,723],[2,2,2,2,104,108,204,204,307])
        expect(map.get([9,12,56,150,285,431,559,723])).to.deep.equal([2,2,2,2,104,108,204,204,307])
        map = new SDRMap()
    })

    it('should set and get value with reoccuring indices and key with missing bits', () => {
        let map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,12,13,14,15,16,17,18,18])
        expect(map.get([1,3,4,5,7,8])).to.deep.equal([11,12,12,13,14,15,16,17,18,18])
        map = new SDRMap()
        map.set([9,12,56,150,285,431,559,723],[2,2,2,2,104,108,204,204,307])
        expect(map.get([9,12,56,285,723])).to.deep.equal([2,2,2,2,104,108,204,204,307])
        expect(map.get([9,12,56,285])).to.equal(null)
        map = new SDRMap()
        const sdr = new SDR()
        map.set(sdr.indices,[59,128,490,490,571,612,749,749,749,749,862,988,988,1011,1011,1011,1011,1011])
        expect(map.get(sdr.indices)).to.deep.equal([59,128,490,490,571,612,749,749,749,749,862,988,988,1011,1011,1011,1011,1011])
        expect(map.get(sdr.subsample(5))).to.deep.equal([59,128,490,490,571,612,749,749,749,749,862,988,988,1011,1011,1011,1011,1011])
        expect(map.get(sdr.subsample(6))).to.deep.equal([59,128,490,490,571,612,749,749,749,749,862,988,988,1011,1011,1011,1011,1011])
        expect(map.get(sdr.subsample(7))).to.deep.equal([59,128,490,490,571,612,749,749,749,749,862,988,988,1011,1011,1011,1011,1011])
        expect(map.get(sdr.subsample(4))).to.equal(null)
    })

    it('should set and get value with reoccuring indices and key with too many bits', () => {
        let map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,12,13,14,15,16,17,18,18])
        expect(map.get([1,2,2,3,4,5,5,5,5,6,7,8])).to.deep.equal([11,12,12,13,14,15,16,17,18,18])
        map = new SDRMap()
        map.set([9,12,56,150,285,431,559,723],[2,2,2,2,104,108,204,204,307])
        expect(map.get([12,56,150,150,150,150,150,150,285,559,723,723,723])).to.deep.equal([2,2,2,2,104,108,204,204,307])
    })

    it('should get a value with a key with reoccuring indices', () => {
        let map = new SDRMap()
        map.set([1,2,2,3,4,5,6,7,8,8],[11,12,13,14,15,16,17,18])
        expect(map.get([1,2,2,3,4,5,6,7,8,8])).to.deep.equal([11,12,13,14,15,16,17,18])
    })

    it('should get a value with reoccuring indices with a key with reoccuring indices', () => {
        let map = new SDRMap()
        map.set([1,2,2,3,4,5,6,7,8,8],[11,12,13,14,14,15,16,17,18,18,18,18])
        expect(map.get([1,2,2,3,4,5,6,7,8,8])).to.deep.equal([11,12,13,14,14,15,16,17,18,18,18,18])
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

// describe('Graph', () => {

//     it('should compute', () => {
//         const graph = Graph.Compute([
//             {id:1,type:'sdr',state:[1,2,3,4,5,6,7,8]},
//             {id:2,type:'sdr',state:[5,6,7,8,9,10,11,12]},
//             {id:3,type:'intersect',sources:[1,2]}
//         ])
//         expect(graph[2].state).to.deep.equal([5,6,7,8])
//     })

//     it('can build a graph', () => {
//         const graph = new Graph()
//         const a = graph.create({type:'sdr',state:[1,2,3,4,5,6,7,8]})
//         const b = graph.create({type:'sdr',state:[5,6,7,8,9,10,11,12]})
//         const c = graph.create({type:'intersect'})
//         graph.connect(a,c).connect(b,c)
//         expect(graph.compute()[2].state).to.deep.equal([5,6,7,8])
//     })

// })