
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