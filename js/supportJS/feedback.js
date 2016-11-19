var companyId = $("#companyId").html();
var userId = $("#userId").html();

var feedback = angular.module('feedback', []);
feedback.controller('feedbackCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.companyId = companyId;
	$scope.userId = userId;
//	$scope.imageArr = [
//"http://labscare-01.oss-cn-shenzhen.aliyuncs.com/4063b8fb21f028a59a5383a5f456c85d/case/384cb3ddc49a59ca33f46839893ed8f6.png",
//"http://labscare-01.oss-cn-shenzhen.aliyuncs.com/4063b8fb21f028a59a5383a5f456c85d/case/77fbd2f8cfd7da5a1f84abf5de61315f.png"];
	
	$scope.imageArr = [];
	
	//准备OSS直传
	var uploader = new plupload.Uploader({
		runtimes: 'html5,flash,silverlight,html4',
		browse_button: 'selectfiles',
		//multi_selection: false,
		container: document.getElementById('addBtn'),
		flash_swf_url: 'lib/plupload-2.1.2/js/Moxie.swf',
		silverlight_xap_url: 'lib/plupload-2.1.2/js/Moxie.xap',
		url: 'http://oss.aliyuncs.com',

		filters: {
			mime_types: [ //只允许上传图片和zip,rar文件
				{
					title: "Image files",
					extensions: "jpg,gif,png,bmp"
				}, {
					title: "Zip files",
					extensions: "zip,rar"
				}
			],
			max_file_size: '10mb', //最大只能上传10mb的文件
			prevent_duplicates: true //不允许选取重复文件
		},

		init: {
			//图片选择器启动
			PostInit: function() {
			},

			//图片选中
			FilesAdded: function(up, files) {
				plupload.each(files, function(file) {
					set_upload_param(uploader, '', false);
				});
			},

			BeforeUpload: function(up, file) {
				set_upload_param(up, file.name, true);
			},
			//进度条
			UploadProgress: function(up, file) {
				
			},
			
			//文件上传成功回调
			FileUploaded: function(up, file, info) {
				if(info.status == 200) {
					console.log("上传成功 name: "+ get_uploaded_object_name());
					var imgUrl = host +'/'+ get_uploaded_object_name();
					$scope.imageArr.push(imgUrl);
					if($scope.imageArr.length>=4){
//						var addBtn = document.getElementById('addBtn');
//						addBtn.toggle();
						$('#addBtn').toggle();
					}
					console.log($scope.imageArr);
					$scope.$digest();
					
				} else {
					console.log("上传成失败:"+info.respons);	
				}
			},

			Error: function(up, err) {
				if(err.code == -600) {
					console.log("选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小");
					alert("选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小");
//					document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
				} else if(err.code == -601) {
					console.log("选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型");
//					document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
				} else if(err.code == -602) {
					console.log("这个文件已经上传过一遍了");
//					document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
				} else {
					console.log("Error xml:" + err.response);
//					document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
				}
			}
		}
	});
	uploader.init();

}]);

//以下是阿里云OSS文件上传，未看明白前请不要做修改
accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
expire = 0
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000; 

function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        serverUrl = 'http://120.25.177.94:8080/lab/appOssToken/postObjectPolicy'
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
    var tt = document.getElementsByName('myradio');
    for (var i = 0; i < tt.length ; i++ )
    {
        if(tt[i].checked)
        {
            g_object_name_type = tt[i].value;
            break;
        }
    }
};

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    if (expire < now + 3)
    {
        body = send_request()
        var obj = eval ("(" + body + ")");
        console.log(obj);
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callback'] 
        key = obj['dir']
        return true;
    }
    return false;
};

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
};

//获取后缀
function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
};

function calculate_object_name(filename){
     suffix = get_suffix(filename)
     //拼接名字
     var timestamp=new Date().getTime();
     g_object_name = key + companyId +'/'+ userId +'/'+ timestamp +'_'+ random_string(10) + suffix
};

function get_uploaded_object_name(){
     return g_object_name;
};

function set_upload_param(up, filename, ret)
{
    if (ret == false)
    {
        ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
};

//阿里云上传结束



