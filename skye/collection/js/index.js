"use strict";

var app = {
	opts: {
		scrn: {
			size: {w: 0, h: 0},
			aspect: 1,
			scale: 1
		},
		image: {
			aspect: 640 / 1080
		},
		pageCount: 4,
		door: {overH: 50}
	},
	dlgInfo : {
		elm: null,
		visible: false,
	},
	elms: [],
	titles: {
		elms: [],
		poses: [
			{},
			{from: '-100%', to: '8%'},
			{from: '100%', to: '10%'},
			{from: '-100%', to: '6%'},
		],
		curIdx: 0
	},
	curPage: 0,
	touch: {
		enabled: false,
		sliding: false,
		pos: null,
		offset: 0,
		limit: 80,
		span: 600,
		targetPage: -1,
	},
	init: function(){
		var scr = this.opts.scrn;
		scr.size.w = $(window).width();
		scr.size.h = $(window).height();
		scr.aspect = scr.size.w / scr.size.h;
		scr.scale = scr.size.w / 640;
		$('body').css({height: scr.size.h});
		// if (scr.aspect >= this.opts.image.aspect){
		// 	$('section').css({
		// 		'background-size': '100%',
		// 		'background-position-x': 'auto',
		// 		'background-position-y': '50%'
		// 	});
		// }else{
		// 	$('section').css({
		// 		'background-size': 'auto 100%',
		// 		'background-position-x': '50%',
		// 		'background-position-y': 'auto'
		// 	});
		// }
		$('.page').on('vmousedown', function(e){
			e.preventDefault();
			app.onTouchBegin(e);
		}).on('vmousemove', function(e){
			e.preventDefault();
			app.onTouchMove(e);
		}).on('vmouseup', function(e){
			e.preventDefault();
			app.onTouchEnd(e);
		}).on('vclick', function(e){
			e.preventDefault();
			app.slideFinish();
		});
		this.dlgInfo.elm = $('.page.info .dlg');
		$('.page.info .dlg .close').on('vclick', function(e){
			e.preventDefault();
			app.showInfo(false);
		});
		$('.page.info .open').on('vclick', function(e){
			e.preventDefault();
			app.showInfo(true);
		});
		this.titles.elms.push($('.page.title .banner img.t0'));
		this.titles.elms.push($('.page.title .banner img.t1'));
		this.titles.elms.push($('.page.title .banner img.t2'));
		this.titles.elms.push($('.page.title .banner img.t3'));
		$('.door-up').on('vclick', function(e){
			app.clickUpload();
		});
		$('.door-dn').on('vclick', function(e){
			app.clickVote();
		});


		this.elms.length = 0;
		for (var i = 0; i < this.opts.pageCount; i++) {
			var elm = $('.page:eq('+i+')').css({
				'z-index': 100 - i,
			});
			i > 0 && elm.hide();
			this.elms.push(elm);
		};
		this.setPage(0);
		setTimeout(function(){
			app.elms[1].css({top: app.opts.scrn.size.h}).show();
			app.slideNext();
		}, 1000);
	},
	setPage: function(index){
		if (index < 0 || index >= this.elms.length)
			return;
		for (var i = 0; i < this.elms.length; i++) {
			if (i == index)
				this.elms[i].css({top: 0}).show();
			else
				this.elms[i].hide().css({top: 0});
		};
		this.curPage = index;
		this.touch.enabled = this.curPage > 0 && this.curPage < 4;
		if (this.curPage == this.opts.pageCount - 1){
			this.startTitleAnimations();
		}
	},
	onTouchBegin: function(e){
		if (this.touch.sliding || !this.touch.enabled)
			return;
		this.touch.pos = {x: e.clientX, y: e.clientY};
	},
	onTouchMove: function(e){
		var t = this.touch;
		if (t.sliding || !t.pos)
			return;
		t.offset = e.clientY - t.pos.y;
		var i = this.curPage;
		i <= 1 && t.offset > 0 && (t.offset = 0);

		var p1 = i > 0 ? this.elms[i - 1] : null;
		var p = this.elms[i];
		var p2 = (i < this.elms.length - 1) ? this.elms[i + 1] : null;
		if (t.offset > 0){
			p1 && p1.show();
			p2 && p2.hide();
		}else if (t.offset < 0){
			p2 && p2.show();
			p1 && p1.hide();
		}
		var scrn = this.opts.scrn;
		var sh = scrn.size.h - Math.abs(t.offset);
		var sw = scrn.aspect * sh;
		p1 && p1.css({
			top: t.offset - scrn.size.h,
			left: 0,
			width: scrn.size.w,
			height: scrn.size.h,
		});
		p.css({
			top: t.offset < 0 ? 0 : (t.offset),
			left: (scrn.size.w - sw) * 0.5,
			width: sw,
			height: sh
		});
		p2 && p2.css({
			top: scrn.size.h + t.offset,
			left: 0,
			width: scrn.size.w,
			height: scrn.size.h,
		});
	},
	onTouchEnd: function(e){
		var t = this.touch;
		if (!t.offset)
			return;
		if (t.offset > t.limit)
			this.slidePrev();
		else if (t.offset < -t.limit)
			this.slideNext();
		else
			this.slideRestore();
	},
	slidePrev: function(){
		if (this.touch.sliding)
			return;
		if (this.curPage <= 1){
			this.slideRestore();
			return;
		}
		this.touch.sliding = true;
		this.touch.targetPage = this.curPage - 1;
		var p_up = this.elms[this.curPage - 1];
		var p_cur = this.elms[this.curPage];
		var scrn = this.opts.scrn;
		p_up.animate({
			top: 0
		}, this.touch.span);
		p_cur.animate({
			top: scrn.size.h,
			left: scrn.size.w * 0.5,
			width: 0,
			height: 0,
		}, this.touch.span, function(){
			app.slideFinish();
		});
	},
	slideNext: function(){
		if (this.touch.sliding)
			return;
		if (this.curPage >= this.elms.length - 1){
			this.slideRestore();
			return;
		}
		this.touch.sliding = true;
		this.touch.targetPage = this.curPage + 1;
		var p_dn = this.elms[this.curPage + 1];
		var p_cur = this.elms[this.curPage];

		var scrn = this.opts.scrn;
		p_dn.animate({top: 0}, this.touch.span);
		p_cur.animate({
			left: scrn.size.w * 0.5,
			width: 0,
			height: 0,
		}, this.touch.span, function(){
			app.slideFinish();
	 	});
	},
	slideRestore: function(){
		if (this.touch.sliding)
			return;
		this.touch.sliding = true;
		var i = this.curPage;
		var p1 = i > 0 ? this.elms[i - 1] : null;
		var p = this.elms[i];
		var p2 = (i < this.elms.length - 1) ? this.elms[i + 1] : null;
		var size = this.opts.scrn.size;
		p.animate({
			top: 0,
			left: 0,
			width: size.w,
			height: size.h,
		}, 400, function(){
			app.slideFinish();
	 	});
		p1 && p1.animate({top: -size.h}, 400);
		p2 && p2.animate({top: size.h}, 400);
	},
	slideFinish: function(){
		if (!this.touch.sliding)
			return;
		this.touch.sliding = false;
		this.touch.offset = 0;
		this.touch.pos = null;
		if (this.touch.targetPage > 0){
			this.setPage(this.touch.targetPage);
			this.touch.targetPage = -1;
		}
	},
	showInfo: function(show){
		if (this.dlgInfo.visible == show)
			return;
		this.dlgInfo.visible = show;
		var from = show ? '100%' : '10%';
		var to = show ? '10%' : '-80%';
		var ease = show ? 'easeInOutCubic' : 'easeInOutBack';
		this.dlgInfo.elm
		.css({left: from, display: 'block'})
		.animate({left: to}, 400);
	},
	startTitleAnimations: function(){
		var es = this.titles.elms;
		var ps = this.titles.poses;
		var span = 2000;
		es[0].animate({opacity: 1}, span);
	 	var t = 0, inv = 500; span = 400;
	 	app.titles.curIdx = 0;
	 	for (var i = 1; i < es.length; i++) {
		 	es[i].css({left: ps[i].from});
	 		setTimeout(function(){
	 			var idx = ++app.titles.curIdx;
			 	es[idx].animate({
			 		left: ps[idx].to, 
			 		opacity:1
			 	}, span);
	 		}, t);
	 		t += inv;
	 	}
	 	$('.page.title .banner').show();
	 	setTimeout(function(){
	 		app.startClosingDoor();
	 	}, 2500);
	},
	startClosingDoor: function(){
		var scr = this.opts.scrn;
		var midy = scr.size.h * 0.5;
		var upbtm = scr.size.h - (midy + this.opts.door.overH * 0.5 * scr.scale);
		var dntop = midy - this.opts.door.overH * 0.5 * scr.scale;
		
		$('.door-up')
		.css({bottom: scr.size.h})
		.show()
		.animate({bottom: upbtm}, 500);

		$('.door-dn')
		.css({top: scr.size.h})
		.show()
		.animate({top: dntop}, 500);
	},
	clickUpload: function(){
		window.location.href = 'upload.html';
	},
	clickVote: function(){
		window.location.href = 'gallery.html';
	}
};

$.ajax({url: 'access.php?act=login&section=0'});

$(function(){
	weixin.init();
	app.init();
});