
//半角->全角
var BDC_STR = {	
				',':'，',
				';':'；',
				':':'：',
				'?':'？',


				'[':'【',
				']':'】',
				'<':'《',
				'>':'》',

				'!':'！'
			};

function ToDBC(html) {
	for (var k in BDC_STR) {
		var regExp = new RegExp("\\"+k, 'g');
		html = html.replace(regExp, BDC_STR[k]);
	}
/*
	if (html.indexOf('"')>-1) {
		var _html = html.split('"');
		html = '';
		var len = _html.length;
		for(var k in _html) {
			html += _html[k];
			if (k < len-1)
				html +=  ( k %2 == 0) ? '“' : '”';
		}
	}

	if (html.indexOf("'")>-1) {
		var _html = html.split("'");
		html = '';
		var len = _html.length;
		for(var k in _html) {
			html += _html[k];
			if (k < len-1)
				html +=  ( k %2 == 0) ? '‘' : '’';
		}
	}
*/
	return html;
}

KindEditor.plugin('tobdc', function(K) {
	var self = this, name = 'tobdc';
    self.clickToolbar(name, function() {
        self.focus();
        var doc = self.edit.doc;
        if (self.selectedHtml()) {
	        this.cmd.range.startOffset = 0;
	        this.cmd.range.endOffset = this.cmd.range.endContainer.length;
	        
			self.cmd.range.enlarge();
			var bookmark = self.cmd.range.createBookmark(), 
				ancestor = self.cmd.range.commonAncestor(),
				isStart = false;
	        if (ancestor.nodeName == '#text') {
	        	ancestor.nodeValue = ToDBC(ancestor.nodeValue);
	        } else {
				K(ancestor).scan(function(node) {
					if (!isStart && node == bookmark.start) {
						isStart = true;
						return;
					}
					if (isStart) {
						if (node == bookmark.end) {
							return false;
						}
				        if (node.nodeName =='#text') {
				          	node.nodeValue = ToDBC(node.nodeValue);
				        }
				    }
				});

				self.cmd.range.moveToBookmark(bookmark);
			}
        } else {
        	K(doc.body).scan(function(node){
	            if (node.nodeName =='#text') {
	               	node.nodeValue = ToDBC(node.nodeValue);
	            }
	        })
	    }
    });
});