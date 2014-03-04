Notes Of Upload Vulnerability
==============
Abstract:内容如题，主要是上传漏洞，大部分基于Apache和php，根据来自91ri或是freebuf网站上看到的文章以及一些其他的参考资料，然后自己总结的一份笔记，记录下来方便以后查看。
--------------

##0x00 裸奔无验证
首先我们从没有任何验证的简单文件上传表单开始，看看这个页面是如何写的，为了方便把这两部分写在一个文件中：
<pre>
	&lt;form action="upload1.php" method="post" enctype="multipart/form-data"&gt;
		Choose a file to upload:&lt;input type="file" name="uploadedfile"&gt;
		&lt;input type="submit" value="Upload file"&gt;
	&lt;/form&gt;

	&lt;?php
		$target_path="uploads/";
		if ($_FILES['uploadedfile']) {
			$target_path=$target_path.basename($_FILES['uploadedfile']['name']);
			if (move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) {
				echo "The file".basename($_FILES['uploadedfile']['name'])."has been uploaded";
			}
			else{
				echo "There was an error uploading the file,please try again!";
			}
		}
	?&gt;
</pre>
注：
[0]
$_FILES['uploadedfile']['name']在客户机上的文件的原始名称
$_FILES['uploadedfile']['type']文件的MIME类型
$_FILES['uploadedfile']['size']文件的大小（以字节为单位）
$_FILES['uploadedfile']['tmp_name']上传的文件存储在服务器上的临时文件名
[1]basename()函数返回路径中的文件名部分
[2]move_uploaded_file() 函数将上传的文件移动到新位置
[3]当PHP接收POST请求且编码类型是multipart/form-data，它会创建一个临时文件名随机的临时目录中（例如/var/tmp/php6yXOVs）

