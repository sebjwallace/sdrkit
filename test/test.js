const chai = require('chai')
const expect = chai.expect
const SDR = require('../src/core/SDR')
const SDRMap = require('../src/core/SDRMap')
const SDRDictionary = require('../src/core/SDRDictionary')
const Graph = require('../src/core/Graph')

describe('SDR', () => {

    it('should create a union of many index arrays', () => {
        expect(SDR.Union([[1,2],[3,4]])).to.deep.equal([1,2,3,4])
    })

    it('should create a union of many index arrays without duplicating indices that intersect', () => {
        expect(SDR.Union([[1,1],[2,2]])).to.deep.equal([1,2])
    })

    it('should return only the bits that intersect', () => {
        expect(SDR.Intersect([[1,2,3,4,5],[4,5,6,7,8]])).to.deep.equal([4,5])
    })

    it('should return only the bits that do not intersect', () => {
        expect(SDR.Difference([[1,2,3,4,5],[4,5,6,7,8]])).to.deep.equal([1,2,3,6,7,8])
    })

    it('should return a subtraction of the second from the first', () => {
        expect(SDR.Subtract([[1,2,3,4,5],[2,3,4]])).to.deep.equal([1,5])
    })

    it('should return a subsample of the origional index array', () => {
        expect(SDR.Subsample([1,2,3,4,5,6,7,8],{size:4})).to.deep.equal([1,3,5,7])
    })

    it('should return a sorted list of index array with the most similar at index 0', () => {
        expect(SDR.Sort([1,2,3,4,5,6,7,8],[[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]))
            .to.deep.equal([[1,2,3,4,5],[1,2,3,4],[1,2,3],[1,2]])
    })

    it('should return a the most similar index array', () => {
        expect(SDR.Match([1,2,3,4,5,6,7,8],[[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]))
            .to.deep.equal([1,2,3,4,5])
    })

    it('should initialise with a random set of indices', () => {
        expect(new SDR().indices.length).to.equal(8)
    })

    it('should initialise from a binary array', () => {
        expect(new SDR({binaryArray:[1,0,1,1,0]}).indices).to.deep.equal([0,2,3])
    })

    it('should return indices from call', () => {
        expect(new SDR({binaryArray:[1,0,1,1,0]}).get()).to.deep.equal([0,2,3])
    })

})

describe('SDRMap', () => {

    it('should assign a key with a value', () => {
        const map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([1,2,3,4,5,6,7,8])).to.deep.equal([11,12,13,14,15,16,17,18])
    })

    it('should get value with missing bits', () => {
        const map = new SDRMap()
        map.set([1,2,3,4,5,6,7,8],[11,12,13,14,15,16,17,18])
        expect(map.get([2,3,4,5,7,8])).to.deep.equal([11,12,13,14,15,16,17,18])
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

describe('Graph', () => {

    it('should compute', () => {
        const graph = Graph.Compute([
            {id:1,type:'sdr',state:[1,2,3,4,5,6,7,8]},
            {id:2,type:'sdr',state:[5,6,7,8,9,10,11,12]},
            {id:3,type:'intersect',sources:[1,2]}
        ])
        expect(graph[2].state).to.deep.equal([5,6,7,8])
    })

    it('can build a graph', () => {
        const graph = new Graph()
        const a = graph.create({type:'sdr',state:[1,2,3,4,5,6,7,8]})
        const b = graph.create({type:'sdr',state:[5,6,7,8,9,10,11,12]})
        const c = graph.create({type:'intersect'})
        graph.connect(a,c).connect(b,c)
        expect(graph.compute()[2].state).to.deep.equal([5,6,7,8])
    })

})