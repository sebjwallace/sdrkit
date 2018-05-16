const chai = require('chai')
const expect = chai.expect
const sk = require('../main')

describe('Operations', () => {

    it('should calculate OR', () => {
        var a = {4:1,8:1,12:1,15:1}
        var b = {2:1,7:1,19:1,24:1}
        expect(sk.or([a,b])).to.deep.equal({
            2:1,4:1,7:1,8:1,12:1,15:1,19:1,24:1
        })
    })

    it('should calculate AND', () => {
        var a = {4:1,8:1,12:1,15:1}
        var b = {4:1,7:1,12:1,24:1}
        expect(sk.and([a,b])).to.deep.equal({
            4:1, 12: 1
        })
    })

})

describe('Store', () => {

    it('should find sdrs based on similarity', () => {
        var store = new sk.Store()
        store.insert({2:1,4:1,9:1})
            .insert({4:1,5:1,8:1})
            .insert({1:1,4:1,9:1})
        expect(store.find({2:1,4:1,9:1})).to.deep.equal([
            {2:1,4:1,9:1},
            {1:1,4:1,9:1},
            {4:1,5:1,8:1}
        ])
        store = new sk.Store()
        store.insert({2:1,4:1,9:1})
            .insert({2:2,4:1,9:1})
        expect(store.find({2:2,4:1,9:1})).to.deep.equal([
            {2:2,4:1,9:1},
            {2:1,4:1,9:1}
        ])
    })

})