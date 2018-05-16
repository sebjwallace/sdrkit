
module.exports = Ops = {

    filter({sdr,min=1,max=Infinity,ceil=Infinity}={}){
        const out = {}
        for(var i in sdr)
            if(sdr[i] >= min && sdr[i] <= max)
                out[i] = sdr[i] > ceil ? ceil : sdr[i]
        return out
    },

    or(sdrs){
        const out = {}
        for(var i = 0; i < sdrs.length; i++)
            for(var j in sdrs[i])
                out[j] = 1
        return out
    },

    and(sdrs){
        return Ops.filter({sdr:Ops.add(sdrs),min:2,ceil:1})
    },

    xor(){},

    add(sdrs){
        const out = {}
        for(var i = 0; i < sdrs.length; i++)
            for(var j in sdrs[i])
                out[j] = (out[j] || 0) + 1
        return out
    },

    sub(){},

    mult(){},

    sim(sdr1,sdr2){
        let d = 0
        for(var i in sdr1)
            if(sdr2[i])
                d += 1 / (Math.abs(sdr1[i] - sdr2[i]) + 1)
        return d
    }

}