Build A Static Blog On Github
=============================
Abstract:由于Github Page支持的是静态页面，要想搭建一个类似Wordpress的个人Blog是有些困难的，现在比较流行的是利用Jekyll来搭建，Jekyll是一个静态站点生成器，它会根据网页源码生成静态文件。它提供了模板、变量、插件等功能，所以实际上可以用来编写整个网站。本Blog没有用Jekyll，而是通过自己写的，用到Ajax的一个静态Blog。而留言板块涉及到后台以及数据库，所以这里用的是著名的Disqus
------------------------------------------------------

##0x00
在Github上搭建自己的Bolg，首先新建一个名为username.github.io的项目。往里面写一个简单的index.html，过大约十分钟后，你就可以访问username.github.io然后看到你刚才写的html。这之后你对该项目文件的更新或更改会及时更改到网上，通过刷新可以马上看的。
除此之外，你还可以绑定其他域名诸如此类这里不细说。到此我们搭建的只是一个简单的静态网站，明显不能满足Blog的需求。

##0x01
对于一个静态Blog来说，如果为每篇Blog写一个html文件，其用户体验绝对是糟糕的。对于专注于写技术类的程序猿来说，[Markdown](http://daringfireball.net/projects/markdown/syntax)以其简单结构化的语法，深得大众的喜爱。鉴于Markdown的大行其道，实为每一个博主的必备。
本Blog采用Markdown的精简版（原因是自己平常也就用到这几种，对于写博客足够了），仅支持一下语法：
![markdown](http://eular.github.io/article/0/0.png)
为此写一个简单的转换：
<pre>
	function Markdown2Html(md){
		var pre=md.match(/&lt;pre&gt;[^&lt;]+&lt;\/pre&gt;/g);
		for (var i = 0; i &lt; pre.length; i++) {
			md=md.replace(pre[i],'&lt;pre&gt;'+i+'&lt;/pre&gt;');
		};
		md=md.replace(/(.+)\n=+/g,'&lt;h1&gt;$1&lt;/h1&gt;&lt;hr&gt;');
		md=md.replace(/(.+)\n-+/g,'&lt;h3&gt;$1&lt;/h3&gt;&lt;hr&gt;');
		md=md.replace(/\n###(.+)/g,'&lt;h5&gt;$1&lt;/h5&gt;');
		md=md.replace(/\n##(.+)/g,'&lt;br&gt;&lt;h3&gt;$1&lt;/h3&gt;');
		md=md.replace(/\n[^!]\[([^\]]+)\]\(([^)]+)\)\n/g,'&lt;p&gt;&lt;a href="$2"&gt;$1&lt;/a&gt;&lt;/p&gt;');
		md=md.replace(/[^!]\[([^\]]+)\]\(([^)]+)\)/g,'&lt;a href="$2"&gt;$1&lt;/a&gt;');
		md=md.replace(/\n!\[(.+)\]\((.+)\)\n/g,'&lt;div&gt;&lt;img src="$2" alt="$1"&gt;&lt;/div&gt;');
		md=md.replace(/!\[(.+)\]\((.+)\)/g,'&lt;img src="$2" alt="$1"&gt;');
		md=md.replace(/([^&lt;&gt;].+[^&lt;&gt;])\n/g,'&lt;p&gt;$1&lt;/p&gt;');
		md=md.replace(/&lt;hr&gt;\n+&lt;br&gt;/g,'&lt;hr&gt;');
		for (var i = 0; i &lt; pre.length; i++) {
			md=md.replace('&lt;pre&gt;'+i+'&lt;/pre&gt;',pre[i]);
		};
		return md;
	}
</pre>

##0x02
读取文件的实现。一般来说通过js读取本地文件是不能的，当然html5中的FileReader()对象可以，但考虑到安全性，前提是必须要用户通过&lt;input type="file"&gt;控件上传。因此我们只能通过Ajax来实现读取同源的文件，跨域是肯定不行啦。
<pre>
	function ajax(url,foo){
		var xmlhttp=new XMLHttpRequest();
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				foo(xmlhttp.responseText);
			};
		};
		xmlhttp.open('GET',url,true);
		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.send(null);
	}
</pre>
回调函数对返回内容进行处理。

##0x03
现在来看一看本Blog的小框架。
![frame](http://eular.github.io/article/0/1.png)
仅有一个index.html文件，而文章则在article文件夹中，该文件夹下有一个article.json文件，是用来记录一些基本信息。每篇文章都在一个以数字命名的文件夹中，里面有一个README.md文件，以及一些其他的图片之类的。每次访问时，都会去读取article.json这个文件，在主页上呈现每篇文章的标题摘要，当点击其中某篇标题时则会读取具体内容。主目录下有一个update.py，作用很简单，就是每次通过python脚本来更新article.json的内容并push到github上去。

##0x04
至于disqus就没什么好说的了，注册一个号，按步骤来，在你想要的地方插入提供的代码即可。
目前主要功能基本实现，还有许多地方待改。
![index](http://eular.github.io/article/0/2.png)

<hr>
Author:Eular
Date:2014.2.25
<hr>