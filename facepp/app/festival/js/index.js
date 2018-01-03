var DefWords = {
	weixinTitle: '明星给您拜年啦！',
	weixinDesc: '恭喜发财！大吉大利！',
	choosePattern: '请先选择一个你喜欢的模板',
	configPatternSlots: '请依次点击明星头像，然后改为你的头像',
	clickToEditWords: '<请点击填写祝福语>',
	waitForFillingFaces: '明星头像还没有全部替换完成哦~',
	waitForUserWords: '你还没有编写祝福语哦~',
	promptForBackToPatterns: '要放弃当前的编辑，退回到模板选择吗？',
	promptForUserWords: '请设置祝福语：',
	detectingFaces: '正在识别人的脸……',
	failedForDetectingFaces: '对不起，识别技术太差劲了，这张照片上没能识别出人的脸，请自己框出来，或者再换一张吧！',
	clickToSelectYourFace: '请选择照片中的一个头像，并调整大小和位置',
	waitForChooseUserFace: '请选择这张照片中的一个头像~',
	previewModeKey: 'festival-preview',
	copyInfo: '"策划：微笑的忘忧草 | 设计：司徒醒醒 | 制作：孤胆飞影 | 问题请致：joyjones@126.com | ^o^谢谢观赏^o^"'
};

