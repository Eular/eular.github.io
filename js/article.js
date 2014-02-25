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

function foo(str){
	var json=JSON.parse(str);
	for (var i = json.article.length - 1; i >= 0; i--) {
		var art=json.article[i];
		addArticle(i,art.title,art.abstract,art.img,art.date);
	};
	var a=document.querySelectorAll('#work a');
	for (var i = 0; i < a.length; i++) {
		a[i].addEventListener('click',function(){
			var k=this.href.split('#')[1];
			ajax('http://eular.github.io/article/'+k+'/README.md',showMarkdown);
		});
	};
}

function showMarkdown(md){
	var html = Markdown2Html(md);
	var work=document.querySelector('#work');
	work.innerHTML='<div id="blog">'+html+'</div><div id="disqus_thread"></div>';
	disqus();
}

function disqus(){
	var disqus_shortname = 'eularblog';
    (function() {
        var dsq = document.createElement('script');
        dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
}

function Markdown2Html(md){
	md=md.replace(/(.+)\n=+/g,'<h1>$1</h1><hr>');
	md=md.replace(/(.+)\n-+/g,'<h2>$1</h2><hr>');
	md=md.replace(/###(.+)/g,'<h5>$1</h5>');
	md=md.replace(/##(.+)/g,'<h3>$1</h3>');
	md=md.replace(/\n[^!]\[([^\]]+)\]\(([^)]+)\)\n/g,'<p><a href="$2">$1</a></p>');
	md=md.replace(/[^!]\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
	md=md.replace(/\n!\[(.+)\]\((.+)\)\n/g,'<div><img src="$2" alt="$1"></div>');
	md=md.replace(/!\[(.+)\]\((.+)\)/g,'<img src="$2" alt="$1">');
	md=md.replace(/([^<>].+[^<>])\n/g,'<p>$1</p>');
	return md;
}

function addArticle(j,title,abstract,imgsrc,date){
	var imghref='#'+j;

	var work=document.querySelector('#work');
	var header='<a href="#'+j+'"><header><h2>'+title+'</h2></header></a>';
	var p='<p>'+abstract+'......<br>'+date+'</p>';
	var section='';

	if (imgsrc) {
		var photo='';
		for (var i = 0; i < imgsrc.length; i++) {
			photo+='<div class="4u"><a href="'+imghref+'" class="image image-full"><img src="'+imgsrc[i]+'" alt=""></a></div>';
		};
		section='<section class="5grid is-gallery"><div class="row">'+photo+'</div></section>';//max:3 photos
	}

	work.innerHTML+=header+p+section+'<hr>';
}

window.addEventListener('load',function(){
	ajax('http://eular.github.io/article/article.json',foo);
});