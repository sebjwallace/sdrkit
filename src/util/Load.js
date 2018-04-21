
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