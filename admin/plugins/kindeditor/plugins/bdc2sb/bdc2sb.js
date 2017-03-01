
//全角=>半角
var BDC2SB_STR = {	
				'，':',',
				'；':';',
				'：':':',
				'？':'?',
				'！':'!',

				'【':'[',
				'】':']',
				'《':'<',
				'》':'>',

				// '“':'"',
				// '”':'"',
				// '‘':"'",
				// '’':"'"
			};

function BDC2SB(html) {
	for (var k in BDC2SB_STR) {
		var regExp = new RegExp(k, 'g');
		html = html.replace(regExp, BDC2SB_STR[k]);
	}
	return html;
}
KindEditor.plugin('bdc2sb', function(K) {
	var self = this, name = 'bdc2sb';
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
	        	ancestor.nodeValue = BDC2SB(ancestor.nodeValue);
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
				          	node.nodeValue = BDC2SB(node.nodeValue);
				        }
				    }
				});

				self.cmd.range.moveToBookmark(bookmark);
			}			

        } else {
        	K(doc.body).scan(function(node){
	            if (node.nodeName =='#text') {
	               	node.nodeValue = BDC2SB(node.nodeValue);
	            }
	        })
        }
    });
});