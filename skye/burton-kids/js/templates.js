var tpls = {
	nickname: '',
	age: '',
	city: '',
    styles: [
        {
            burton: {align: 'center', x: null, y: 0.72, size: 1.6, clr: '#39a2b7'},
            nameAge: {align: 'center', x: null, y: 0.8, size: 1.6, clr: '#39a2b7'},
            city: {align: 'center', x: null, y: 0.88, size: 1.6, clr: '#39a2b7'},
            backlayer: {y: 0.68, clr: 'rgba(0,0,0,0.5)'},
            shadow: {x: 0, y: 0, w: 2, clr: '#fff'}
        }
    ],
    apply: function(index){
        var t = this.styles[index];
        var size = {w: $('#photo').width(), h: $('#photo').height()};
        
        $('.plus-burton')
        .css({top: size.h * t.burton.y});
        $('.plus-burton')
        .css({
            'text-align': t.burton.align,
            'color': t.burton.clr,
            'font-size': t.burton.size + 'em'
        });
        
        var txtName = this.nickname;
        var txtAge = this.age;
        if (!txtName || !txtName.length)
            txtName = '';
        if (txtAge)
            txtAge = txtAge.replace(/岁/g, '');
        if (txtAge && txtAge.length > 0){
            txtAge += '岁';
            if (txtName && txtName.length)
                txtName += '&nbsp;&nbsp;&nbsp;&nbsp;';
        }else{
            txtAge = '';
        }
        $('.plus-nameage')
        .html(txtName + txtAge)
        .css({
            'text-align': t.nameAge.align,
            'font-size': t.nameAge.size + 'em',
            'color': t.nameAge.clr,
            'top': size.h * t.nameAge.y
        });
        
        $('.plus-city')
        .html(this.city)
        .css({
            'text-align': t.city.align,
            'top': size.h * t.city.y,
            'color': t.city.clr,
            'font-size': t.city.size + 'em'
        });
        
        $('.plus-backlayer')
        .css({
            'top': size.h * t.backlayer.y,
            'height': size.h * (1 - t.backlayer.y),
            'background-color': t.backlayer.clr,
        });

        $('.plus').css({'text-shadow': t.shadow.x + 'px ' + t.shadow.y + 'px ' + t.shadow.w + 'px ' + t.shadow.clr}).show();
    },
};