var vmodel = {
	configs: configs,
	screen: {
		w: 0,
		h: 0,
		scale: 1,
		resize: function(){
			this.w = $(window).width();
			this.h = $(window).height();
			this.scale = this.w / 640;
		},
		tip: {
			visible: ko.observable(false),
			text: ko.observable(''),
			show: function(msg){
				this.visible(true);
				this.text(msg);
			},
			hide: function(){
				this.visible(false);
				this.text('');
			}
		}
	},
	facepp: {
		core: null,
		init: function(){
			this.core = new FacePP(configs.facepp.key, configs.facepp.secret, {
			      apiURL: configs.facepp.url
			});
		},
		detect: function(imgUrl, callbk){
			this.core.request('detection/detect', {
			    url: imgUrl
			}, function(err, result) {
			    if (err) {
			        alert('face detect fail:' + JSON.stringify(result));
			        return;
			    }
			    callbk && callbk(result);
			});
		},
		parseFaces: function(result){
			var faces = [];
			var iw = Number(result.img_width);
			var ih = Number(result.img_height);
			if (!result.face.length){
				var sw = iw * 0.25;
				var sh = sw;
				var sx = (iw - sw) * 0.5;
				var sy = (ih - sh) * 0.5;
				faces.push({id: 'custom-' + vmodel.app.newGuid(), sx: sx, sy: sy, sw: sw, sh: sh})
			}else{
				for (var i = 0; i < result.face.length; ++i) {
					var face = result.face[i];
					var center = face.position.center;
					var w = iw * face.position.width * 0.01;
					var h = ih * face.position.height * 0.01 * 1.2;
					var x = iw * center.x * 0.01 - w * 0.5;
					var y = ih * center.y * 0.01 - h * 0.5;
					faces.push({id:face.face_id,sx:x,sy:y,sw:w,sh:h});
				};
			}
			return faces;
		}
	},
	app: {
		debugFlag: 0,
		pageName: ko.observable('loading'),
		setPage: function(name){
			var page = vmodel.app.pageName();
			if (page === name)
				return;
			$('section.'+page).hide();
			vmodel.app.pageName(name);
			$('section.'+name).show();
		},
		userInfo: ko.observable(null),
		groups: ko.observableArray(['单人', '双人', '三人', '四人', '五人+']),
		patterns: ko.observableArray([]),
		sharetip: {
			visible: ko.observable(false)
		},
		init: function(){
			this.stats('loading', 'browse', '浏览');

			vmodel.screen.resize();
			weixin.init({
				title: DefWords.weixinTitle,
				desc: DefWords.weixinDesc,
				imgUrl: configs.url + 'img/icon-1.jpg',
				success: function() {
				}
			}, [
				'chooseImage',
				'previewImage',
				'uploadImage'
			]);
			vmodel.facepp.init();
			this.login();
			this.requireData();
		},
		login: function(){
			$.ajax({
				url: 'server/server.php?act=login',
				dataType: 'json',
				error: function(e, s, r){
					console.log(e);
				},
				success: function(resp){
					console.log(resp);
					if (resp.success){
						vmodel.app.userInfo(resp.user);
					}
				}
			});
		},
		classifyPatterns: function(pats){
			var me = vmodel.app;
			var datas = [];
			var grps = me.groups();
			for (var i = 0; i < grps.length; i++) {
				datas.push([]);
			};
			for (var i = 0; i < pats.length; i++) {
				var p = pats[i];
				var idx = Number(p.group_id) - 1;
				if (idx >= datas.length)
					idx = datas.length - 1;
				if (idx >= 0)
					datas[idx].push(p);
				p.imgurl_mask = p.imgurl.replace(/\.jpg$/, ".m.png");
			};
			me.patterns(datas);
		},
		requireData: function(){
			var mat = /\bpid=(\d+)\b/.exec(window.location.href);
			if (mat == null || mat.length < 2)
				return;
			if (configs.debugging()){
				vmodel.app.classifyPatterns(configs.datas.patterns);
				vmodel.cover.post(configs.datas.post);
				return;
			}
			$.ajax({
				url: 'server/server.php?act=data&post_id=' + mat[1],
				dataType: 'json',
				error: function(e, s, r){
					console.log(e);
				},
				success: function(resp){
					console.log(resp);
					vmodel.app.classifyPatterns(resp.patterns);
					vmodel.cover.post(resp.post);
				}
			});
		},
		getPattern: function(patId){
			var patgrps = this.patterns();
			for (var i = 0; i < patgrps.length; i++) {
				var grp = patgrps[i];
				for (var j = 0; j < grp.length; j++) {
					if (grp[j].id == patId)
						return grp[j];
				}
			};
			return null;
		},
		newGuid: function(len) {
    		len = len || 32;
			// 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
			var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
			var guid = '';
			for (i = 0; i < len; i++)
				guid += chars.charAt(Math.floor(Math.random() * chars.length));
		    return guid;
		},
		drawFrame: function(g, canvas, flag){
			var imgFrm = vmodel.cover.getReadyImage('./img/frame.png');
			if (!imgFrm)
				return false;
			g.drawImage(imgFrm, 0, 0, imgFrm.width, imgFrm.height, 0, 0, canvas.width, canvas.height);
			var zoom = 502 / 640;
			if (flag == 0 || (flag & 1) != 0){
				var img = vmodel.cover.getReadyImage('./img/frame-deco1.png');
				if (!img)
					return false;
				g.drawImage(img, 0, 0, img.width, img.height, 0, 0, Math.floor(img.width * zoom), Math.floor(img.height * zoom));
			}
			if (flag == 0 || (flag & 2) != 0){
				var img = vmodel.cover.getReadyImage('./img/frame-deco2.png');
				if (!img)
					return false;
				var w = Math.floor(img.width * zoom);
				var h = Math.floor(img.height * zoom);
				g.drawImage(img, 0, 0, img.width, img.height, canvas.width - w, 0, w, h);
			}
			return true;
		},
		stats: function(page, key, action){
			$.ajax({
				url: 'server/stats.php',
				data: {key: 'festival-' + key, addval: 1},
				dataType: 'json'
			});
			_czc.push(['_trackEvent', page, action, '', '1']);
		}
	},
	cover: {
		status: ko.observable(0),
		post: ko.observable(null),
		canvas: null,
		graph: null,
		loadingImages: [],
		coveringSlots: ko.observable([]),
		titleImageIndex: ko.observable(1),
		init: function(){
			var me = this;
			var post = me.post();
			var pat = vmodel.app.getPattern(post.info.pattern_id);
			var cslots = [];
			var prevMode = me.checkPreviewMode();
			if (!pat.image){
				me.loadingImages.push({
					url: pat.imgurl,
					slotId: 0,
					loaded: false
				});
				me.loadingImages.push({
					url: pat.imgurl_mask,
					slotId: -1,
					loaded: false
				});
				if (!prevMode){
					for (var i = 0; i < pat.slots.length; i++) {
						cslots.push({
							id: pat.slots[i].id,
							slot: pat.slots[i],
							pos:{
								x: ko.observable(0),
								y: ko.observable(0)
							}
						});
					};
				}
			}
			me.coveringSlots(cslots);
			me.loadingImages.push({url: './img/frame.png', slotId: 0, loaded: false});
			me.loadingImages.push({url: './img/frame-deco1.png', slotId: 0, loaded: false});
			me.loadingImages.push({url: './img/frame-deco2.png', slotId: 0, loaded: false});
			var nickname = post.user ? post.user.nickname : '';
			var wxtitle = '大明星';
			if (nickname.length > 0)
				wxtitle += nickname;
			wxtitle += '给您拜年啦！' + post.info.words;
			weixin.fillShare({
				title: wxtitle,
				desc: post.info.words,
				success: function(){
					vmodel.app.stats('cover', 'sharePage', '分享页面');
				}
			});
			document.title = wxtitle;

			for (var i = 0; i < me.post().faces.length; i++) {
				var fc = post.faces[i];
				var found = false;
				for (var j = 0; j < me.loadingImages.length; j++) {
					var img = me.loadingImages[j];
					if (fc.user_image == img.url){
						found = true; break;
					}
				};
				if (!found){
					me.loadingImages.push({
						url: fc.user_image,
						slotId: fc.slot_id,
						loaded: false
					});
				}
			};
			for (var i = 0; i < me.loadingImages.length; i++) {
				var img = me.loadingImages[i];
				img.image = new Image();
				if (img.url.substr(0, 2) == './')
					img.image.src = img.url;
				else
					img.image.src = configs.qnUrl + img.url;
				img.image.info = img;
				img.image.onload = function(){
					this.info.loaded = true;
				};
			};
			if (prevMode){
				me.startPlay();
				vmodel.app.sharetip.visible(true);
			}
			setInterval(function(){
				var cv = vmodel.cover;
				var pname = vmodel.app.pageName();
				if (pname == 'loading'){
					if (cv.isImagesReady()){
						vmodel.app.setPage('cover');
						vmodel.app.stats('loading', 'visit', '打开页面');
					}else{
						var count = cv.loadingImages.length;
						var c = cv.getImageLoadedCount();
						var prog = '祝福加载中...（' + c + '/' + count + '）';
						// if (!cv.pointc)
						// 	cv.pointc = 3;
						// else if (++cv.pointc > 6)
						// 	cv.pointc = 6;
						// for (var i = 0; i < cv.pointc.length; i++) {
						// 	prog += '.';
						// };
						$('section.loading .text').text(prog);
					}
				}
				else if (pname == 'cover'){
					var idx = cv.titleImageIndex() + 1;
					if (idx > 2)
						idx = 1;
					cv.titleImageIndex(idx);

					var hidden = cv.canvas.offsetLeft <= 0;
					$('section.cover .arrows').css({
						left: cv.canvas.offsetLeft,
						top: cv.canvas.offsetTop,
						display: hidden ? 'none' : 'block'
					});
				}
			}, 1000);
		},
		checkPreviewMode: function(){
			var prevMode = window.localStorage.getItem(DefWords.previewModeKey);
			if (prevMode == 'true'){
				window.localStorage.removeItem(DefWords.previewModeKey);
				return true;
			}
			return false;
		},
		setPreviewMode: function(){
			window.localStorage.setItem(DefWords.previewModeKey, 'true');
		},
		isImagesReady: function(){
			for (var i = 0; i < this.loadingImages.length; i++) {
				if (!this.loadingImages[i].loaded)
					return false;
			}
			return true;
		},
		getImageLoadedCount: function(){
			var cnt = 0;
			for (var i = 0; i < this.loadingImages.length; i++) {
				if (this.loadingImages[i].loaded){
					cnt++;
				}
			}
			return cnt;
		},
		getReadyImage: function(url){
			for (var i = 0; i < this.loadingImages.length; i++) {
				var img = this.loadingImages[i];
				if (img.loaded && img.url == url)
					return img.image;
			}
			return null;
		},
		draw: function(){
			var me = this;
			if (!me.isImagesReady())
				return;
			// vmodel.app.setPage('cover');

			var post = me.post();
			var pat = vmodel.app.getPattern(post.info.pattern_id);
			if (!me.canvas){
				me.canvas = $('section.cover canvas.view')[0];
			}
			if (!me.graph)
				me.graph = me.canvas.getContext("2d");

			var g = me.graph;
			g.clearRect(0, 0, me.canvas.width, me.canvas.height);
			// 解决有些手机clearRect无效的问题
			me.canvas.style.display = 'none';// Detach from DOM
			me.canvas.offsetHeight; // Force the detach
			me.canvas.style.display = 'inherit'; // Reattach to DOM
			var img = me.getReadyImage(pat.imgurl);
			me.canvas.width = vmodel.screen.w * 0.9;
			me.canvas.height = vmodel.screen.w * 0.9;
			g.drawImage(img, 0, 0, pat.width, pat.height, 0, 0, me.canvas.width, me.canvas.height);

			for (var i = 0; i < pat.slots.length; i++) {
				var slot = pat.slots[i];
				slot.rx = Number(slot.x) / Number(pat.width) * me.canvas.width;
				slot.ry = Number(slot.y) / Number(pat.height) * me.canvas.height;
				slot.rw = Number(slot.w) / Number(pat.width) * me.canvas.width;
				slot.rh = Number(slot.h) / Number(pat.height) * me.canvas.height;
				var covering = false;
				var cslots = me.coveringSlots();
				for (var j = 0; j < cslots.length; j++) {
					if (cslots[j].id == slot.id){
						covering = true;
						break;
					}
				};
				if (covering)
					continue;
				var face = null;
				for (var i = 0; i < post.faces.length; i++) {
					var fc = post.faces[i];
					if (fc.slot_id == slot.id){
						face = fc;
						break;
					}
				};
				if (face == null)
					continue;
				var r_user = face.w / face.h;
				var r_slot = slot.rw / slot.rh;
				var dx = slot.rx, dy = slot.ry, dw = slot.rw, dh = slot.rh;
				if (r_user > r_slot){
					dw = r_user * dh;
					dx -= (dw - slot.rw) * 0.5;
				}else if (r_user < r_slot){
					dh = dw / r_user;
					dy -= (dh - slot.rh) * 1;//保持用户脸部下边缘与脸槽的底部对齐
				}
				var imgFace = me.getReadyImage(face.user_image);
				g.drawImage(imgFace,
							face.x, face.y, face.w, face.h,
							dx, dy, dw, dh);
			};

			var imgMask = me.getReadyImage(pat.imgurl_mask);
			g.drawImage(imgMask, 0, 0, pat.width, pat.height,
						0, 0, me.canvas.width, me.canvas.height);

			if (!vmodel.app.drawFrame(g, me.canvas, Number(pat.decorate_flag))){
				setTimeout(function(){me.draw()}, 200);
			}

			var cslots = me.coveringSlots();
			for (var i = 0; i < cslots.length; i++) {
				var cs = cslots[i];
				cs.pos.x(cs.slot.rx + vmodel.screen.w * 0.05);
				cs.pos.y(cs.slot.ry + cs.slot.rh);
			};
			me.coveringSlots([]);
			me.coveringSlots(cslots);
		},
		onclick: function(m, e){
			var me = m.cover;
			var post = me.post();
			var pat = vmodel.app.getPattern(post.info.pattern_id);
			var cslots = me.coveringSlots();
			for (var i = 0; cslots.length > 0 && i < pat.slots.length; i++) {
				var slot = pat.slots[i];
				if (e.offsetX >= slot.rx && e.offsetX < slot.rx + slot.rw &&
					e.offsetY >= slot.ry && e.offsetY < slot.ry + slot.rh){
					for (var j = 0; j < cslots.length; j++) {
						if (cslots[j].id == slot.id){
							cslots.splice(j, 1);
							break;
						}
					};
					me.draw();
					if (cslots.length == 0){
						me.startPlay();
					}
					me.coveringSlots(cslots);
					return;
				}
			};
		},
		startPlay: function(){
			this.status(1);
			vmodel.app.stats('cover', 'openCover', '揭开明星头像');
			var elem = $('#bgmusic');
			var player = elem[0].player || elem[0];
			var media = player.media || elem[0];
			try{
				player.play();
			}catch(ex){
				console.log(JSON.stringify(ex));
			}
		},
		showCopyInfo: function(m){
			vmodel.app.stats('cover', 'clickAbout', '点击关于');
			alert(DefWords.copyInfo);
		}
	},
	make: {
		editingMode: ko.observable(false),
		title: ko.observable(DefWords.choosePattern),
		focusPatIndex: ko.observable(-1),
		userWords: ko.observable(''),
		focusGroupIndex: ko.observable(-1),
		focusGroup: function(){
			var idx = vmodel.make.focusGroupIndex();
			if (idx < 0)
				return null;
			return vmodel.app.patterns()[idx];
		},
		canSubmit: function(){
			var pat = vmodel.make.focusPattern();
			if (!pat)
				return false;
			var c = this.userFacesCount(pat);
			return c === pat.slots.length;
		},
		userFacesCount: function(pat){
			var c = 0;
			for (var i = 0; pat && i < pat.slots.length; ++i) {
				var slot = pat.slots[i];
				slot.user && (c++);
			};
			return c;
		},
		selectPattern: function(){
			vmodel.make.editingMode(true);
			vmodel.make.title(DefWords.configPatternSlots);
			vmodel.app.stats('make', 'clickSelPattern', '点击使用模板');
		},
		cancelPattern: function(m){
			if (m.make.userFacesCount(m.make.focusPattern()) > 0){
				if (!confirm(DefWords.promptForBackToPatterns))
					return;
			}
			m.make.editingMode(false);
			m.make.title(DefWords.choosePattern);
		},
		clearPattern: function(m){
			m.make.userWords('');
			var pat = vmodel.make.focusPattern();
			for (var i = 0; pat && i < pat.slots.length; ++i)
				pat.slots[i].user = null;
			m.make.preview.draw();
		},
		changePattern: function(addval){
			if (vmodel.make.focusGroupIndex() < 0)
				vmodel.make.focusGroupIndex(0);
			var count = vmodel.make.focusGroup().length;
			if (count == 0){
				vmodel.make.focusPatIndex(-1);
				return;
			}
			var index = vmodel.make.focusPatIndex() + addval;
			if (addval === 0 && index < 0)
				index = 0;
			else if (addval > 0 && index >= count)
				index = 0;
			else if (addval < 0 && index < 0)
				index = count - 1;
			vmodel.make.focusPatIndex(index);
			if (vmodel.make.focusGroupIndex() < 0)
				vmodel.make.focusGroupIndex(0);
		},
		focusPattern: function(){
			var grp = vmodel.make.focusGroup();
			if (grp == null)
				return null;
			var index = vmodel.make.focusPatIndex();
			if (index < 0)
				return null;
			return grp[index];
		},
		isFocusPattern: function(id){
			var p = this.focusPattern();
			return p != null && p.id == id;
		},
		clickWords: function(m){
			m.make.userWords(prompt(DefWords.promptForUserWords, m.make.userWords()));
		},
		onChangeGroup: function(){
			var grp = vmodel.make.focusGroup();
			if (grp.length > 0){
				vmodel.make.focusPatIndex(0);
				vmodel.make.preview.draw();
			}
		},
		submit: function(m){
			if (!m.make.editingMode())
				return;
			if (!m.make.canSubmit()){
				alert(DefWords.waitForFillingFaces);
				return;
			}
			var pat = m.make.focusPattern();
			if (!pat)
				return;
			var uwords = m.make.userWords();
			if (!uwords || !uwords.length){
				alert(DefWords.waitForUserWords)
				return;
			}
			var ufaces = [];
			for (var i = 0; i < pat.slots.length; i++) {
				var slot = pat.slots[i];
				if (!slot.user){
					alert(DefWords.waitForFillingFaces);
					return;
				}
				ufaces.push({
					face_id: slot.user.faceId,
					slot_id: slot.id,
					user_image: slot.user.file,
					position: {
						x: slot.user.rect.sx,
						y: slot.user.rect.sy,
						w: slot.user.rect.sw,
						h: slot.user.rect.sh,
					}
				})
			};
			var user = m.app.userInfo();
			var nickname = prompt('请填写您的昵称：', user ? user.nickname : '');
			if (!nickname || nickname.length == 0){
				alert('已取消发布~');
				return;
			}
			$.ajax({
				url: 'server/server.php?act=submit',
				type: 'post',
				dataType: 'json',
				data: {
					pattern_id: pat.id,
					words: uwords,
					faces: ufaces,
					nickname: nickname
				},
				success: function(resp){
					console.log('submit:', resp);
					m.cover.setPreviewMode();
					setTimeout(function(){
						window.location.href = 'index.html?pid=' + resp.postId;
					}, 100);
				},
				error: function(){
					console.log('submit fail');
				}
			});
			vmodel.app.stats('make', 'submitPost', '点击发布');
		},
		preview: {
			canvas: null,
			graph: null,
			focusFaceIndex: ko.observable(-1),
			draw: function(){
				if (vmodel.app.pageName() != 'make' && vmodel.app.pageName() != 'photo')
					return;
				var pat = vmodel.make.focusPattern();
				if (!pat)
					return;
				var me = this;
				if (!pat.image){
					pat.image = new Image();
					pat.image.src = configs.qnUrl + pat.imgurl;
					pat.image.onload = function(){
						me.draw();
					};
					pat.imageMask = new Image();
					pat.imageMask.src = configs.qnUrl + pat.imgurl.replace(/\.jpg$/, ".m.png");
					return;
				}
				if (!me.canvas)
					me.canvas = $('section.make canvas.view')[0];
				if (!me.graph)
					me.graph = me.canvas.getContext("2d");
				var g = me.graph;
				g.clearRect(0, 0, me.canvas.width, me.canvas.height);
				// 解决有些手机clearRect无效的问题
				me.canvas.style.display = 'none';// Detach from DOM
				me.canvas.offsetHeight; // Force the detach
				me.canvas.style.display = 'inherit'; // Reattach to DOM
				me.canvas.width = vmodel.screen.w * 0.9;
				me.canvas.height = vmodel.screen.w * 0.9;
				g.drawImage(pat.image, 0, 0, pat.width, pat.height, 0, 0, me.canvas.width, me.canvas.height);

				if (vmodel.make.editingMode()){
					g.strokeStyle = "#f00";
					g.lineWidth = 2;
					var hasUserFace = false;
					for (var i = 0; i < pat.slots.length; i++) {
						var slot = pat.slots[i];
						slot.rx = Number(slot.x) / Number(pat.width) * me.canvas.width;
						slot.ry = Number(slot.y) / Number(pat.height) * me.canvas.height;
						slot.rw = Number(slot.w) / Number(pat.width) * me.canvas.width;
						slot.rh = Number(slot.h) / Number(pat.height) * me.canvas.height;
						if (slot.user){
							var r_user = slot.user.rect.sw / slot.user.rect.sh;
							var r_slot = slot.rw / slot.rh;
							var dx = slot.rx, dy = slot.ry, dw = slot.rw, dh = slot.rh;
							if (r_user > r_slot){
								dw = r_user * dh;
								dx -= (dw - slot.rw) * 0.5;
							}else if (r_user < r_slot){
								dh = dw / r_user;
								dy -= (dh - slot.rh) * 1;//保持用户脸部下边缘与脸槽的底部对齐
							}
							g.drawImage(slot.user.image,
										slot.user.rect.sx, slot.user.rect.sy, slot.user.rect.sw, slot.user.rect.sh,
										dx, dy, dw, dh);
							hasUserFace = true;
						}
					};
					if (hasUserFace && pat.imageMask){
						g.drawImage(pat.imageMask, 0, 0, pat.width, pat.height,
									0, 0, me.canvas.width, me.canvas.height);
					}
					for (var i = 0; i < pat.slots.length; i++) {
						var slot = pat.slots[i];
						if (!slot.user){
							g.strokeRect(slot.rx, slot.ry, slot.rw, slot.rh);
						}
					};
				}
				if (!vmodel.app.drawFrame(g, me.canvas, Number(pat.decorate_flag))){
					setTimeout(function(){me.draw()}, 200);
				}
			},
			onclick: function(m, e){
				if (!m.make.editingMode())
					return;
				var pat = m.make.focusPattern();
				if (!pat)
					return;
				for (var i = 0; i < pat.slots.length; i++) {
					var fc = pat.slots[i];
					if (e.offsetX >= fc.rx && e.offsetX < fc.rx + fc.rw &&
						e.offsetY >= fc.ry && e.offsetY < fc.ry + fc.rh){
						vmodel.make.preview.focusFaceIndex(i);
						if (fc.user)
							vmodel.make.photo.show(fc.user.file);
						else
							vmodel.make.preview.takePhoto(i);
						return;
					}
				};
			},
			tempvar: false,
			takePhoto: function(faceIndex){
				if (faceIndex !== undefined && faceIndex >= 0){
					this.focusFaceIndex(faceIndex);
				}
				if (configs.debugging() || !weixin.isInWeixin()){
					if (!this.tempvar)
						// vmodel.make.photo.show('photo/slicIfa7gcHAQAV048NgbE2BxY_DAtIyZaQWC0pXbPckkV3MHBtYKEpDpzmZCsLx');//识别不出来
						// vmodel.make.photo.show('photo/ozi2Fgr4J5vXW2AE9EM07zasP3RxpuXPaVB7j_jKZ_WTnxpISmlmgoEAdr0AY6Ry');
						vmodel.make.photo.show('photo/IMG_0255.JPG');
					else
						vmodel.make.photo.show('photo/dml6hEA6SxPJTYptmnhyWcwm6Ol0cQjXgyjfh9ahy95ieC-FCuIzDNgEj6r04HSp');
					this.tempvar = !this.tempvar;
					return;
				}
				weixin.chooseImage(1, function(success, urls){
					if (!success)
						return;
					weixin.uploadImage(urls[0], function(suc, res){
						if (!suc)
							alert(JSON.stringify(res));
						else
							vmodel.make.preview.savePhoto(res.serverId);
					});
				});
			},
			savePhoto: function(mediaId){
				$.ajax({
					url: 'server/server.php?act=fetch',
					type: 'post',
	            	dataType: 'json',
					data: {
						media_id: mediaId,
						group: 'photo'
					},
					success: function(res){
						vmodel.make.photo.show('photo/' + mediaId);
					},
					error: function(e, r, s){
						alert('fetch image failed:'+JSON.stringify(e)+JSON.stringify(r)+JSON.stringify(s));
					}
				})
			},
			setUserFace: function(m, file, image, face){
				var pat = m.make.focusPattern();
				var index = m.make.preview.focusFaceIndex();
				if (!pat || index < 0)
					return;
				var slot = pat.slots[index];
				slot.user = {
					faceId: face.id,
					file: file,
					image: image,
					rect: {x: face.x, y: face.y, w: face.w, h: face.h,
							sx: face.sx, sy: face.sy, sw: face.sw, sh: face.sh}
				};
				m.make.preview.draw();
			}
		},
		photo: {
			image: null,
			imageFile: null,
			canvas: null,
			graph: null,
			faces: null,
			selectFaceIndex: ko.observable(-1),
			selectDragCorner: -1,
			hoverDragCorner: -1,
			title: ko.observable(DefWords.clickToSelectYourFace),
			funcRedraw: null,
			needRedraw: true,
			cornerRadius: 15,
			show: function(resName){
				var me = this;
				var url = configs.qnUrl + resName;
				me.image = new Image();
				me.image.loaded = false;
				me.image.src = url;
				me.image.onload = function(){
					this.loaded = true;
				};
				me.imageFile = resName;
				me.selectFaceIndex(-1);
				me.faces = null;
				vmodel.screen.tip.show(DefWords.detectingFaces);
				vmodel.facepp.detect(url, function(result){
					vmodel.screen.tip.hide();
					if (result.face.length === 0)
						alert(DefWords.failedForDetectingFaces);
					me.faces = vmodel.facepp.parseFaces(result);
					me.needRedraw = true;
				});
				vmodel.app.setPage('photo');
				if (!me.funcRedraw)
					me.funcRedraw = setInterval(function(){vmodel.make.photo.draw()}, 80);
			},
			draw: function(force){
				var me = this;
				if (!me.image || !me.image.loaded)
					return;
				if (!me.needRedraw && !force)
					return;

				me.needRedraw = false;
				if (!me.canvas)
					me.canvas = $('section.photo canvas.view')[0];
				if (!me.graph)
					me.graph = me.canvas.getContext("2d");
				var borderW = 4;
				var maxW = vmodel.screen.w - borderW * 2;
				var maxH = Math.floor(vmodel.screen.h * 0.6) - borderW * 2;
				var cavAsp = maxW / maxH;
				var imgW = me.image.width;
				var imgH = me.image.height;
				var imgAsp = imgW / imgH;
				var horiMode = false;
				var cavW = maxW, cavH = maxH, cavX = 0, cavY = 0;
				if (cavAsp > imgAsp){
					cavW = cavH * imgAsp;
					cavX = Math.floor((maxW - cavW) * 0.5);
				}else if (cavAsp < imgAsp){
					cavH = cavW / imgAsp;
					cavY = Math.floor((maxH - cavH) * 0.5);
					horiMode = true;
				}
				var g = me.graph;
				g.clearRect(0, 0, me.canvas.width, me.canvas.height);
				// 解决有些手机clearRect无效的问题
				me.canvas.style.display = 'none';// Detach from DOM
				me.canvas.offsetHeight; // Force the detach
				me.canvas.style.display = 'inherit'; // Reattach to DOM
				me.canvas.parentElement.style.paddingLeft = cavX + 'px';
				me.canvas.parentElement.style.paddingTop = cavY + 'px';
				if (horiMode)
					me.canvas.parentElement.style.paddingBottom = cavY + 'px';
				else
					me.canvas.parentElement.style.paddingBottom = '0';
				me.canvas.width = cavW;
				me.canvas.height = cavH;

				g.drawImage(me.image, 0, 0, imgW, imgH, 0, 0, cavW, cavH);

				if (me.faces != null){
					for (var i = 0; i < me.faces.length; i++) {
						var selected = i == me.selectFaceIndex();
						if (selected){
							g.strokeStyle = g.fillStyle = "#0f0";
							g.lineWidth = 4;
						}else{
							g.strokeStyle = g.fillStyle = "#f00";
							g.lineWidth = 2;
						}
						var face = me.faces[i];
						face.x = face.sx / me.image.width * cavW;
						face.y = face.sy / me.image.height * cavH;
						face.w = face.sw / me.image.width * cavW;
						face.h = face.sh / me.image.height * cavH;
						g.strokeRect(face.x, face.y, face.w, face.h);

						var corners = [
							{x: face.x, y: face.y},
							{x: face.x + face.w, y: face.y + face.h}
						];
						for (var j = 0; j < corners.length; ++j){
							var c = corners[j];
							g.beginPath();
							g.moveTo(c.x, c.y);
							g.arc(c.x, c.y, me.cornerRadius, 0, 2 * Math.PI);
							if (selected && me.selectDragCorner == j){
								g.fill();
							}else{
								g.stroke();
							}
						}
					};
				}
			},
			getHoverFaceIndex: function(me, x, y){
				if (!me.faces.length)
					return;
				for (var i = 0; i < me.faces.length; i++) {
					var fc = me.faces[i];
					var lt = {x: fc.x - me.cornerRadius, y: fc.y - me.cornerRadius};
					var rb = {x: fc.x + me.cornerRadius, y: fc.y + me.cornerRadius};
					if (x >= lt.x && x < rb.x && y >= lt.y && y < rb.y){
						me.hoverDragCorner = 0;
						return i;
					}
					lt = {x: fc.x + fc.w - me.cornerRadius, y: fc.y + fc.h - me.cornerRadius};
					rb = {x: fc.x + fc.w + me.cornerRadius, y: fc.y + fc.h + me.cornerRadius};
					if (x >= lt.x && x < rb.x && y >= lt.y && y < rb.y){
						me.hoverDragCorner = 1;
						return i;
					}
					if (x >= fc.x && x < fc.x + fc.w &&
						y >= fc.y && y < fc.y + fc.h){
						me.hoverDragCorner = -1;
						return i;
					}
				};
				me.hoverDragCorner = -1;
				return -1;
			},
			onclick: function(m, e){
			},
			ontouch: function(m, e){
				// console.log('touch:', e);
				var me = m.make.photo;
				var faceIndex = me.selectFaceIndex();
				var t = e.target || e.currentTarget;
				var hoverIndex = me.getHoverFaceIndex(me, e.clientX - t.offsetLeft, e.clientY - t.offsetTop);
				if (hoverIndex >= 0){
					if (faceIndex != hoverIndex){
						me.selectFaceIndex(hoverIndex);
						me.needRedraw = true;
					}
					if (me.selectDragCorner != me.hoverDragCorner){
						me.selectDragCorner = me.hoverDragCorner;
						me.needRedraw = true;
					}
					var fc = me.faces[hoverIndex];
					fc.touchOffset = {dx: e.clientX - fc.x, dy: e.clientY - fc.y};
				}
				else if (faceIndex >= 0){
					var fc = me.faces[faceIndex];
					fc.touchOffset = null;
					me.selectFaceIndex(-1);
					me.needRedraw = true;
				}
			},
			ondragging: function(m, e){
				// console.log('drag:', e);
				var me = m.make.photo;
				var faceIndex = me.selectFaceIndex();
				if (faceIndex >= 0){
					var fc = me.faces[faceIndex];
					if (!fc.touchOffset)
						return;
					var asp = me.image.width / me.canvas.width;
					if (me.selectDragCorner === 0){
						var sx2 = (e.clientX - fc.touchOffset.dx) * asp;
						var sy2 = (e.clientY - fc.touchOffset.dy) * asp;
						fc.sw += fc.sx - sx2;
						fc.sh += fc.sy - sy2;
						fc.sx = sx2;
						fc.sy = sy2;
					}else if (me.selectDragCorner === 1){
						var t = e.target || e.currentTarget;
						fc.sw = (e.clientX - t.offsetLeft - fc.x) * asp;
						fc.sh = (e.clientY - t.offsetTop - fc.y) * asp;
					}else{
						fc.sx = (e.clientX - fc.touchOffset.dx) * asp;
						fc.sy = (e.clientY - fc.touchOffset.dy) * asp;
					}
					me.needRedraw = true;
				}
			},
			ontouchend: function(m, e){
				// console.log('touchend:', e);
				var me = m.make.photo;
				var faceIndex = me.selectFaceIndex();
				if (faceIndex >= 0){
					me.faces[faceIndex].touchOffset = null;
					me.needRedraw = true;
				}
			},
			confirm: function(m){
				var index = m.make.photo.selectFaceIndex();
				if (index < 0){
					alert(DefWords.waitForChooseUserFace)
					return;
				}
				var face = m.make.photo.faces[index];
				m.app.setPage('make');
				m.make.preview.setUserFace(m, m.make.photo.imageFile, m.make.photo.image, face);
			},
			cancel: function(m){
				m.make.photo.selectFaceIndex(-1);
				m.app.setPage('make');
			}
		}
	}
};

