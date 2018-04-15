
module.exports = {

    print: function(id,a,b){
        var $fellow = $('.nb-ref-'+id)
        $fellow = $fellow.length ? $fellow.last() : '[nb="'+id+'"]'
        function format(obj){
            if(Array.isArray(obj))
                return '[' + obj.join(', ') + ']'
            else if(typeof obj == 'object')
                return JSON.stringify(obj)
            return (obj || '').toString()
        }
        $($fellow).after(
            '<div class="notebook-print nb-ref-'+id+'">'
                + format(a) + '&nbsp;' + format(b)
            + '</div>'
        )
    },

    render: function(){

        $('[nb]').each(function(){
            $(this).after(
                '<pre class="notebook"><code class="language-javascript">'
                    + $(this).html().split(';;').join('<br>')
                + '</code></pre>'
            )
        })

    }

}