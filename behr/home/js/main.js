
var env = {
	vars: {
		scrsize: ko.observable({w: 0, h: 0}),
		scrscale: ko.observable(1),
		step: ko.observable(0),
		step1: {
			srcid: ko.observable(1)
		},
		setStep: function(v){
			var p = env.vars.step();
			if (p >= 0)
				$('section:eq('+p+')').hide();
			env.vars.step(v);
			$('section:eq('+v+')').show();
		},
		room: ko.observable(0),
		counts: [8, 8, 8, 8],
		loading: {
			index: ko.observable(0),
			list: []
		},
		vs: {
			collects: [],
			id1: ko.observable(1),
			id2: ko.observable(2),
			aspect: 640 / 412,
			size_vs: 242,
			margin: 0.05,
			padding: 0.02,
			rc1: null,
			rc2: null,
			tmfunc: null,
			selectedId: ko.observable(0),
			sectionMarginTop: null,
			title: ko.observable('Round 1')
		},
		result: {
			title: ko.observable(''),
			desc: ko.observable(''),
			image: ko.observable('images/logo.jpg'),
			adv1: ko.observable('images/1/result/1a.png'),
			adv2: ko.observable('images/1/result/1b.png'),
		}
	},
	evts: {
		bkcolor: function(){
			if (env.vars.step() < 3)
				return '#2f292b';
			return '#dadada';
		},
		choose1: function(){
			var vs = env.vars.vs;
			if (vs.tmfunc) return;
			vs.selectedId(vs.id1());
			if (vs.collects.length == 2){
				vs.tmfunc = setTimeout(function(){
					env.evts.finish();
					env.vars.vs.tmfunc = null;
				}, 1000);
				return;
			}
			vs.tmfunc = setTimeout(function(){
				vs.tmfunc = null;
				env.evts.flyup();
			}, 600);
		},
		choose2: function(){
			var vs = env.vars.vs;
			if (vs.tmfunc) return;
			vs.selectedId(vs.id2());
			if (vs.collects.length == 2){
				vs.tmfunc = setTimeout(function(){
					env.evts.finish();
					env.vars.vs.tmfunc = null;
				}, 1000);
				return;
			}
			vs.tmfunc = setTimeout(function(){
				vs.tmfunc = null;
				env.evts.flyup();
			}, 600);
		},
		flyup: function(){
			var vs = env.vars.vs;
			var count = env.vars.counts[env.vars.room() - 1];
			if (vs.collects.length == 0){
				for (var i = 1; i <= count; i++) {
					vs.collects.push(i);
				};
			}
			var elm = $('.section-game');
			var ymax = env.vars.scrsize().h;
			elm.animate({
				top: -ymax,
			}, 500, function(){
				elm.css({top: ymax});
				var curr = vs.selectedId();
				vs.collects.splice(0, 2);
				vs.collects.push(curr);
				vs.id1(vs.collects[0]);
				vs.id2(vs.collects[1]);
				if (vs.collects.length <= 2)
					vs.title('Final Round');
				else if (vs.collects.length <= 4)
					vs.title('Round 2');
				else
					vs.title('Round 1');
				vs.selectedId(0);
				console.info(vs.collects);

				elm.animate({
					top: 0,
				}, 500, function(){
					elm.css({top: 0});
				});
			});
		},
		finish: function(){
			var room = env.vars.room();
			var id = env.vars.vs.selectedId();
			var info = data[room-1][id-1];
			env.vars.result.title(info.name);
			env.vars.result.desc(info.desc);
			env.vars.result.image('images/' + room + '/' + id + '.jpg');
			env.vars.result.adv1('images/' + room + '/result/' + id + 'a.png');
			env.vars.result.adv2('images/' + room + '/result/' + id + 'b.png');
			env.vars.setStep(4);
			var stitle = sprintf('我最喜爱的%s风格：%s。在这里选出我最爱的BEHR百色熊家居风格，秀出我的家居主张，你也来试试看吧！', series[room-1], info.name);
			app.setShareInfo(stitle);
		},
		clickDownload: function(){
			if (env.vars.sharefunc)
				clearTimeout(env.vars.sharefunc);
			$('.sharetip').hide();
			$('.downtip').show();
			env.vars.sharefunc = setTimeout(function(){
				$('.downtip').hide();
				env.vars.sharefunc = null;
			}, 2000);
			// window.location.href = "https://itunes.apple.com/cn/app/id637824495";
		},
		clickShare: function(){
			if (env.vars.sharefunc)
				clearTimeout(env.vars.sharefunc);
			$('.downtip').hide();
			$('.sharetip').show();
			env.vars.sharefunc = setTimeout(function(){
				$('.sharetip').hide();
				env.vars.sharefunc = null;
			}, 2000);
		},
		clickSubscribe: function(){
			window.location.href = "http://mp.weixin.qq.com/s?__biz=MzA5MTY2NTMxMg==&mid=205540727&idx=1&sn=df5707a0233b7e14fa054df5ec06bb39#rd";
		},
		loadNextImage: function(){
			var index = env.vars.loading.index() + 1;
			if (index >= env.vars.loading.list.length){
				env.vars.setStep(1);
			}else{
				var img = new Image();
				img.onload = function(){
					env.vars.loading.index(env.vars.loading.index() + 1);
					env.evts.loadNextImage();
				};
				img.src = env.vars.loading.list[index];
			}
		}
	}
};