vmodel.app.pageName.subscribe(function(newValue) {
	if (newValue == 'cover')
		vmodel.cover.draw();
	else if (newValue == 'make'){
		vmodel.make.preview.draw();
		vmodel.app.stats('cover', 'clickMake', '点击制作');
	}
});

vmodel.app.patterns.subscribe(function(newValue) {
	vmodel.make.changePattern(0);
});

vmodel.app.sharetip.visible.subscribe(function(newValue) {
	if (newValue && !vmodel.app.sharetip.funcHidding){
		vmodel.app.sharetip.funcHidding = setTimeout(function(){
			vmodel.app.sharetip.visible(false);
		}, 2500);
	}
});

vmodel.cover.post.subscribe(function(newValue) {
	vmodel.cover.init();
});

vmodel.make.focusGroupIndex.subscribe(function(newValue) {
	vmodel.make.onChangeGroup();
});

vmodel.make.focusPatIndex.subscribe(function(newValue) {
	setTimeout(function(){
		vmodel.make.preview.draw();
	}, 100);
});

vmodel.make.editingMode.subscribe(function(newValue) {
	setTimeout(function(){
		vmodel.make.preview.draw();
	}, 100);
});

vmodel.make.displayUserWords = ko.computed(function(m){
	var words = vmodel.make.userWords();
	if (words && words.length > 0)
		return words;
	return DefWords.clickToEditWords;
});

$(function(){
	if (!/\?pid=22$/.test(window.location.href)){
		ko.applyBindings(vmodel);
		vmodel.app.init();
	}else{
		vmodel.app.debugFlag = 1;
		ko.applyBindings(vmodel);
		vmodel.app.init();
	}
});