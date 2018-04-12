
module.exports = {

    row({container=document.body,width=900,height=10,arr} = {}){
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        container.appendChild(canvas)
        const ctx = canvas.getContext('2d')
        for(var i = 0; i < arr.length; i++){
            ctx.fillStyle = arr[i] ? 'black' : 'rgba(0,0,0,0.1)'
            ctx.fillRect(i*4,0,4,4)
        }
    }

}