var main = (function(){
	var scrn = {size: {w:0, h:0}, aspect: 0, scale: 1};
	var aboutArgs = {top: 0, bottom: 0, middle: 0, curIndex: 0};
	var curPage = 'face';
	var curQuestIndex = -1;
	var curAnswers = [[],[],[]];
	return {
		init: function(){
			scrn.size.w = $(window).width();
			scrn.size.h = $(window).height();
			scrn.aspect = scrn.size.w / scrn.size.h;
			scrn.scale = scrn.size.w / 640;

			$('section.face').css({
				width: scrn.size.w + 'px',
				height: scrn.size.w * 1080 / 640 + 'px'
			});
			$('section.face .content').css({
				top: scrn.size.w * 1.15 + 'px',
			});
			$('img.about').on('vclick', function(e){
				e.preventDefault();
				main.showPage('about');
			});
			$('img.start').on('vclick', function(e){
				e.preventDefault();
				main.showPage('game');
			});
			$('img.club').on('vclick', function(e){
				e.preventDefault();
				window.location.href = '../vip/';
			});
			aboutArgs.top = 211 / 320 * scrn.size.w;
			aboutArgs.bottom = 448 / 320 * scrn.size.w;
			aboutArgs.middle = scrn.size.w * 0.5;
			$('section.about img.surface').on('vclick', function(e){
				e.preventDefault();
				main.onClickAbout(e.pageX, e.pageY);
			});
			$('section.about .btns img.back').on('vclick', function(e){
				e.preventDefault();
				main.onClickAboutBack();
			});
			$('section.game img.prev').on('vclick', function(e){
				e.preventDefault();
				main.prevQuestion();
			});
			$('section.game img.next').on('vclick', function(e){
				e.preventDefault();
				main.nextQuestion();
			});
			$('section.game img.prev').hide();
			$('section.game img.commit').on('vclick', function(e){
				e.preventDefault();
				main.nextQuestion();
			}).hide();
			$('section.game .qa img.a').on('vclick', function(e){
				e.preventDefault();
				var q = $(this).attr('q');
				var a = $(this).attr('a');
				main.onClickAnswer(q, a);
			});
			var opty = scrn.size.w * 0.85;
			$('section.result .opts').css('top', opty + 'px');
			$('section.result .opts img.replay').on('vclick', function(e){
				e.preventDefault();
				main.replay();
			});
			$('section.result .opts img.answers').on('vclick', function(e){
				e.preventDefault();
				main.showPage('answers');
				setTimeout(function(){main.showPage('result');}, 3000);
			});
			$('section.result .btns img.share').on('vclick', function(e){
				e.preventDefault();
				$('#sharetip').show();
				setTimeout(function(){$('#sharetip').hide();}, 1000);
			});
			$('section.result .btns img.focus').on('vclick', function(e){
				e.preventDefault();
				window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzA5MTY2NTMxMg==&mid=205540727&idx=1&sn=df5707a0233b7e14fa054df5ec06bb39#rd';
			});

			curQuestIndex = -1;
		},
		showPage: function(name){
			$('section').hide();
			$('section.'+name).show();
			curPage = name;
			if (curPage == 'game')
				this.nextQuestion();
			else if (curPage == 'result')
				this.onFinishGame();
		},
		replay: function(){
			curQuestIndex = -1;
			for (var i = 0; i < curAnswers.length; ++i)
				curAnswers[i].length = 0;
			for (var i = 0; i < 3; ++i)
				this.onClickAnswer(i, -1);
			this.showPage('game');
		},
		onClickAboutBack: function(){
			$('section.about img.surface').attr('src', 'images/about.png');
			aboutArgs.curIndex = 0;
			$('section.about .btns img.back').hide();
		},
		onClickAbout: function(x, y){
			if (aboutArgs.curIndex > 0 || y < aboutArgs.top || y > aboutArgs.bottom)
				return;
			if (x > aboutArgs.middle){
				$('section.about img.surface').attr('src', 'images/about_c.png');
				aboutArgs.curIndex = 3;
			}
			else if (y < aboutArgs.top + (aboutArgs.bottom - aboutArgs.top) * 0.5){
				$('section.about img.surface').attr('src', 'images/about_a.png?v=2');
				aboutArgs.curIndex = 1;
			}
			else{
				$('section.about img.surface').attr('src', 'images/about_b.png');
				aboutArgs.curIndex = 2;
			}
			$('section.about .btns img.back').show();
		},
		onClickAnswer: function(q, a){
			q = Number(q); a = Number(a);
			if (a >= 0 && q != curQuestIndex)
				return;
			if (q == 0){
				for (var i = 0; i < 3; ++i){
					var tail = (i == a ? 'p' : '');
					var sel = 'section.game .qa.qa'+(q+1)+' img.a[a="'+i+'"]';
					var img = 'images/q'+(q+1)+'a'+(i+1)+tail+'.jpg';
					$(sel).attr('src', img);
				}
				curAnswers[q].length = 0;
				if (a >= 0)
					curAnswers[q].push(a);
			}else{
				if (a < 0)
					curAnswers[q].length = 0;
				else{
					var pos = curAnswers[q].indexOf(a);
					if (pos >= 0)
						curAnswers[q].splice(pos, 1);
					else
						curAnswers[q].push(a);
				}
				for (var i = 0; i < 4; ++i){
					var pos = curAnswers[q].indexOf(i);
					var tail = (pos >= 0 ? 'p' : '');
					var sel = 'section.game .qa.qa'+(q+1)+' img.a[a="'+i+'"]';
					var img = 'images/q'+(q+1)+'a'+(i+1)+tail+'.jpg';
					$(sel).attr('src', img);
				}
			}
		},
		prevQuestion: function(){
			if (--curQuestIndex <= 0){
				curQuestIndex = 0;
			}
			this.updateGameView();
		},
		nextQuestion: function(){
			if (curQuestIndex >= 0 && curAnswers[curQuestIndex].length == 0){
				alert('你还没有选择你的答案哦~');
				return;
			}
			if (++curQuestIndex >= 3){
				this.showPage('result');
				return;
			}
			this.updateGameView();
		},
		updateGameView: function(){
			var bn1 = $('section.game img.prev');
			var bn2 = $('section.game img.next');
			var bn3 = $('section.game img.commit');
			if (curQuestIndex == 0){
				bn1.hide(); bn2.show(); bn3.hide();
			}else if (curQuestIndex == 1){
				bn1.show(); bn2.show(); bn3.hide();
			}else{
				bn1.show(); bn2.hide(); bn3.show();
			}
			$('section.game .bns').css('padding-left', curQuestIndex == 0 ? '35%' : '20%');
			$('section.game .qa').hide();
			$('section.game .qa.qa' + (curQuestIndex+1)).show();
		},
		onFinishGame: function(){
			var allright = true;
			if (curAnswers[0].length == 0 || curAnswers[0][0] != 2)
				allright = false;
			else if (curAnswers[1].length != 3 || curAnswers[1].indexOf(3) >= 0)
				allright = false;
			else if (curAnswers[2].length != 2 || curAnswers[2].indexOf(1) < 0 || curAnswers[2].indexOf(2) < 0)
				allright = false;
			if (allright){
				$('section.result .words img.allright').show();
				$('section.result .words img.halfright').hide();
			}else{
				$('section.result .words img.allright').hide();
				$('section.result .words img.halfright').show();
			}
		}
	}
})();

$(function(){
  	if (/iPhone/.test(navigator.userAgent))
    	$('body').css('font-family', 'Heiti SC');
    weixin.init();
    main.init();
});