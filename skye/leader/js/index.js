var configs = {
	appid: 'wx706693a3b8c06727',
	user_id: -1,
	registered: false,
	scrn: {w: 0, h: 0, scale: 1},
	downUrl: {
		ios: 'https://itunes.apple.com/cn/app/economist-global-business/id951457811?mt=8',
		android: 'http://dd.myapp.com/16891/5E0FB4F247EE6572F73CB7D9EBD831CE.apk?fsname=com.economist.hummingbird_1.0.2_102.apk',
		// android: 'http://www.tegbr.com/cn/index.html?utm_source=weibo&utm_medium=cpe&utm_campaign=weibo-fst#home/1',
		logo: 'http://www.tegbr.com/cn/index.html',
	},
};
var main = (function(){
	var pageIndex = -1;
	var clickTicker = 0;
	// var cover_logo_index =0;
	var cover_reg_index =0;
	return {
		authorize: function(){
			var url = "https://open.weixin.qq.com/connect/oauth2/authorize";
			url += "?appid=" + configs.appid;
			url += "&redirect_uri=";
			var cburl = getLocalUrl() + "signup.php?act=reg";
			cburl += "&fromurl=" + getRelativeUrl('leader', true, false, true, true);
			url += encodeURIComponent(cburl);
			url += "&response_type=code&scope=snsapi_userinfo";
			url += "&state=" + configs.appid;
			url += "#wechat_redirect";
			window.location.href = url;
		},
		init: function(){
			configs.scrn.w = $(window).width();
			configs.scrn.h = $(window).height();
			configs.scrn.scale = configs.scrn.w / 640;
			
			/*
			$('.cover_logo').css({top:(configs.scrn.w * 1.415)+'px', }).on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('logo');
				window.location.href = configs.downUrl.logo;
			});
			setInterval(function(){
				if(1==cover_logo_index){
					cover_logo_index = 0 ;
				}else{
					cover_logo_index = 1;
				}
				$('.cover_logo').hide();
				$('.cover_logo_'+cover_logo_index).show();
			},500);
			*/
			$('#cover_logo_btn').css({top:(configs.scrn.w * 1.415)+'px', }).on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('logo');
				window.location.href = configs.downUrl.logo;
			});


			if (/iPhone/.test(navigator.userAgent)){
				$('body').css('font-family', 'Heiti SC');
				$('.row').css('font-family', 'Heiti SC');
			}

	        $('#ruleTip').css({
				'background-image': 'url(images/rule.png?_dc=20150630-1)',
				width: $(window).width(),
				height: $(window).height(),
	        }).on('vclick', function(){
				$(this).hide();
	        }).hide();
			
			$('#btn_rule').css({top:(configs.scrn.w * 0.1)+'px',height:(configs.scrn.w * 0.1)+'px',  }).on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('rule');
				// main.switchPage(1);
				$('#ruleTip').show();
			});
			
			/*
			$('#btn_reg').css({top:(configs.scrn.w * 1.2)+'px',height:(configs.scrn.w * 0.2)+'px', }).on('vclick', function(e){
				e.preventDefault();
				//ajax switch 2 or 3
				main.logOnServer('join');
				// main.switchPage(1);
				location.href = location.href.left(location.href.lastIndexOf('/')+1)+'signup.html' ;
			});
			*/
			$('.cover_reg').css({top:(configs.scrn.w * 1.225)+'px'}).on('vclick', function(e){
				e.preventDefault();
				//ajax switch 2 or 3
				main.logOnServer('join');
				// main.switchPage(1);
				location.href = location.href.left(location.href.lastIndexOf('/')+1)+'signup.html?_acc='+Math.random()*100000 ;
			});
			setInterval(function(){
				if(1==cover_reg_index){
					cover_reg_index = 0 ;
				}else{
					cover_reg_index = 1;
				}
				$('.cover_reg').hide();
				$('.cover_reg_'+cover_reg_index).show();
			},500);
			
			
			$('#btn_submit').css({top:(configs.scrn.w * 1.45)+'px'}).on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('signup');
				main.onCommitInfo();
			});
			
	        $('#downTip').css({
				'background-image': 'url(images/tipDown.png?_dc=20150630-1)',
				width: $(window).width(),
				height: $(window).height(),
	        }).on('vclick', function(){
				$(this).hide();
	        }).hide();
			
			$('#img_down_android').on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('down_android');

				// main.switchPage(5);
				// $('#downTip').show();
				location.href = configs.downUrl.android;
			});
			$('#img_down_iphone').on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('down_iphone');

				// main.switchPage(5);
				$('#downTip').show();
				setTimeout(function(){
					$('#downTip').hide();
				},2000);
			});

	        $('#shareTip').css({
				'background-image': 'url(images/tipShare.png?_dc=20150630-1)',
				width: $(window).width(),
				height: $(window).height(),
	        }).on('vclick', function(){
				$(this).hide();
	        }).hide();
			
			$('#btn_share').css({top:(configs.scrn.w * 1.3)+'px',height:(configs.scrn.w * 0.2)+'px', }).on('vclick', function(e){
				e.preventDefault();
				main.logOnServer('share_click');
				// (new shareTipBox()).show('点击右上角菜单分享↑');
				//main.switchPage(4);
				$('#shareTip').show();
			});
			
			// if( localStorage.getItem('_leader_section_num')){
			// 	this.switchPage(parseInt( localStorage.getItem('_leader_section_num')));
			// }else{
				this.switchPage( 0 );
			// }
		},
		switchPage: function(index){
			if (index == pageIndex || index < 0)
				return;
			if (index == 4){
				if (configs.registered){
					alert('感谢您，您已经注册过啦～');
					setTimeout(function(){
						main.switchPage(2);
					}, 500);
					return;
				}
			}else if (index == 5){
				configs.registered = true;
			}
			$('section:eq('+pageIndex+')').hide();
			pageIndex = index;
			$('section:eq('+pageIndex+')').show();
			localStorage.setItem('_leader_section_num',pageIndex);
		},
		logOnServer: function(src){
			//signup.php?act=log&type=test&uid=-1
			$.ajax({
				url: getLocalUrl() + 'signup.php?act=log',
				type: 'post',
				data: {
					type: src,
					uid : configs.user_id ,
				},
				dataType: 'json',
				error: function(e,e1,e2){
					// alert('提交失败！');
					console.debug(e);
					console.debug(e.responseText?e.responseText:e);
				},
				success: function(resp){
					console.debug(resp);
					/*
					if (resp.success){
						alert('提交成功！');
					}else{
						alert(resp.message);
					}
					*/
				}
			});
		},
		//http://skyemedia.sinaapp.com/leader/signup.php?act=getUid
		getUserId: function(_callback){
			$.ajax({
				url: getLocalUrl() + 'signup.php?act=getUid',
				type: 'post',
				data: {	},
				dataType: 'json',
				error: function(e){
					console.debug(e);
				},
				success: function(resp){
					_callback && _callback(resp);
					if (resp.success){
						configs.user_id = resp.data ;
					}else{
						console.debug(resp);
					}
				}
			});
		},
		onCommitInfo: function(){
			var nickname = $('#nickname').val();
			var email = $('#email').val();
			var province = Number($('#province').val());
			var Industry = Number($('#Industry').val());

			if (!nickname || !nickname.length){
				alert('请输入您的微信昵称。');
				return;
			}
			if (!email || !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)) {
				alert('请输入有效的电子邮箱。');
				return;
			}
			if (province < 0){
				alert('请选择您所在的城市。');
				return;
			}
			if (Industry < 0){
				alert('请选择您所属行业。');
				return;
			}
			$.ajax({
				url: getLocalUrl() + 'signup.php?act=setUserInfo',
				type: 'post',
				data: {
					uid : configs.user_id ,
					nickname: nickname,
					email: email,
					province: configs.provinces[province],
					Industry: configs.Industry[Industry],
				},
				dataType: 'json',
				error: function(){
					alert('提交失败！');
				},
				success: function(resp){
					if (resp.success){
						alert('提交成功！');
						configs.user_id = resp.data ;
						main.switchPage(2);
					}else{
						if (resp.message == 'ever-signup')
							main.switchPage(2);
						else
							alert(resp.message);
					}
				}
			});
		},
	}
})();

$(function(){
	// main.init();
	// return;
	
	// if (!/Windows\s+Phone/.test(navigator.userAgent) && !/MicroMessenger/.test(navigator.userAgent)){
	// 	if (/iPhone/.test(navigator.userAgent) && !/XiaoMi/.test(navigator.userAgent) ){
	// 		location.href = configs.downUrl.ios;
	// 	}else{
	// 		location.href = configs.downUrl.android;
	// 	}
	// }else{
		weixin.init();
		main.getUserId();
		main.init();
	// }
});