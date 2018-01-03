var configs = {
	qiniuUrl: 'http://7xj4xe.com1.z0.glb.clouddn.com/',
    porp: {w: 480, h: 658},
};
var maker = (function(){
	var filePhoto, fileName, rotation = 0, curTplIndex = 0;
    var fileSize = {w: 0, h: 0};
    var displaySize = {w: 0, h: 0};
    var commitLocking = false;
	return {
		init: function(){
            $('.inputln input').on('change', function(e){
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
            this.stats('upload-visits');
		},
        stats: function(key){
            $.ajax({
                url: '/lib/stats.php',
                data: {key: 'burtonkids-' + key, addval: 1},
                dataType: 'json'
            });
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
            $('#age').val('');
            $('#city').val('');
            this.updateTemplate(false);
            this.stats('upload-clickReset');
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
            var age = $('#age').val();
            if (age){
                age = age.replace(/岁/g, '');
            }
            if (age.length == 0){
                alert('还没有填写你的年龄哦~')
                return;
            }
            age = Number(age);
            if (isNaN(age) || age <= 0 || Math.floor(age) != age){
                alert('填写的年龄不是正整数数字，请重新填写。')
                return;
            }
            var city = $('#city').val();
            if (city.length == 0){
                alert('还没有填写你的所在城市哦~')
                return;
            }
            maker.stats('upload-clickUpload');
            
            $.ajax({
                url: 'access.php',
                type: 'post',
                data: {
                    act: 'create',
                    nickname: nickname,
                    age: age,
                    city: city,
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
                        maker.stats('upload-uploadSuccess');
                        setTimeout(function(){
                            window.location.href = 'post.html?id=' + resp.data + '&preview=1';
                        }, 500);
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
            tpls.age = $('#age').val();
            tpls.city = $('#city').val();
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