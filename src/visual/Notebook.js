
module.exports = {

    print: function(id,a,b){
        $('[nb="'+id+'"]').after(
            '<div class="notebook-print">'
                + a.toString() + '&nbsp;' + (b || '').toString()
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