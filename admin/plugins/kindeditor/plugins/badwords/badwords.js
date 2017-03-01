KindEditor.plugin('badwords', function(K) {
	var self = this, name = 'badwords',flag=0;
	var timestamp=new Date().getTime();

    self.clickToolbar(name, function() {

		K.loadScript('http://www.trjcn.com/upfile/badwords.js?timestamp='+timestamp,function(){
			if ( ! BADWORDS) return;
	    	var html = self.html();
	    	if (flag) {
	    		flag = 0;

				self.toolbar.disableAll(false,['test']);
				self.toolbar.unselect(name);
	    		var i = 0;

		    	html = html.replace(/\<span style="color:#ff0000;"\>\<span style="background-color:#FFFF00;"\>\<b\>([\u4e00-\u9fa5|a-z|A-Z|0-9]+)\<\/b\>\<\/span\>\<\/span\>/g,"$1");
	    		while(i++<1000) {
	    			if (html.indexOf('<span class="BADWORD" style="color:red;font-weight:bold;background:yellow;">')==-1)break;
		    		html = html.replace(/\<span class="BADWORD" style="color:red;font-weight:bold;background:yellow;"\>([\u4e00-\u9fa5|a-z|A-Z|0-9]+)\<\/span\>/g,"$1");
		    	}
		    	html = html.replace(/\[\-\*\-\]/g,'');
	    	} else {
				self.toolbar.disableAll(true,[name]);
				self.toolbar.select(name);
	    		flag = 1;

				html  = html.replace(/alt="([\s\S]*?)"/ig, function(a){
				 	for (var k in BADWORDS) {
						var regExp = new RegExp(BADWORDS[k], 'g');
				        a = a.replace(regExp, (BADWORDS[k].split('')).join('[-*-]'));
				 	}
				 	return a;
				});
				html  = html.replace(/title="([\s\S]*?)"/ig, function(a){
				 	for (var k in BADWORDS) {
						var regExp = new RegExp(BADWORDS[k], 'g');
				        a = a.replace(regExp, (BADWORDS[k].split('')).join('[-*-]'));
				 	}
				 	return a;
				});


	    		for (var k in BADWORDS) {
					var regExp = new RegExp(BADWORDS[k], 'g');
			        html = html.replace(regExp, '<span class="BADWORD" style="color:red;font-weight:bold;background:yellow;">'+BADWORDS[k]+'</span>');
				}

	    	}
			self.html(html);
		});

    	
    });
});