var configs = {
	appid: 'wx706693a3b8c06727',
	user: null,
	registered: false,
	scrn: {w: 0, h: 0, scale: 1},
	pages: [
		{//0
			reg: [169,672,304,82],
			act1: [169,772,304,82],
			about: [169,872,304,82]
		},{//1
			vip1: [142,544,152,196],
			vip2: [347,543,152,196],
			reg: [167,949,305,86]
		},{//2
			reg: [169,944,305,86],
			back: [530,980,{to:1}]
		},{//3
			reg: [169,944,305,86],
			back: [530,980,{to:1}]
		},{//4
			commit: [163,882,314,64]
		},{//5
			about: [62,391,513,86],
			down: [62,518,513,130],
			share: [139,693,361,91],
			focus: [139,818,361,91],
			info: [139,944,361,91]
		},{//6
			shops: [64,894,513,86],
			back: [530,1005,{to:5}]
		},{//7
		},{//8
		}
	],
	focusUrl: 'http://mp.weixin.qq.com/s?__biz=MzA5MTY2NTMxMg==&mid=205540727&idx=1&sn=df5707a0233b7e14fa054df5ec06bb39#rd',
	shopsUrl: 'http://behr.sinaapp.com/map/',
	downUrl: {
		ios: 'https://itunes.apple.com/cn/app/colorsmart-by-behr-app-bai/id637824495?mt=8',
		android: 'http://mobile.baidu.com/#/item?docid=6836274&from=0',
	},
	provinces: [
		'北京',
		'上海',
		'天津',
		'重庆',
		'河北',
		'山西',
		'内蒙古',
		'辽宁',
		'吉林',
		'黑龙江',
		'江苏',
		'浙江',
		'安徽',
		'福建',
		'江西',
		'山东',
		'河南',
		'湖北',
		'湖南',
		'广东',
		'广西',
		'海南',
		'四川',
		'贵州',
		'云南',
		'西藏',
		'陕西',
		'甘肃',
		'宁夏',
		'青海',
		'新疆',
		'香港',
		'澳门',
		'台湾'
	],
	cities: [
　　　　　"北京,东城,西城,崇文,宣武,朝阳,丰台,石景山,海淀,门头沟,房山,通州,顺义,昌平,大兴,平谷,怀柔,密云,延庆",
　　　　　"上海,黄浦,卢湾,徐汇,长宁,静安,普陀,闸北,虹口,杨浦,闵行,宝山,嘉定,浦东,金山,松江,青浦,南汇,奉贤,崇明",
　　　　　"天津,和平,东丽,河东,西青,河西,津南,南开,北辰,河北,武清,红挢,塘沽,汉沽,大港,宁河,静海,宝坻,蓟县,大邱庄",
　　　　　"重庆,万州,涪陵,渝中,大渡口,江北,沙坪坝,九龙坡,南岸,北碚,万盛,双挢,渝北,巴南,黔江,长寿,綦江,潼南,铜梁,大足,荣昌,壁山,梁平,城口,丰都,垫江,武隆,忠县,开县,云阳,奉节,巫山,巫溪,石柱,秀山,酉阳,彭水,江津,合川,永川,南川",
　　　　　"石家庄,邯郸,邢台,保定,张家口,承德,廊坊,唐山,秦皇岛,沧州,衡水",
　　　　　"太原,大同,阳泉,长治,晋城,朔州,吕梁,忻州,晋中,临汾,运城",
　　　　　"呼和浩特,包头,乌海,赤峰,呼伦贝尔盟,阿拉善盟,哲里木盟,兴安盟,乌兰察布盟,锡林郭勒盟,巴彦淖尔盟,伊克昭盟",
　　　　　"沈阳,大连,鞍山,抚顺,本溪,丹东,锦州,营口,阜新,辽阳,盘锦,铁岭,朝阳,葫芦岛",
　　　　　"长春,吉林,四平,辽源,通化,白山,松原,白城,延边",
　　　　　"哈尔滨,齐齐哈尔,牡丹江,佳木斯,大庆,绥化,鹤岗,鸡西,黑河,双鸭山,伊春,七台河,大兴安岭",
　　　　　"南京,镇江,苏州,南通,扬州,盐城,徐州,连云港,常州,无锡,宿迁,泰州,淮安",
　　　　　"杭州,宁波,温州,嘉兴,湖州,绍兴,金华,衢州,舟山,台州,丽水",
　　　　　"合肥,芜湖,蚌埠,马鞍山,淮北,铜陵,安庆,黄山,滁州,宿州,池州,淮南,巢湖,阜阳,六安,宣城,亳州",
　　　　　"福州,厦门,莆田,三明,泉州,漳州,南平,龙岩,宁德",
　　　　　"南昌市,景德镇,九江,鹰潭,萍乡,新馀,赣州,吉安,宜春,抚州,上饶",
　　　　　"济南,青岛,淄博,枣庄,东营,烟台,潍坊,济宁,泰安,威海,日照,莱芜,临沂,德州,聊城,滨州,菏泽,博兴",
　　　　　"郑州,开封,洛阳,平顶山,安阳,鹤壁,新乡,焦作,濮阳,许昌,漯河,三门峡,南阳,商丘,信阳,周口,驻马店,济源",
　　　　　"武汉,宜昌,荆州,襄樊,黄石,荆门,黄冈,十堰,恩施,潜江,天门,仙桃,随州,咸宁,孝感,鄂州",
　　　　　"长沙,常德,株洲,湘潭,衡阳,岳阳,邵阳,益阳,娄底,怀化,郴州,永州,湘西,张家界",
　　　　　"广州,深圳,珠海,汕头,东莞,中山,佛山,韶关,江门,湛江,茂名,肇庆,惠州,梅州,汕尾,河源,阳江,清远,潮州,揭阳,云浮",
　　　　　"南宁,柳州,桂林,梧州,北海,防城港,钦州,贵港,玉林,南宁地区,柳州地区,贺州,百色,河池",
　　　　　"海口,三亚",
　　　　　"成都,绵阳,德阳,自贡,攀枝花,广元,内江,乐山,南充,宜宾,广安,达川,雅安,眉山,甘孜,凉山,泸州",
　　　　　"贵阳,六盘水,遵义,安顺,铜仁,黔西南,毕节,黔东南,黔南",
　　　　　"昆明,大理,曲靖,玉溪,昭通,楚雄,红河,文山,思茅,西双版纳,保山,德宏,丽江,怒江,迪庆,临沧",
　　　　　"拉萨,日喀则,山南,林芝,昌都,阿里,那曲",
　　　　　"西安,宝鸡,咸阳,铜川,渭南,延安,榆林,汉中,安康,商洛",
　　　　　"兰州,嘉峪关,金昌,白银,天水,酒泉,张掖,武威,定西,陇南,平凉,庆阳,临夏,甘南",
　　　　　"银川,石嘴山,吴忠,固原",
　　　　　"西宁,海东,海南,海北,黄南,玉树,果洛,海西",
　　　　　"乌鲁木齐,石河子,克拉玛依,伊犁,巴音郭勒,昌吉,克孜勒苏柯尔克孜,博 尔塔拉,吐鲁番,哈密,喀什,和田,阿克苏",
　　　　　"香港",
　　　　　"澳门",
　　　　　"台北,高雄,台中,台南,屏东,南投,云林,新竹,彰化,苗栗,嘉义,花莲,桃园,宜兰,基隆,台东,金门,马祖,澎湖",
	]
};

