var scr = {size:{w:0,h:0},aspect:1,scale:1};
var dooroverH = 160;
var dlgInfoVisible = false;
var animateDoor = function(){
	var midy = scr.size.h * 0.5;
	var upbtm = scr.size.h - (midy + dooroverH * 0.5 * scr.scale);
	var dntop = midy - dooroverH * 0.5 * scr.scale;
	
	$('.door-up')
	.css({bottom: scr.size.h})
	.show()
	.animate({bottom: upbtm, opacity: 1}, 500);

	$('.door-dn')
	.css({top: scr.size.h})
	.show()
	.animate({top: dntop, opacity: 1}, 500);
};
var swiper = new Swiper('.swiper-container', {
	direction: 'vertical',
	onInit: function(swiper){
		swiperAnimateCache(swiper);
		swiperAnimate(swiper);
		setTimeout(function(){
			swiper.slideTo(1, 800);
		}, 1500);
	},
	onSlideChangeStart: function(swiper){
		console.log(swiper);
		if (swiper.snapIndex == 4){
			setTimeout(function(){
				animateDoor();
			}, 500);
		}else{
			$('.door').hide();
		}
	},
	onSlideChangeEnd: function(swiper){
		swiperAnimate(swiper);
	}
});
var stats = function(key){
	$.ajax({
		url: '/lib/stats.php',
		data: {key: 'burtonkids-' + key, addval: 1},
		dataType: 'json'
	});
};
var clickInfo = function(show){
	if (dlgInfoVisible == show)
		return;
	if (show)
		stats('index-clickInfo');
	dlgInfoVisible = show;
	var from = show ? '100%' : '10%';
	var to = show ? '10%' : '-80%';
	$('.info .dlg')
	.css({left: from, display: 'block'})
	.animate({left: to}, 400);
};
var clickUpload = function(){
	stats('index-clickUpload');
	setTimeout(function(){
		window.location.href = 'upload.html';
	}, 500);
};
var clickVote = function(){
	stats('index-clickVote');
	setTimeout(function(){
		window.location.href = 'gallery.html';
	}, 500);
};
$(function(){
	scr.size.w = $(window).width();
	scr.size.h = $(window).height();
	scr.aspect = scr.size.w / scr.size.h;
	scr.scale = scr.size.w / 640;
	weixin.init({
		title: 'BURTON雪季小模特招募',
		desc: '上传宝贝冬季照片，参与雪季小模特评选！',
		imgUrl: 'http://skyemedia.sinaapp.com/burton-kids/img/logo.jpg',
		success: function() {
			stats('index-sharePage');
		}
	});
	stats('index-visits');
});