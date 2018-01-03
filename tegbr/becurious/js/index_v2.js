var android_apk_url = 'http://www.tegbr.com/apk/gbr-socialmedia-release-1.0.10-110.apk';
// visits: '进入H5活动页面'},
// clickDownAndroid: '点击安卓下载'},
// clickDownIos: '点击苹果下载'},
// starts: '点击开始答题'},
// successes: '完成十道题目60%及以上'},
// fails: '完成十道题目60%以下'},
// shares: '点击分享给好友'}

var main = (function(){
	var user = {id: null, nickname: null, rank: 0, rank06: 0, bestScore: 0};
	var curPage = 'face';
	var curQuestIndex = 0;
	var curSelAnswer = -1;
	var lockingUI = false;
	var totalScore = 0;
	var everDown = false;
	var scrn = {size: {w:0, h:0}, aspect: 0, scale: 1};
	var rankList = null;
	return {
		init: function(){
			scrn.size.w = $(window).width();
			scrn.size.h = $(window).height();
			scrn.aspect = scrn.size.w / scrn.size.h;
			scrn.scale = scrn.size.w / 640;
			this.stats('visits');

			var canvasSize = scrn.size.w * 0.5;
			$('#score').attr({'width': canvasSize, 'height': canvasSize});

			$('img.download').on('vclick', function(e){
				e.preventDefault();
				main.showPage('download');
			});
			$('img.start').on('vclick', function(e){
				e.preventDefault();
				main.showPage('main');
			});
			$('img.confirm').on('vclick', function(e){
				e.preventDefault();
				main.onConfirm();
			});
			$('section.main .content .a .issue').on('vclick', function(e){
				e.preventDefault();
				var index = $(this).attr('index');
				main.onSelectAnswer(index);
			});
			$('img.ranklist').on('vclick', function(e){
				e.preventDefault();
				main.showPage('ranklist');
			});
			$('img.share').on('vclick', function(e){
				e.preventDefault();
				$('#sharetip').show();
				setTimeout(function(){$('#sharetip').hide();}, 2000);
			});
			$('img.dnbtn.android').on('vclick', function(e){
				e.preventDefault();
				main.stats('clickDownAndroid');
				$('#downtip').show();
				setTimeout(function(){$('#downtip').hide();}, 2500);
			});
			$('img.dnbtn.ios').on('vclick', function(e){
				e.preventDefault();
				main.stats('clickDownIos');
				$('#downtip').show();
				setTimeout(function(){$('#downtip').hide();}, 2500);
			});
			$('#everdown').on('change', function(e){
				main.setEverdown($(this)[0].checked);
			});
			$('section.result .content').css('height', (scrn.size.h - 100) + 'px');
		},
		stats: function(key){
			$.ajax({
				url: '../lib/stats.php',
				data: {
					key: key,
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
		setUser: function(id, nickname){
			user.id = id;
			user.nickname = (nickname && nickname.length) ? nickname : null;
		},
		showPage: function(name){
			if (name === 'main'){
				if (!everDown){
					alert('请先下载APP哦~');
					return;
				}
			}
			$('section').hide();
			$('section.'+name).show();
			curPage = name;
			if (curPage === 'main')
				this.start();
			else if (curPage === 'result')
				this.showResult();
		},
		setEverdown: function(yes){
			everDown = yes;
		},
		start: function(){
			curQuestIndex = -1;
			totalScore = 0;
			main.stats('starts');
			this.nextQuestion();
		},
		nextQuestion: function(){
			curSelAnswer = -1;
			if (++curQuestIndex >= questions.length){
				this.onFinishPaper();
				return;
			}
			var quest = questions[curQuestIndex];
			$('section.main .content .q').html((curQuestIndex+1) + '. ' + quest.q);
			for (var i = 0; i < quest.a.length; ++i){
				$('section.main .content .a .issue:eq('+i+')')
				.html('○ ' + quest.a[i])
				.css({'font-weight': 'normal'});
			}
			lockingUI = false;
			var prog = (curQuestIndex + 1) / questions.length * 100;
			$('section.main .progress-body .progress').css({
				width: prog + '%'
			});
			var lbl = (curQuestIndex + 1) + '/' + questions.length;
			$('section.main .progress-label').html(lbl);
		},
		onFinishPaper: function(){
			while (!user.nickname || !user.nickname.length){
				var name = prompt('请输入你的昵称，它将出现在《经济学人•全球商业评论》排行榜中：');
				if (name && name.length > 0){
					user.nickname = name;
					break;
				}
			}
			$.ajax({
				url: 'access.php?act=record',
				data: {
					nickname: user.nickname,
					score: totalScore / questions.length
				},
				dataType: 'json',
				success: function(resp){
					if (resp.success){
						main.fillRankResults(resp.data);
						main.showPage('result');
					}else{
						alert('not success');
					}
				},
				error: function(e){
					alert('has error');
				}
			});
		},
		fillRankResults: function(data){
			rankList = data.list;
			user.rank = data.rank;
			user.rank06 = data.rank06;
			user.bestScore = data.bestScore;
			user.totalScore = data.totalScore;
		},
		onSelectAnswer: function(index){
			if (lockingUI)
				return;
			var quest = questions[curQuestIndex];
			for (var i = 0; i < quest.a.length; i++) {
				var prefix = i == index ? '● ' : '○ ';
				$('section.main .content .a .issue:eq('+i+')')
				.html(prefix + quest.a[i])
				.css({'font-weight': i == index ? 'bold' : 'normal'});
			};
			curSelAnswer = index;
		},
		onConfirm: function(){
			if (lockingUI)
				return;
			if (curPage === 'main'){
				if (curSelAnswer < 0){
					alert('请先选择一个答案~');
					return;
				}
				var quest = questions[curQuestIndex];
				if (curSelAnswer != quest.s)
					$('section.main .rbox.wrong').show();
				else{
					$('section.main .rbox.correct').show();
					totalScore += 1;
				}
				lockingUI = true;
				setTimeout(function(){
					$('section.main .rbox').hide();
					main.nextQuestion();
				}, 1000);
			}
		},
		showResult: function(){
			var k = 'section.result .content .detail ';
			var resultRate = totalScore / questions.length;
			for (var i = resultTexts.length - 1; i >= 0; i--) {
				var rt = resultTexts[i];
				if (resultRate >= rt.score){
					$(k + '.title').html(rt.title);
					var descs = '';
					for (var j = 0; j < rt.desc.length; j++) {
						var d = rt.desc[j].replace('{RANK}', user.rank06);
						descs += '<p>' + d + '</p>';
					};
					$(k + '.desc').html(descs);
					break;
				}
			};
			if (resultRate >= 0.6){
				$('section.result .bluebar img.download').attr('src', 'img/bn_down2.png');
				$('section.result .content .detail .title').css('font-size', '1.2em');
				$('section.result .content .detail .desc').css('line-height', '20px');
				$('section.result .content .ranktitle').show();
				$('#ranklist').show();
				this.stats('successes');
			}else{
				$('section.result .bluebar img.download').attr('src', 'img/bn_down.png');
				$('section.result .content .detail .title').css('font-size', '1.8em');
				$('section.result .content .detail .desc').css('line-height', '10px');
				$('section.result .content .ranktitle').hide();
				$('#ranklist').hide();
				this.stats('fails');
			}

			var canvas = $('#score')[0];
			var context = canvas.getContext('2d');
			context.clearRect(0, 0, canvas.width, canvas.height);
			var center = canvas.width * 0.5;
			var radiusOut = center * 0.99;
			var radiusIn = center * 0.7;
			var angFull = Math.PI * 2;
			var angBgn = -Math.PI * 0.5;
			var angEnd = angBgn + angFull;

			context.beginPath();
			context.moveTo(center, center);
			context.arc(center, center, radiusOut, angBgn, angEnd, false);
			context.closePath();
			context.fillStyle = '#ddd';
			context.fill();

			context.beginPath();
			context.moveTo(center, center);
			context.arc(center, center, radiusOut, angBgn, angEnd - angFull * (1 - resultRate), false);
			context.closePath();
			context.fillStyle = resultRate >= 0.6 ? 'rgb(70, 178, 47)' : 'rgb(231, 18, 18)';
			context.fill();

			context.beginPath();
			context.moveTo(center, center);
			context.arc(center, center, radiusIn, angBgn, angEnd, false);
			context.closePath();
			context.fillStyle = 'rgb(245, 245, 245)';
			context.fill();

			var percent = Math.floor(resultRate * 100) + '%';
			context.fillStyle = '#000';
			context.font = "30px 微软雅黑";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(percent, center, center);

			$('#ranklist li').remove();
			var foundme = false;
			for (var i = 0; i < rankList.length; ++i){
				var data = rankList[i];
				var rank = i + 1;
				var cls = '';//(rank == user.rank ? 'red' : '');
				var score = Math.floor(data.score * 100) + '%';
				var dom = '<li class="' + cls + '">'
					  + rank + '&nbsp;&nbsp;&nbsp;&nbsp;' + data.nickname
					  + '<div class="rscore">' + score + ' (累计' + data.total_score +'题)</div></li>';
			  	if (rank == user.rank)
			  		foundme = true;
				$('#ranklist').append(dom);
			}
			if (!foundme){
				var score = Math.floor(user.bestScore * 100) + '%';
				var dom = '<li class="red">'
					  + user.rank + '. ' + user.nickname
					  + '<div class="rscore">' + score + ' (累计' + user.totalScore +'题)</div></li>';
				$('#ranklist').append(dom);
			}
		}
	}
})();

$(function(){
	if (!/Windows\s+Phone/.test(navigator.userAgent) && !/MicroMessenger/.test(navigator.userAgent)){
		$('section.browser').show();
		if (/iPhone/.test(navigator.userAgent) && !/XiaoMi/.test(navigator.userAgent) ){
			window.location.href = 'https://itunes.apple.com/cn/app/economist-global-business/id951457811?mt=8';
		}else{
			window.location.href = android_apk_url;
		}
	}else{
		weixin.init(function(){
            weixin.fillShare($.extend({}, weixin.info, {
	            type: 'link',
	            link: window.location.href,
	            success: function(){
	            	// alert('shares');
	            	main.stats('shares');
	            }
	        }));
		});
		$.ajax({
			url: 'access.php?act=login',
			dataType: 'json',
			success: function(resp){
				if (resp.success){
					// alert('id='+resp.data.id+',name='+resp.data.nickname);
					main.setUser(resp.data.id, resp.data.nickname);
				}
			}
		});
		main.init();
		
	  	if (/iPhone/.test(navigator.userAgent))
			$('body').css('font-family', 'Heiti SC');
	}
});