var main = (function(){
	var pageIndex = -1;
	var clickTicker = 0;
	return {
		authorize: function(){
			var url = "https://open.weixin.qq.com/connect/oauth2/authorize";
			url += "?appid=" + configs.appid;
			url += "&redirect_uri=";
			var cburl = getLocalUrl() + "signup.php?act=reg";
			cburl += "&fromurl=" + getRelativeUrl('vip', true, false, true, true);
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

			weixin.init(function(){});

			this.recordCount('browse_count');

			if (/iPhone/.test(navigator.userAgent))
				$('body').css('font-family', 'Heiti SC');
			this.switchPage(0);
			$('section').on('vclick', function(e){
				// e.preventDefault();
				main.onClick(e.pageX, e.pageY);
			});
			for (var i = 0; i < configs.provinces.length; i++) {
				$('#province').append('<option value="'+i+'">'+configs.provinces[i]+'</option>');
			};
			$('#province').on('change', function(e){
				var prov = Number($(this).val());
				if (prov < 0){
					$('#city').attr('disabled', 'disabled');
				}else{
					$('#city').removeAttr('disabled');
					$('#city .c').remove();
					var cs = configs.cities[prov].split(',');
					for (var i = 0; i < cs.length; i++) {
						$('#city').append('<option class="c" value="' + i + '">' + cs[i] + '</option>');
					};
				}
			});
			for (var i = 0; i < configs.pages.length; i++) {
				if (configs.pages[i].back){
					$('section:eq('+i+')').append('<img class="back" index="'+i+'" src="images/back.png" width="15%">');
					$('section:eq('+i+') .back').css({
						left: configs.pages[i].back[0] * configs.scrn.scale + 'px',
						top: configs.pages[i].back[1] * configs.scrn.scale + 'px'
					}).on('vclick', function(e){
						var index = $(this).attr('index');
						var to = configs.pages[index].back[2].to;
						main.switchPage(to);
					});
				}
			};

			$('section.act1').css({height: configs.scrn.scale * 1080 + 'px'});
			$('#act1').css({
				top: configs.scrn.scale * 1080 * 0.88 + 'px'
			});
			$('section.act1.page1 img.bn.register').css({
				top: configs.scrn.scale * 1080 * 0.80 + 'px'
			});
			$('section.act1.page1 img.bn.rule').css({
				top: configs.scrn.scale * 1080 * 0.89 + 'px'
			});
			$('section.act1.page2 img.bn.register').css({
				top: configs.scrn.scale * 1080 * 0.83 + 'px'
			});
			$('section.act1.page2 img.bn.back').css({
				top: configs.scrn.scale * 1080 * 0.92 + 'px'
			});
			$('section.act1.page1 img.bn.rule').on('vclick', function(e){
				e.preventDefault();
				main.switchPage(8);
			});
			$('section.act1.page2 img.bn.back').on('vclick', function(e){
				e.preventDefault();
				main.switchPage(7);
			});
			$('section.act1 img.register').on('vclick', function(e){
				e.preventDefault();
				main.recordCount('registering_count');
				main.switchPage(4);
			});
			$('#act1').on('vclick', function(e){
				e.preventDefault();
				main.switchPage(7);
			});
			var ss = window.location.href.split('#');
			if (ss.length > 1 && !isNaN(ss[1])){
				main.switchPage(Number(ss[1]));
			}
		},
		switchPage: function(index){
			if (index == pageIndex || index < 0)
				return;
			if (index == 4){
				if (configs.registered){
					alert('感谢您，您已经注册过啦～');
					setTimeout(function(){
						main.switchPage(5);
					}, 500);
					return;
				}
			}else if (index == 5){
				configs.registered = true;
			}
			$('section:eq('+pageIndex+')').hide();
			pageIndex = index;
			$('section:eq('+pageIndex+')').show();
		},
		isInRegion: function(rgn, x, y){
			var rx = rgn[0] * configs.scrn.scale;
			var ry = rgn[1] * configs.scrn.scale;
			var rw = rgn[2] * configs.scrn.scale;
			var rh = rgn[3] * configs.scrn.scale;
			if (rx <= x && x <= rx + rw &&
				ry <= y && y <= ry + rh){
				return true;
			}
			return false;
		},
		recordCount: function(field){
			$.ajax({
				url: getLocalUrl() + 'signup.php?act=record&field='+field
			});
		},
		onClick: function(x, y){
			var t = new Date().getTime();
			// alert(t - clickTicker);
			if (t - clickTicker < 500)
				return;
			clickTicker = t;
			var p = configs.pages[pageIndex];
			switch(pageIndex){
				case 0: {
					if (this.isInRegion(p.act1, x, y))
						this.switchPage(7);
					else if (this.isInRegion(p.about, x, y))
						this.switchPage(1);
					else if (this.isInRegion(p.reg, x, y)){
						this.recordCount('registering_count');
						this.switchPage(4);
					}
				} break;
				case 1: {
					if (this.isInRegion(p.vip1, x, y))
						this.switchPage(2);
					else if (this.isInRegion(p.vip2, x, y))
						this.switchPage(3);
					else if (this.isInRegion(p.reg, x, y)){
						this.recordCount('registering_count');
						this.switchPage(4);
					}
				} break;
				case 2:
				case 3: {
					if (this.isInRegion(p.reg, x, y)){
						this.recordCount('registering_count');
						this.switchPage(4);
					}
				} break;
				case 4: {
					if (this.isInRegion(p.commit, x, y)){
						this.onCommitInfo();
					}
				} break;
				case 5: {
					if (this.isInRegion(p.about, x, y))
						this.switchPage(2);
					else if (this.isInRegion(p.down, x, y)){
						this.recordCount('download_count');
						$('.downtip').show();
						setTimeout(function(){
							$('.downtip').hide();
						}, 1500);
					}
					else if (this.isInRegion(p.share, x, y)){
						this.recordCount('sharing_count');
						$('.sharetip').show();
						setTimeout(function(){
							$('.sharetip').hide();
						}, 1500);
					}
					else if (this.isInRegion(p.focus, x, y)){
						this.recordCount('focus_count');
						setTimeout(function(){
							window.location.href = configs.focusUrl;
						}, 500);
					}
					else if (this.isInRegion(p.info, x, y)){
						this.recordCount('buylook_count');
						this.switchPage(6);
					}
				} break;
				case 6: {
					if (this.isInRegion(p.shops, x, y))
						window.location.href = configs.shopsUrl;
				} break;
			}
		},
		onCommitInfo: function(){
			var name = $('#fullname').val();
			var phone = $('#cellphone').val();
			var email = $('#email').val();
			var prov = Number($('#province').val());
			var city = Number($('#city').val());
			var bought = $('input:radio[name=bought]:checked').val();
			var decorateDate = $('#decorateDate').val();
			var code = $('#code').val();

			if (!name || !name.length){
				alert('请输入您的姓名。');
				return;
			}
			if (!phone || !/^1[3|4|5|8][0-9]\d{4,8}$/.test(phone)){
				alert('请输入您有效的手机号码。');
				return;
			}
			if (!email || !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(email)) {
				alert('请输入有效的电子邮箱。');
				return;
			}
			if (prov < 0){
				alert('请选择您所在的城市。');
				return;
			}
			$.ajax({
				url: getLocalUrl() + 'signup.php?act=signup',
				type: 'post',
				data: {
					realname: name,
					cellphone: phone,
					email: email,
					province: configs.provinces[prov],
					city: configs.cities[prov].split(',')[city],
					ever_bought: (bought === undefined ? -1 : (bought > 0 ? 1 : 0)),
					decorate_date: decorateDate,
					favor_code: code
				},
				dataType: 'json',
				error: function(){
					alert('提交失败！');
				},
				success: function(resp){
					if (resp.success){
						alert('提交成功！');
						main.recordCount('registered_count');
						main.switchPage(5);
					}else{
						if (resp.message == 'ever-signup')
							main.switchPage(5);
						else
							alert('error:' + resp.message);
					}
				}
			})
		}
	}
})();

$(function(){
	// main.init();
	// return;
	if (!/MicroMessenger/.test(navigator.userAgent)){
		if (/iPhone/.test(navigator.userAgent))
			window.location.href = configs.downUrl.ios;
		else
			window.location.href = configs.downUrl.android;
		return;
	}
	$.ajax({
		url: getLocalUrl() + 'signup.php',
		type: 'get',
		dataType: 'json',
		error: function(r, s, e){
			alert(errorstr('auth-require', r, s, e));
            main.authorize();
		},
		success: function(resp){
			if (!resp.success)
            	main.authorize();
            else{
				// alert(JSON.stringify(resp.data));
				configs.user = resp.data.user;
				configs.registered = resp.data.registered == '1' ? true : false;
				// alert(resp.data.registered);
				main.init();
            }
        }
	});
  	if (/iPhone/.test(navigator.userAgent))
    	$('body').css('font-family', 'Heiti SC');
});