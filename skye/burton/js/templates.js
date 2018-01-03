var tpls = {
	nickname: '',
	words: '',
    styles: [
        {
            logo: {x: 0.53, y: 0.03, w: 0.4, file: 'img/7-logoa.png'},
            burton: {x: 0.05, y: 0.7, size1: 1.1, size2: 1.3, clr1: '#fff', clr2: '#f00'},
            name: {x: 0.05, y: 0.8, size: 1.2, clr: '#fff'},
            words: {x: 0.05, y: 0.82, size1: 1.2, size2: 2.4, clr1: '#fff', clr2: '#fff'},
            shadow: {clr: '#444'}
        },
        {
            logo: {x: 0.05, y: 0.03, w: 0.4, file: 'img/7-logoa.png'},
            burton: {x: 0.05, y: 0.7, size1: 1.1, size2: 1.3, clr1: '#fff', clr2: '#f00', ralign: true},
            name: {x: 0.05, y: 0.77, size: 1.2, clr: '#fff', ralign: true},
            words: {x: 0.05, y: 0.82, size1: 1.2, size2: 2.4, clr1: '#fff', clr2: '#fff', ralign: true},
            shadow: {clr: '#444'}
        },
        {
            logo: {x: 0.53, y: 0.03, w: 0.4, file: 'img/7-logob.png'},
            burton: {x: 0.05, y: 0.7, size1: 1.1, size2: 1.3, clr1: '#222', clr2: '#f00'},
            name: {x: 0.05, y: 0.8, size: 1.2, clr: '#222'},
            words: {x: 0.05, y: 0.82, size1: 1.2, size2: 2.4, clr1: '#222', clr2: '#888'},
            shadow: {clr: '#fff'}
        },
        {
            logo: {x: 0.05, y: 0.03, w: 0.4, file: 'img/7-logob.png'},
            burton: {x: 0.05, y: 0.7, size1: 1.1, size2: 1.3, clr1: '#222', clr2: '#f00', ralign: true},
            name: {x: 0.05, y: 0.76, size: 1.2, clr: '#222', ralign: true},
            words: {x: 0.05, y: 0.82, size1: 1.2, size2: 2.4, clr1: '#222', clr2: '#888', ralign: true},
            shadow: {clr: '#fff'}
        }
    ],
    apply: function(index){
        var t = this.styles[index];
        var size = {w: $('#photo').width(), h: $('#photo').height()};
        
        $('.plus-logo')
        .css({left: size.w * t.logo.x, top: size.h * t.logo.y})
        .attr({width: size.w * t.logo.w, src: t.logo.file});
        
        $('.plus-burton')
        .css({top: size.h * t.burton.y});
        if (t.burton.ralign)
            $('.plus-burton').css({left: '', right: size.w * t.burton.x});
        else
            $('.plus-burton').css({left: size.w * t.burton.x, right: ''});
        $('.plus-burton .s1')
        .css({color: t.burton.clr1, 'font-size': t.burton.size1 + 'em'});
        $('.plus-burton .s2')
        .css({color: t.burton.clr2, 'font-size': t.burton.size2 + 'em'});
        
        $('.plus-name')
        .html(this.nickname)
        .css({'font-size': t.name.size + 'em', color: t.name.clr, top: size.h * t.name.y});
        if (t.name.ralign)
            $('.plus-name').css({left: '', right: size.w * t.name.x});
        else
            $('.plus-name').css({left: size.w * t.name.x, right: ''});

        $('.plus-words')
        .css({top: size.h * t.words.y});
        if (t.words.ralign)
            $('.plus-words').css({left: '', right: size.w * t.words.x});
        else
            $('.plus-words').css({left: size.w * t.words.x, right: ''});
        $('.plus-words .s1')
        .css({color: t.words.clr1, 'font-size': t.words.size1 + 'em'});
        $('.plus-words .s2')
        .html(this.words)
        .css({color: t.words.clr2, 'font-size': t.words.size2 + 'em'});

        $('.plus').css({'text-shadow': '2px 2px 2px ' + t.shadow.clr}).show();
    },
};