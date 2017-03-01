
KindEditor.plugin('nobr', function(K) {
	var self = this, name = 'nobr',
		brns = K.toMap('div,p,br');

	function trim(s) {
		return s.replace(/(\s|(&nbsp;))/g,'');
	}
	self.clickToolbar(name, function() {
		self.focus();
		var doc = self.edit.doc;

		function isBr(node) {
			if (!node)return false;
			if (node.name == '#text' && trim(node.text()) == '' && isBr(node.prev()) && isBr(node.next())) {
				return true;
			}
        	if (node.name == 'br') {
    			return true;
    		} else if (brns[node.name]) {
				if ( trim(node.html()) == '<br/>'){
					return true;
				}
    		}
    		return false;
		}

		K(doc.body).scan(function(node){
			if ( ! node) return;
        	var _node = K(node);
        	if (isBr(_node)) {
        		node.remove(true);
        	}
        })

	});
});