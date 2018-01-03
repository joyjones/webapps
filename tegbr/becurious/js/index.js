var android_apk_url = 'http://www.tegbr.com/apk/gbr-socialmedia-release-1.0.10-110.apk';
var main = (function(){
	var scrn = {size: {w:0, h:0}, aspect: 0, scale: 1};
	return {
		init: function(){
			scrn.size.w = $(window).width();
			scrn.size.h = $(window).height();
			scrn.aspect = scrn.size.w / scrn.size.h;
			scrn.scale = scrn.size.w / 640;

			$('.floater').css({
				top: (scrn.size.w / 474 * 660) + 'px'
			});
			$('img.start').on('vclick', function(e){
				e.preventDefault();
				window.location.href = 'index_v2.html';
			});
			$('section.finishv1').show();
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
		weixin.init();
		main.init();
	  	if (/iPhone/.test(navigator.userAgent)){
			$('body').css('font-family', 'Heiti SC');
	  	}
	}
});