##0x01 Mime类型验证
MIME type的缩写为(Multipurpose Internet Mail Extensions)代表互联网媒体类型(Internet media type)，MIME使用一个简单的字符串组成，最初是为了标识邮件Email附件的类型，在html文件中可以使用content-type属性表示，描述了文件类型的互联网标准。
<pre>
类型/子类型                            扩展名
application/envoy	                    evy
application/fractals	                fif
application/futuresplash	        	spl
application/hta	hta
application/internet-property-stream	acx
application/mac-binhex40				hqx
application/msword						doc
application/msword						dot
application/octet-stream				*
application/octet-stream				bin
application/octet-stream				class
application/octet-stream				dms
application/octet-stream				exe
application/octet-stream				lha
application/octet-stream				lzh
application/oda							oda
application/olescript					axs
application/pdf							pdf
application/pics-rules					prf
application/pkcs10						p10
application/pkix-crl					crl
application/postscript					ai
application/postscript					eps
application/postscript					ps
application/rtf							rtf
application/set-payment-initiation		setpay
application/set-registration-initiation	setreg
application/vnd.ms-excel				xla
application/vnd.ms-excel				xlc
application/vnd.ms-excel				xlm
application/vnd.ms-excel				xls
application/vnd.ms-excel				xlt
application/vnd.ms-excel				xlw
application/vnd.ms-outlook				msg
application/vnd.ms-pkicertstore			sst
application/vnd.ms-pkiseccat			cat
application/vnd.ms-pkistl				stl
application/vnd.ms-powerpoint			pot
application/vnd.ms-powerpoint			pps
application/vnd.ms-powerpoint			ppt
application/vnd.ms-project				mpp
application/vnd.ms-works				wcm
application/vnd.ms-works				wdb
application/vnd.ms-works				wks
application/vnd.ms-works				wps
application/winhlp						hlp
application/x-bcpio						bcpio
application/x-cdf						cdf
application/x-compress					z
application/x-compressed				tgz
application/x-cpio						cpio
application/x-csh						csh
application/x-director					dcr
application/x-director					dir
application/x-director					dxr
application/x-dvi						dvi
application/x-gtar						gtar
application/x-gzip						gz
application/x-hdf						hdf
application/x-internet-signup			ins
application/x-internet-signup			isp
application/x-iphone					iii
application/x-javascript				js
application/x-latex						latex
application/x-msaccess					mdb
application/x-mscardfile				crd
application/x-msclip					clp
application/x-msdownload				dll
application/x-msmediaview				m13
application/x-msmediaview				m14
application/x-msmediaview				mvb
application/x-msmetafile				wmf
application/x-msmoney					mny
application/x-mspublisher				pub
application/x-msschedule				scd
application/x-msterminal				trm
application/x-mswrite					wri
application/x-netcdf					cdf
application/x-netcdf					nc
application/x-perfmon					pma
application/x-perfmon					pmc
application/x-perfmon					pml
application/x-perfmon					pmr
application/x-perfmon					pmw
application/x-pkcs12					p12
application/x-pkcs12					pfx
application/x-pkcs7-certificates		p7b
application/x-pkcs7-certificates		spc
application/x-pkcs7-certreqresp			p7r
application/x-pkcs7-mime				p7c
application/x-pkcs7-mime				p7m
application/x-pkcs7-signature			p7s
application/x-sh						sh
application/x-shar						shar
application/x-shockwave-flash			swf
application/x-stuffit					sit
application/x-sv4cpio					sv4cpio
application/x-sv4crc					sv4crc
application/x-tar						tar
application/x-tcl						tcl
application/x-tex						tex
application/x-texinfo					texi
application/x-texinfo					texinfo
application/x-troff						roff
application/x-troff						t
application/x-troff						tr
application/x-troff-man					man
application/x-troff-me					me
application/x-troff-ms					ms
application/x-ustar						ustar
application/x-wais-source				src
application/x-x509-ca-cert				cer
application/x-x509-ca-cert				crt
application/x-x509-ca-cert				der
application/ynd.ms-pkipko				pko
application/zip							zip
audio/basic								au
audio/basic								snd
audio/mid								mid
audio/mid								rmi
audio/mpeg								mp3
audio/x-aiff							aif
audio/x-aiff							aifc
audio/x-aiff							aiff
audio/x-mpegurl							m3u
audio/x-pn-realaudio					ra
audio/x-pn-realaudio					ram
audio/x-wav								wav
image/bmp								bmp
image/cis-cod							cod
image/gif								gif
image/ief								ief
image/jpeg								jpe
image/jpeg								jpeg
image/jpeg								jpg
image/pipeg								jfif
image/svg+xml							svg
image/tiff								tif
image/tiff								tiff
image/x-cmu-raster						ras
image/x-cmx								cmx
image/x-icon							ico
image/x-portable-anymap					pnm
image/x-portable-bitmap					pbm
image/x-portable-graymap				pgm
image/x-portable-pixmap					ppm
image/x-rgb								rgb
image/x-xbitmap							xbm
image/x-xpixmap							xpm
image/x-xwindowdump						xwd
message/rfc822							mht
message/rfc822							mhtml
message/rfc822							nws
text/css http://www.dreamdu.com			css
text/h323								323
text/html								htm
text/html								html
text/html								stm
text/iuls								uls
text/plain								bas
text/plain								c
text/plain								h
text/plain								txt
text/richtext							rtx
text/scriptlet							sct
text/tab-separated-values				tsv
text/webviewhtml						htt
text/x-component						htc
text/x-setext							etx
text/x-vcard							vcf
video/mpeg								mp2
video/mpeg								mpa
video/mpeg								mpe
video/mpeg								mpeg
video/mpeg								mpg
video/mpeg								mpv2
video/quicktime							mov
video/quicktime							qt
video/x-la-asf							lsf
video/x-la-asf							lsx
video/x-ms-asf							asf
video/x-ms-asf							asr
video/x-ms-asf							asx
video/x-msvideo							avi
video/x-sgi-movie						movie
x-world/x-vrml							flr
x-world/x-vrml							vrml
x-world/x-vrml							wrl
x-world/x-vrml							wrz
x-world/x-vrml							xaf
x-world/x-vrml							xof
</pre>
php中的$_FILES['uploadedfile']['type']返回的就是文件的MIME类型，然而可以轻松地使用脚本送一个假的mime类型的文件上传。
现在看一个案例：
<pre>
	&lt;?php
	$uploaddir = 'uploads/';
	if (isset($_POST['submit'])) {
	    if (file_exists($uploaddir)) {
	        if (($_FILES['upfile']['type'] == 'image/gif') || ($_FILES['upfile']['type'] == 'image/jpeg') ||
	            ($_FILES['upfile']['type'] == 'image/png') || ($_FILES['upfile']['type'] == 'image/bmp')
	        ) {
	            if (move_uploaded_file($_FILES['upfile']['tmp_name'], $uploaddir . '/' . $_FILES['upfile']['name'])) {
	                echo '文件上传成功，保存于：' . $uploaddir . $_FILES['upfile']['name'] . "\n";
	            }
	        } else {
	            echo '文件类型不正确，请重新上传！' . "\n";
	        }
	    } else {
	        exit($uploaddir . '文件夹不存在,请手工创建！');
	    }
	}
	?&gt;
	&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
	&lt;head&gt;
	    &lt;meta http-equiv="Content-Type" content="text/html;charset=utf-8"/&gt;
	    &lt;meta http-equiv="content-language" content="zh-CN"/&gt;
	&lt;body&gt;
	&lt;h3&gt;文件上传漏洞演示脚本--MIME验证实例&lt;/h3&gt;

	&lt;form action="" method="post" enctype="multipart/form-data" name="upload"&gt;
	    请选择要上传的文件：&lt;input type="file" name="upfile"/&gt;
	    &lt;input type="submit" name="submit" value="上传"/&gt;
	&lt;/form&gt;
	&lt;/body&gt;
	&lt;/html&gt;
