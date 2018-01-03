var debug = false;
var swiper = new Swiper('.swiper-container', {
	direction: 'vertical',
	onInit: function(swiper){
		swiperAnimateCache(swiper);
		swiperAnimate(swiper);
	},
	onSlideChangeEnd: function(swiper){
		swiperAnimate(swiper);
	}
});
var stats = function(key){
	$.ajax({
		url: '/lib/stats.php',
		data: {key: 'newsfall1-' + key, addval: 1},
		dataType: 'json'
	});
};
var clickShare = function(){
	$('#sharetip').show();
	setTimeout(function(){
		$('#sharetip').hide();
	}, 2500);
	stats('clickShare');
};
var isIOS = function(){
	return /iPhone/.test(navigator.userAgent) && !/XiaoMi/.test(navigator.userAgent);
};
var turnToAppUrl = function(){
	if (isIOS())
		window.location.href = 'https://itunes.apple.com/cn/app/economist-global-business/id951457811?ls=1&mt=8';
	else
		window.location.href = 'http://dd.myapp.com/16891/6EFFC792BF1E157353DB4359B53793E0.apk?fsname=com.economist.hummingbird_1.0.10_110.apk&asr=02f1';
};
var clickDownload = function(t){
	if (t == 0){
		stats('clickLinkIOS');
		// if (isIOS()){
		// 	window.location.href = 'http://mp.weixin.qq.com/mp/redirect?url=https%3A%2F%2Fitunes.apple.com%2Fcn%2Fapp%2Feconomist-global-business%2Fid951457811%3Fls%3D1%26mt%3D8';
		// 	return;
		// }
	}
	else
		stats('clickLinkAndroid');
	$('#downtip').show();
	setTimeout(function(){
		$('#downtip').hide();
	}, 2500);
};
$(function(){
	if (!debug && !/MicroMessenger/.test(navigator.userAgent)){
		stats('openInBrowser');
		setTimeout(function(){
			turnToAppUrl();
		}, 200);
		return;
	}
	$('#blank').hide();

	weixin.init({
		title: '【互动读文】2分钟看人工智能对职业的颠覆',
		desc: '《经济学人》十一月刊关注议题朋友圈推荐阅读',
		imgUrl: 'http://tegbr.sinaapp.com/newsfall/img/logo.jpg?v=1',
		success: function() {
			stats('sharePage');
		}
	});
	stats('visits');
});