var configs = {
	qiniuUrl: 'http://7xj4xe.com1.z0.glb.clouddn.com/',
    porp: {w: 480, h: 658},
    lines: [
        '我是',
        'BURTON GIRL',
        '{NAME}',
        '有种横行就爱',
        '{WORDS}'
    ]
};
var maker = (function(){
	var filePhoto, fileName, rotation = 0, curTplIndex = 0;
    var fileSize = {w: 0, h: 0};
    var displaySize = {w: 0, h: 0};
    var commitLocking = false;
	return {
		init: function(){
            $('#nickname').on('change', function(e){
                maker.filled() && maker.updateTemplate(true);
            });
            $('#words').on('change', function(e){
                maker.filled() && maker.updateTemplate(true);
            });

            setTimeout(function(){
                uploader.init(
                    function(file){
                        $('#pickfiles').addClass('disabled');
                        $('#container input').attr('disabled', 'disabled');
                    },
                    function(file){
                        maker.addPhoto(file);
                    }
                );
            }, 600);
		},
        lock: function(locking){
            commitLocking = locking;
        },
        filled: function(){
            return filePhoto != null;
        },
        setSize: function(iw, ih, w, h){
            fileSize = {w: iw, h: ih};
            displaySize = {w: w, h: h};
        },
        reset: function(){
            $('#pickfiles').removeClass('disabled');
            $('#container input').removeAttr('disabled');
            fileName = null;
            filePhoto = null;
            rotation = 0;
            $('#progress').css('width', '0%');
            $('.tool').hide();
            $('#photo').attr('src', 'img/7.jpg');
            $('#nickname').val('');
            $('#words').val('');
            this.updateTemplate(false);
        },
        rotate: function(){
            rotation += 90;
            while (rotation >= 360)
                rotation -= 360;
            this.updatePhoto();
        },
        commit: function(){
            if (!fileName)
                return;
            if (commitLocking){
                alert('提交中请稍候…');
                return;
            }
            var nickname = $('#nickname').val();
            if (nickname.length == 0){
                alert('还没有填写你的昵称哦~')
                return;
            }
            var words = $('#words').val();
            if (words.length == 0){
                alert('还没有填写你的态度哦~')
                return;
            }
            $.ajax({
                url: 'access.php',
                type: 'post',
                data: {
                    act: 'create',
                    words: words,
                    nickname: nickname,
                    imgurl: fileName,
                    width: fileSize.w,
                    height: fileSize.h,
                    tplindex: curTplIndex
                },
                dataType: 'json',
                error: function(e){
                    alert(e);
                    maker.lock(false);
                },
                success: function(resp){
                    if (!resp.success){
                        alert(resp.message);
                        maker.lock(false);
                    }
                    else{
                        window.location.href = 'post.html?id=' + resp.data + '&preview=1';
                    }
                }
            });
            commitLocking = true;
        },
        updateTemplate: function(show, add){
            if (!show){
                $('.plus').hide();
                return;
            }
            add && (curTplIndex += add);
            if (curTplIndex >= tpls.styles.length)
                curTplIndex = 0;
            if (curTplIndex < 0)
                curTplIndex = tpls.styles.length - 1;
            tpls.nickname = $('#nickname').val();
            tpls.words = $('#words').val();
            tpls.apply(curTplIndex);
        },
		addPhoto: function(file){
			var i = 0;
			filePhoto = file;
			var name = file.target_name;
			if (name.indexOf('.part') > 0){
				name = name.replace('.part', '');
			}
            name = name.toLowerCase();
			fileName = name;
			rotation = 0;
            $.ajax({
                url: configs.qiniuUrl + name + '?imageInfo',
                dataType: 'json',
                success: function(resp){
                    var w = resp.width, h = resp.height;
                    var sw = configs.porp.w, sh = configs.porp.h;
                    if (w < sw || h < sh){
                        var scale = 1;
                        if ((sw / sh) < (w / h))
                            scale = h / sh;
                        else
                            scale = w / sw;
                        sw = Math.floor(sw * scale);
                        sh = Math.floor(sh * scale);
                    }
                    maker.setSize(resp.width, resp.height, sw, sh);
                    maker.updatePhoto();
                    $('.tool').show();
                }
            });
            $('.tool').show();
            this.updateTemplate(true);
		},
        updatePhoto: function(){
            var url = configs.qiniuUrl + fileName;
            url += '?imageMogr2/auto-orient';
            url += '&imageView2/1/w/' + displaySize.w + '/h/' + displaySize.h + '/interlace/1';
            $('#photo').attr('src', url);
        }
	}
})();

$.ajax({url: 'access.php?act=login&section=1'});

$(function(){
    weixin.init(function(){
        var url = window.location.href;
        var np = url.lastIndexOf('/');
        var url = url.substr(0, np + 1) + 'index.html';
        weixin.fillShare($.extend({}, weixin.info, {
            type: 'link',
            link: url
        }));
    });
	maker.init();
});