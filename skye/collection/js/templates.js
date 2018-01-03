var tpls = {
    styles: [
        {
            class: 'plus-logo-top', file: 'img/7-logoa.png',
        },
        {
            class: 'plus-logo-btm', file: 'img/7-logob.png',
        },
    ],
    apply: function(index){
        for (var i = 0; i < tpls.styles.length; ++i){
            $('img.plus-logo').removeClass(tpls.styles[i].class);
        }

        var t = this.styles[index];
        $('img.plus-logo')
        .addClass(t.class)
        .attr({src: t.file})
        .show();
    },
};