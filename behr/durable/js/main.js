var main = (function(){
	var scrn = {size: {w:0, h:0}, aspect: 0, scale: 1};
	var aboutArgs = {top: 0, bottom: 0, middle: 0, curIndex: 0};
	var curPage = 'face';
	var curQuestIndex = -1;
	var curAboutIndex = 0;
	var questions = [
		{count: 4, result: [], answer: [0,1,2]},
		{count: 5, result: [], answer: [0,2,3,4]},
		{count: 3, result: [], answer: [0,1,2]},
		{count: 4, result: [], answer: [0,1,2,3]},
	];
	var questTopMargin = 222;
	var questImgHeight = 737;
	var questTopPadding = [400,425,482,455];
	var statsPrefix = 'durable-';
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
			$('section.about .btns .prev').on('vclick', function(e){
				e.preventDefault();
				main.switchAboutPage(-1);
			});
			$('section.about .btns .next').on('vclick', function(e){
				e.preventDefault();
				main.switchAboutPage(1);
			});
			// $('section.about .btns img.back').on('vclick', function(e){
			// 	e.preventDefault();
			// 	main.onClickAboutBack();
			// });
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
			var opty = scrn.size.w * 0.88;
			$('section.result .opts').css('top', opty + 'px');
			$('section.result .opts img.replay').on('vclick', function(e){
				e.preventDefault();
				main.replay();
			});
			$('section.result .opts img.answers').on('vclick', function(e){
				e.preventDefault();
				main.showPage('answers');
			});
			$('section.result .btns img.share').on('vclick', function(e){
				e.preventDefault();
				$('#sharetip').show();
				main.stats('clickShare');
				setTimeout(function(){$('#sharetip').hide();}, 1000);
			});
			$('section.result .btns img.focus').on('vclick', function(e){
				e.preventDefault();
				main.stats('clickClub');
				setTimeout(function(){
					window.location.href = 'http://mp.weixin.qq.com/s?__biz=MzA5MTY2NTMxMg==&mid=205540727&idx=1&sn=df5707a0233b7e14fa054df5ec06bb39#rd';
				}, 200);
			});
			$('section.answers .bns img.back').on('vclick', function(e){
				e.preventDefault();
				main.showPage('result');
			});
			$('section.answers .bns img.prev').on('vclick', function(e){
				e.preventDefault();
				main.switchAnswerPage(0);
			});
			$('section.answers .bns img.next').on('vclick', function(e){
				e.preventDefault();
				main.switchAnswerPage(1);
			});
			$('section.game').css({
				'padding-top': scrn.size.w * (questTopMargin/640) + 'px'
			})
			this.stats('visits');

			curQuestIndex = -1;
		},
		stats: function(key){
			$.ajax({
				url: '../lib/stats.php',
				data: {
					key: statsPrefix + key,
					addval: 1
				},
				dataType: 'json',
				error: function(){
					// alert('error stats');
				},
				success: function(resp){
					// alert(JSON.stringify(resp));
				}
			});
		},
		showPage: function(name){
			$('section').hide();
			$('section.'+name).show();
			curPage = name;
			if (curPage == 'game'){
				$('body').css('background-color', '#0E0603');
				this.nextQuestion();
				this.stats('clickStart');
			}
			else if (curPage == 'result'){
				this.onFinishGame();
			}
			else if (curPage == 'answers'){
				this.switchAnswerPage(0);
				this.stats('clickAnswers');
			}
			else if (curPage == 'about'){
				this.switchAboutPage(0);
				this.stats('clickAbout');
			}
		},
		replay: function(){
			curQuestIndex = -1;
			for (var i = 0; i < questions.length; ++i){
				this.clearAnswers(i);
			}
			for (var i = 0; i < 3; ++i)
				this.onClickAnswer(i, -1);
			this.showPage('game');
			this.stats('clickRetry');
		},
		switchAnswerPage: function(index){
			if (index == 0){
				$('section.answers .content.a1').show();
				$('section.answers .content.a2').hide();
				$('section.answers .bns img.back').show();
				$('section.answers .bns img.prev').hide();
				$('section.answers .bns img.next').show();
				$('section.answers .bns img.club').hide();
			}else{
				$('section.answers .content.a1').hide();
				$('section.answers .content.a2').show();
				$('section.answers .bns img.back').hide();
				$('section.answers .bns img.prev').show();
				$('section.answers .bns img.next').hide();
				$('section.answers .bns img.club').show();
			}
		},
		onClickAboutBack: function(){
			$('section.about img.surface').attr('src', 'images/about.png');
			aboutArgs.curIndex = 0;
			$('section.about .btns img.back').hide();
		},
		switchAboutPage: function(add){
			if (add == 0)
				curAboutIndex = 0;
			else
				curAboutIndex += add;
			for (var i = 1; i <= 3; i++) {
				var dom = $('section.about img.surface.s' + i);
				if (i == curAboutIndex + 1)
					dom.show();
				else
					dom.hide();
			};
			var sel = 'section.about .btns ';
			if (curAboutIndex == 0){
				$(sel + '.prev').hide();
				$(sel + '.next').show();
				$(sel + '.start').hide();
			} else if (curAboutIndex == 2){
				$(sel + '.prev').show();
				$(sel + '.next').hide();
				$(sel + '.start').show();
			}else{
				$(sel + '.prev').show();
				$(sel + '.next').show();
				$(sel + '.start').hide();
			}
		},
		clearAnswers: function(q){
			var quest = questions[q];
			for (var i = 0; i < quest.count; ++i){
				var sel = 'section.game .qa.qa'+(q+1)+' img.a[a="'+i+'"]';
				var img = 'images/q'+(q+1)+'a'+(i+1)+'.png';
				$(sel).attr('src', img);
			}
			quest.result.length = 0;
		},
		onClickAnswer: function(q, a){
			q = Number(q); a = Number(a);
			if (a >= 0 && q != curQuestIndex)
				return;
			if (a < 0)
				return;
			var quest = questions[q];
			if (quest.answer.length === 1)
				this.clearAnswers(q);
			var exists = quest.result.indexOf(a) >= 0;
			var sel = 'section.game .qa.qa'+(q+1)+' img.a[a="'+a+'"]';
			var img = 'images/q'+(q+1)+'a'+(a+1)+(exists?'':'p')+'.png';
			$(sel).attr('src', img);
			if (exists)
				quest.result.splice(quest.result.indexOf(a), 1);
			else
				quest.result.push(a);
		},
		prevQuestion: function(){
			if (--curQuestIndex <= 0){
				curQuestIndex = 0;
			}
			this.updateGameView();
		},
		nextQuestion: function(){
			if (curQuestIndex >= 0 && questions[curQuestIndex].result.length == 0){
				alert('你还没有选择你的答案哦~');
				return;
			}
			if (++curQuestIndex >= questions.length){
				this.showPage('result');
				return;
			}
			this.updateGameView();
		},
		updateGameView: function(){
			$('section.game .qa').css({
				'height': scrn.size.w * ((questImgHeight - questTopPadding[curQuestIndex])/640) + 'px',
				'padding-top': scrn.size.w * (questTopPadding[curQuestIndex]/640) + 'px'
			});
			var bn1 = $('section.game img.prev');
			var bn2 = $('section.game img.next');
			var bn3 = $('section.game img.commit');
			if (curQuestIndex == 0){
				bn1.hide(); bn2.show(); bn3.hide();
			}else if (curQuestIndex == questions.length - 1){
				bn1.show(); bn2.hide(); bn3.show();
			}else{
				bn1.show(); bn2.show(); bn3.hide();
			}
			$('section.game .bns').css('padding-left', curQuestIndex == 0 ? '35%' : '12%');
			$('section.game .qa').hide();
			$('section.game .qa.qa' + (curQuestIndex+1)).show();
		},
		onFinishGame: function(){
			var allright = true;
			for (var i = 0; allright && i < questions.length; i++) {
				var q = questions[i];
				if (q.result.length != q.answer.length)
					allright = false;
				else{
					for (var i1 = 0; i1 < q.answer.length; i1++) {
						if (q.result.indexOf(q.answer[i1]) < 0){
							allright = false;
							break;
						}
					};
				}
			};
			this.stats('finishes');
			if (allright){
				$('section.result .words img.allright').show();
				$('section.result .words img.halfright').hide();
				this.stats('successes');
			}else{
				$('section.result .words img.allright').hide();
				$('section.result .words img.halfright').show();
				this.stats('fails');
			}
		}
	}
})();

$(function(){
  	if (/iPhone/.test(navigator.userAgent))
    	$('body').css('font-family', 'Heiti SC');
	weixin.init(function(){
        weixin.fillShare($.extend({}, weixin.info, {
            type: 'link',
            link: window.location.href,
            success: function(){
            	main.stats('shares');
            }
        }));
	});
    main.init();
});