$(function(){
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/micromessenger/i) != "micromessenger"){
		window.location.href = "https://itunes.apple.com/cn/app/id637824495";
		return;
	}
	if (!app.init())
		return;
	
	env.vars.scrsize({w: $(window).width(), h: $(window).height()});
	env.vars.scrscale(env.vars.scrsize().w / 640);
	env.vars.vs.rc1 = ko.computed(function(){
		var sz = env.vars.scrsize();
		var margin = env.vars.vs.margin * sz.w;
		var pad = env.vars.vs.padding * sz.w;
		var w = (1 - env.vars.vs.margin * 2) * sz.w;
		var h = w / env.vars.vs.aspect;
		return {
			x: margin, y: margin, 
			w: w, h: h, 
			iw: w - pad * 2 - 4, ih: h - pad * 2 - 4,
			pw: env.vars.vs.padding * sz.w
		};
	}, env);
	env.vars.vs.rc2 = ko.computed(function(){
		var sz = env.vars.scrsize();
		var margin = env.vars.vs.margin * sz.w;
		var pad = env.vars.vs.padding * sz.w;
		var w = (1 - env.vars.vs.margin * 2) * sz.w;
		var h = w / env.vars.vs.aspect;
		return {
			x: margin, y: margin * 2 + h, 
			w: w, h: h, 
			iw: w - pad * 2 - 4, ih: h - pad * 2 - 4,
			pw: env.vars.vs.padding * sz.w
		};
	}, env);
	env.vars.vs.rc = ko.computed(function(){
		var sz = env.vars.scrsize();
		var size = env.vars.vs.size_vs / 640 * sz.w;
		var margin = (sz.w - size) / 2;
		var rc1 = env.vars.vs.rc1();
		var y = rc1.y + rc1.h - size / 2;
		return {
			x: margin, y: y, 
			w: size, h: size, 
		};
	}, env);
	env.vars.vs.sectionMarginTop = ko.computed(function(){
		var h = env.vars.scrsize().h;
		var rc1 = env.vars.vs.rc1();
		h -= (rc1.y * 2 + rc1.h) * 2 + 10 + 20 + 25;
		if (h > 0)
			return h / 2;
		return 0;
	}, env);
	env.vars.vs.hand1 = ko.computed(function(){
        return (env.vars.vs.selectedId() == env.vars.vs.id1()) ? 'images/hand2.png' : 'images/hand2.png'
	}, env);
	env.vars.vs.hand2 = ko.computed(function(){
        return (env.vars.vs.selectedId() == env.vars.vs.id2()) ? 'images/hand2.png' : 'images/hand2.png'
	}, env);

	env.vars.loading.list = [];
	for (var i = 1; i <= 3; i++)
		env.vars.loading.list.push(sprintf('images/%s.jpg', i));
	for (var i = 0; i < data.length; i++) {
		var c = env.vars.counts[i];
		for (var j = 0; j < c; j++)
			env.vars.loading.list.push(sprintf('images/%s/%s.jpg', i+1, j+1));
	}
	env.vars.loading.index(-1);

	ko.applyBindings(env);

	env.vars.setStep(0);

	env.evts.loadNextImage();
});
