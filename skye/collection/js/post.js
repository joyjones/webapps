
var app = {
	data: {
		post : null,
		shareVisible: false,
		previewMode: false,
		praised: false
	},
	init: function(data, praised){
		this.data.post = data;
		this.data.praised = praised;
		this.data.previewMode = app.getParameterValue('preview') != null;
		if (this.data.previewMode){
			$('.bar .share').show();
			$('.bar .tmall').hide();
			$('.bar .praise').hide();
			$('img.switch').hide();
		}else{
			$('.bar .share').hide();
			$('.bar .tmall').show();
			$('.bar .praise').show();
			$('img.switch').show();
			this.adjustPraise();
			this.updatePraise();
		}

		this.adjust();

		$('.bar .share').on('vclick', function(e){
			e.preventDefault();
			app.showShare(true);
		 	setTimeout(function(){
				app.showShare(false);
		 	}, 1800);
		});
		$('.bar .gallery').on('vclick', function(e){
			e.preventDefault();
			window.location.href = 'gallery.html';
		});
		$('.bar .tmall').on('vclick', function(e){
			e.preventDefault();
			window.location.href = 'http://shop.sennheiser.com.cn/';
		});
		$('.sharedlg .close').on('vclick', function(e){
			e.preventDefault();
			app.showShare(false);
		});
		$('.bar .praise').on('vclick', function(e){
			e.preventDefault();
			app.clickPraise();
		});
		$('img.switch.prev').on('vclick', function(e){
			e.preventDefault();
			app.clickPrevPost();
		});
		$('img.switch.next').on('vclick', function(e){
			e.preventDefault();
			app.clickNextPost();
		});
	},
	adjust: function(){
    	var w = this.data.post.width, h = this.data.post.height;
    	var sw = $(window).width();
    	var scrH = $(window).height();
    	var barH = $('.bar').height();
    	var sh = scrH - barH;
        if (w < sw || h < sh){
            var scale = 1;
            if ((sw / sh) < (w / h))
                scale = h / sh;
            else
                scale = w / sw;
            sw = Math.floor(sw * scale);
            sh = Math.floor(sh * scale);
        }
		var url = "http://7xj4xe.com1.z0.glb.clouddn.com/";
		url += this.data.post.imgurl;
		url += '?imageMogr2/auto-orient';
        url += '&imageView2/1/w/' + sw + '/h/' + sh + '/interlace/1';
        $('#photo').attr('src', url);
	},
	onPhotoLoaded: function(){
        tpls.apply(app.data.post.template);
	},
	showShare: function(show){
		if (this.data.shareVisible == show)
			return;
		this.data.shareVisible = show;
		var from = show ? '100%' : '18%';
		var to = show ? '18%' : '-64%';
		var ease = show ? 'easeInOutCubic' : 'easeInOutBack';
		$('.sharedlg')
		.css({left: from, display: 'block'})
		.animate({left: to}, {
         	easing: ease,
         	duration: 400,
	 	});
	},
	getParameterValue: function(key){
	    var url = window.location.href.split('#')[0];
	    var i = url.indexOf('?');
	    if (i >= 0){
	        var args = url.substr(i + 1);
	        var reg1 = new RegExp('\\W?'+key+'=(.+?)&', 'i');
	        var reg2 = new RegExp('\\W?'+key+'=(.+)', 'i');
	        var r = reg1.exec(args);
	        if (!r)
	            r = reg2.exec(args);
	        if (r) {
	            return decodeURIComponent(r[1]);
	        }
	    }
	    return null;
	},
	adjustPraise: function(){
		var size = $('.gallery').height();
		if (size > 0)
			$('.praise').css({width: size * 1.4, height: size * 1.4, 'line-height': (size * 1.2) + 'px'});
		else
			setTimeout(function(){app.adjustPraise();}, 200);
	},
	updatePraise: function(add){
		!add && (add = 0);
		var num = Number(this.data.post.praised_count) + Number(add);
		if (num == 0)
			num = '';
		$('.bar .praise span').html(num);
		var bk = app.data.praised ? 'praised' : 'praise';
		$('.bar .praise').css('background-image', 'url(img/8-'+bk+'.png)');
	},
	updateShareInfo: function(){
		if (this.data.post == null){
			setTimeout(function(){
				app.updateShareInfo();
			}, 200);
		}else{
	        weixin.fillShare($.extend({}, weixin.info, {
	            type: 'link',
	            title: '我的Sennheiser型格，顶起来！',
	            link: window.location.href.split('#')[0].split('?')[0] + '?id=' + this.data.post.id
	        }));
		}
	},
	clickPraise: function(){
		$.ajax({
			url: 'access.php?act=praise&id=' + this.data.post.id,
			dataType: 'json',
			success: function(resp){
				if (resp.success){
					app.data.praised = true;
					app.updatePraise(1);
				}
			}
		});
	},
	clickPrevPost: function(){
		$.ajax({
			url: 'access.php?act=prev&id=' + this.data.post.id,
			dataType: 'json',
			success: function(resp){
				if (resp.success)
					window.location.href = 'post.html?id=' + resp.data;
				else
					alert(resp.message);
			}
		});
	},
	clickNextPost: function(){
		$.ajax({
			url: 'access.php?act=next&id=' + this.data.post.id,
			dataType: 'json',
			success: function(resp){
				if (resp.success)
					window.location.href = 'post.html?id=' + resp.data;
				else
					alert(resp.message);
			}
		});
	}
};

$(function(){
	weixin.init(function(){
		app.updateShareInfo();
	});

	var id = app.getParameterValue('id');
	$.ajax({
		url: 'access.php?act=login&section=2',
		type: 'post',
		data: {post_id: id},
		dataType: 'json',
		success: function(resp){
			if (resp.success)
				app.init(resp.data.post, resp.data.praised);
			else
				alert(resp.message);
		}
	});
});