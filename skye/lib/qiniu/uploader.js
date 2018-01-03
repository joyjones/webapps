var uploader = (function(){
    var mCore = null;
    return {
        init: function(callbkBegin, callbkFinish){
            mCore = Qiniu.uploader({
                runtimes: 'html5,flash,html4',
                browse_button: 'pickfiles',
                container: 'container',
                drop_element: 'container',
                max_file_size: '25mb',
                flash_swf_url: 'js/plupload/Moxie.swf',
                dragdrop: false,
                chunk_size: '4mb',
                uptoken_url: '/lib/qiniu/gettoken.php',
                domain: 'http://skye.qiniudn.com',
                // downtoken_url: '/downtoken',
                unique_names: true,
                // save_key: true,
                // x_vars: {
                //     'id': '1234',
                //     'time': function(up, file) {
                //         var time = (new Date()).getTime();
                //         // do something with 'time'
                //         return time;
                //     },
                // },
                auto_start: true,
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            $('#progress').css('width', '0%');
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        if (up.runtime === 'html5' && chunk_size) {
                            // progress.setChunkProgess(chunk_size);
                        }
                        callbkBegin && callbkBegin(file);
                    },
                    'UploadProgress': function(up, file) {
                        var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                        // progress.setProgress(file.percent + "%", up.total.bytesPerSec, chunk_size);
                        $('#progress').css('width', file.percent + "%");
                    },
                    'UploadComplete': function() {
                        $('#progress').css('width', "100%");
                    },
                    'FileUploaded': function(up, file, info) {
                        $('#progress').css('width', "100%");
                        callbkFinish && callbkFinish(file);
                    },
                    'Error': function(up, err, errTip) {
                        alert(errTip);
                    }
                    // ,
                    // 'Key': function(up, file) {
                    //     var key = "";
                    //     // do something with key
                    //     return key
                    // }
                }
            });

            // mCore.bind('FileUploaded', function() {
            //     console.log('hello man,a file is uploaded');
            // });
        }
    }
})();