</pre>
对于这种Mime验证，我们可以轻易的在客户端修改上传数据包中的Content-type即可。如下图，通过使用burpsuite工具修改：
![burpsuite](http://eular.github.io/article/1/1.png)
修改成images/gif，然后就能上传了。
![uploadsuccess](http://eular.github.io/article/1/2.png)

##0x02 目录验证
先看下列源码：
<pre>
	&lt;?php
	header("Content-Type:text/html;charset=utf-8");
	$uploaddir = $_POST['path'];
	if (isset($_POST['submit']) && isset($uploaddir)) {
	    if (!file_exists($uploaddir)) {
	        mkdir($uploaddir);
	    }
	    if (move_uploaded_file($_FILES['upfile']['tmp_name'], $uploaddir . '/' . $_FILES['upfile']['name'])) {
	        echo '文件上传成功，保存于：' . $uploaddir . '/' . $_FILES['upfile']['name'] . "\n";
	    }
	}
	?&gt;
	&lt;html xmlns="http://www.w3.org/1999/xhtml"&gt;
	&lt;head&gt;
	    &lt;meta http-equiv="Content-Type" content="text/html;charset=utf-8"/&gt;
	    &lt;meta http-equiv="content-language" content="zh-CN"/&gt;
	&lt;body&gt;
	&lt;h3&gt;文件上传漏洞演示脚本--目录验证实例&lt;/h3&gt;

	&lt;form action="" method="post" enctype="multipart/form-data" name="upload"&gt;
	    &lt;input type="hidden" name="path" value="uploads"/&gt;
	    请选择要上传的文件：&lt;input type="file" name="upfile"/&gt;
	    &lt;input type="submit" name="submit" value="上传"/&gt;
	&lt;/form&gt;
	&lt;/body&gt;
	&lt;/html&gt;
</pre>
会发现，上传文件保存路径是客户端提交上去的，这样我们就很好绕过了。用chrome修改path的value：
![path](http://eular.github.io/article/1/3.png)
我这里报错了，是因为没有权限写目录。。
![error](http://eular.github.io/article/1/4.png)
当然uploads/目录下还是可以写的：
![mkdir](http://eular.github.io/article/1/5.png)

##0x03 扩展验证
.htaccess文件(或者"分布式配置文件"）提供了针对目录改变配置的方法，即，在一个特定的文档目录中放置一个包含一个或多个指令的文件，以作用于此目录及其所有子目录。.htaccess文件是Apache服务器中的一个配置文件，它负责相关目录下的网页配置。通过htaccess文件，可以帮我们实现：网页301重定向、自定义404错误页面、改变文件扩展名、允许/阻止特定的用户或者目录的访问、禁止目录列表、配置默认文档等功能。
启用.htaccess，需要修改httpd.conf，启用AllowOverride（将AllowOverride None改为AllowOverride All并去掉LoadModule rewrite_module modules/mod_rewrite.so的注释）。
自定义错误页面：
<pre>
	ErrorDocument 404 /error-pages/not-found.html
	ErrorDocument 503 /error-pages/service-unavailable.html
</pre>
IP禁止:
<pre>
	Order allow,deny
	Deny from 123.45.67.8
	Deny from 123.123.7
	Allow from all
</pre>
变更默认首页:
<pre>
	DirectoryIndex homepage.html
</pre>
页面跳转:
<pre>
	Redirect page1.html page2.html
</pre>
禁止.htaccess文件被查看:
<pre>
	&lt;Files .htaccess&gt;
	order allow,deny
	deny from all
	&lt;/Files&gt;
</pre>
设置文件类型
<pre>
	AddType application/x-httpd-php .jpg
</pre>

##0x04 双扩展名
双扩展名实则文件名解析漏洞。
Apache处理具有多重扩展名的文件是从右到左，因此一个名为‘filename.php.xxx’的文件将会被解释为一个PHP文件并被执行。这仅限于最后的那个扩展名(本例中是.xxx)没有在web服务器的mime-types列表中被指定。
诸如其他nginx文件名解析,比如help.asp;.jpg或http://www.xx.com/help.jpg/2.php。还有0×00截断绕过等等。

##0x05 图片头部验证
开发者通常使用PHP的getimagesize函数来检测图片的头部信息，该函数在被调用时将会返回图片的尺寸, 如果图片经验证为无效的，也就是说图片头部信息不正确, 则会返回false值。然而，即使这种方式也能被很容易的绕过。如果一个图片在一个图片编辑器内打开，就如 Gimp，用户就可以编辑图片的注释区，那儿就能插入PHP代码。

##0x06 客户端验证
对于客户端，我们可以利用html5的FileReader来对上传的文件进行初步的验证。
 <pre>
	&lt;input type="file" id="fileinput" /&gt;
	&lt;script type="text/javascript"&gt;
	function readSingleFile(evt) {
	  var f = evt.target.files[0];

	  if(!f){
	    alert("Failed to load file");
	  }
	  else if(!f.type.match('image.*')){
	    alert(f.name+" is not a valid image file.");
	  }
	  else{
	    var r = new FileReader();
	    r.onload=function(e){
	      var contents = e.target.result;
	      alert( "Got the file.\n"
	        +"name: " + f.name + "\n"
	        +"type: " + f.type + "\n"
	        +"size: " + f.size + " bytes\n"
	        + "starts with: " + contents.substr(0, contents.indexOf("&gt;"))
	      );
	    }
	    r.readAsText(f);
	  }
	}

	document.getElementById('fileinput').addEventListener('change', readSingleFile, false);
	&lt;/script&gt;
</pre>
![0.png](http://eular.github.io/article/1/0.png)
由于这种文件验证是在客户端完成的，恶意用户很容易就能绕过这一检查。
来看第二个例子：
<pre>
	&lt;?php
	$uploaddir = 'uploads/';
	if (isset($_POST['submit'])) {
	    if (file_exists($uploaddir)) {
	        if (move_uploaded_file($_FILES['upfile']['tmp_name'], $uploaddir . '/' . $_FILES['upfile']['name'])){
	            echo '文件上传成功，保存于：' . $uploaddir . $_FILES['upfile']['name'] . "\n";
	        }
	    } else {
	        exit($uploaddir . '文件夹不存在,请手工创建！');
	    }
	}
	?&gt;

	&lt;html&gt;
	&lt;head&gt;
	    &lt;meta http-equiv="Content-Type" content="text/html;charset=utf-8"/&gt;
	    &lt;meta http-equiv="content-language" content="zh-CN"/&gt;
	    &lt;script type="text/javascript"&gt;
	        function checkFile() {
	            var file = document.getElementsByName('upfile')[0].value;
	            if (file == null || file == "") {
	                alert("你还没有选择任何文件，不能上传!");
	                return false;
	            }
	            //定义允许上传的文件类型
	            var allow_ext = ".jpg|.jpeg|.png|.gif|.bmp|";
	            //提取上传文件的类型
	            var ext_name = file.substring(file.lastIndexOf("."));
	            //判断上传文件类型是否允许上传
	            if (allow_ext.indexOf(ext_name + "|") == -1) {
	                var errMsg = "该文件不允许上传，请上传" + allow_ext + "类型的文件,当前文件类型为：" + ext_name;
	                alert(errMsg);
	                return false;
	            }
	        }
	    &lt;/script&gt;
	&lt;body&gt;
	&lt;h3&gt;文件上传漏洞演示脚本--JS验证实例&lt;/h3&gt;

	&lt;form action="" method="post" enctype="multipart/form-data" name="upload" onsubmit="return checkFile()"&gt;
	    &lt;input type="hidden" name="MAX_FILE_SIZE" value="204800"/&gt;
	    请选择要上传的文件：&lt;input type="file" name="upfile"/&gt;
	    &lt;input type="submit" name="submit" value="上传"/&gt;
	&lt;/form&gt;
	&lt;/body&gt;
	&lt;/html&gt;
</pre>
我们可以直接删除代码中onsubmit事件中关于文件上传时验证上传文件的相关代码，或是直接更改文件上传JS代码中允许上传的文件扩展名你想要上传的文件扩展名都行。

##0x07 总结
后台开发人员要对上传的文件进行严格的判断和限制，提高安全意识，不要相信用户的输入。

<hr>
Author:Eular
Date:2014.2.27
<hr>
