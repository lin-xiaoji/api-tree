 var tree = {};

 //整个树的偏移位置
 tree.transformX = 300;
 tree.transformY = 6000;

 tree.baseData = null;
 tree.currentNode = null;
 tree.currentPropertyIndex = null;

 tree.init = function (baseData) {
     tree.baseData = baseData;
     tree.currentNode = baseData;

     window.onkeyup = function(e) {
         //添加子节点 +号
         if(e.keyCode == 189 ) {
             var newObject = {
                 name:'new-element',
                 property:[],
                 key:'key-' + Math.random()
             };
             if(tree.currentNode.parent && e.shiftKey == false) {
                 var index = 0;
                 for(var i=0; i<tree.currentNode.parent.sub.length; i++ ) {
                     if(tree.currentNode.parent.sub[i] == tree.currentNode) {
                         index = i + 1;
                     }
                 }
                 tree.currentNode.parent.sub.splice(index,0,newObject);
             }else {
                 if(!tree.currentNode.sub) {
                     tree.currentNode.sub = [];
                 }
                 tree.currentNode.sub.push(newObject);
             }
             tree.currentNode = newObject;

             tree.render(tree.baseData);
         }

         //删除节点 - 号
         if(e.keyCode == 189) {
             var arr = tree.currentNode.parent.sub;
             for(var i=0; i < arr.length; i++) {
                 if(arr[i] == tree.currentNode) {
                     arr.splice(i,1);
                 }
             }
             tree.render(tree.baseData);
         }

         //删除属性
         if(e.keyCode == 46) {
             tree.currentNode.property.splice(tree.currentPropertyIndex,1);
             tree.render(tree.baseData);
         }

     };

     //高度自适应
     $(window).on('resize', function() {
         $("#root").height($(this).height());
     }).resize();


     //拖拽
     var root =document.getElementById('tree');
     var overlay =document.getElementById('overlayDiv');
     overlay.onmousedown = root.onmousedown = function(e) {
         if(e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA') {
             return ;
         }
         var treeX = e.clientX - root.getBoundingClientRect().left;
         var treeY = e.clientY - root.getBoundingClientRect().top;
         var overlayX = e.clientX - overlay.getBoundingClientRect().left;
         var overlayY = e.clientY - overlay.getBoundingClientRect().top;

         document.onmousemove = function(e) {
             var treeLeft = e.clientX - treeX;
             var treeTop = e.clientY - treeY;
             var overlayLeft = e.clientX - overlayX;
             var overlayTop = e.clientY - overlayY;


             root.style.left = treeLeft + 'px';
             root.style.top = treeTop + 'px';
             overlay.style.left = overlayLeft + 'px';
             overlay.style.top = overlayTop + 'px';

         };
         document.onmouseup = function(e) {
             this.onmousemove = null;
             this.onmouseup = null;
         };
     };

     //计算整个树的初始显示位置
     var treeTop = (12000 - $(window).height())/2;
     $("#tree").css('top',- treeTop);

 };



 tree.findNodeByKey = function (key){
     var tmpNode;
     function selected (node) {
         if(node.sub) {
             for(var i=0; i<node.sub.length; i++ ) {
                 selected(node.sub[i]);
             }
         }
         if(node.key == key) {
             tmpNode = node;
         }
     }
     selected(tree.baseData);
     return tmpNode;
 };






 //添加监听事件
 tree.addListener = function () {


     //选择节点
     $(".node").unbind('click').click(function(){
         var key = $(this).attr("key");
         if(tree.currentKey == key) {
             return false;
         }
         tree.currentKey = key;
         $(".node").css("border",'solid 1px rgb(41, 189, 139)');
         $(this).css("border",'solid 2px rgb(41, 189, 139)');
         tree.currentNode = tree.findNodeByKey(key);
     });
    //显示属性列表
     $(".node img").unbind('click').click(function() {
         //$(".property").hide();
         $(".property[key='"+$(this).parent().attr('key')+"']").toggle(function(){
             if ($(this).is(':hidden')) {
                 tree.currentNode.propertyShow = false;
             } else {
                 tree.currentNode.propertyShow = true;

             }
         });
     });

     //编辑节点
     $(".node").unbind('dblclick').dblclick(function(){
         var text = $(this).text();
         layer.open({
             area: ['500px', '300px']
             ,title: false
			 ,btn:false
             ,shade: 0.6 //遮罩透明度
             ,content: '<div style="padding:50px;"><input id="text-val" value="'+ text +'"> <button id="edit-node">保存</button></div>'
         });
         $("#edit-node").click(function() {
             tree.currentNode.name = $("#text-val").val();
             tree.render(tree.baseData);
             layer.closeAll();
         });
     }).bind('selectstart', function(){ return false; });



     //选择属性
     $(".property ul li").unbind('click').click(function() {
         var key = $(this).parent().parent().attr('key');
         tree.currentNode = tree.findNodeByKey(key);

         //添加属性
         if($(this).data('tag') == 'add') {
             tree.currentNode.property.push({name:'',content:''});
         }


         tree.currentPropertyIndex = $(this).index();
         var property = tree.currentNode.property[tree.currentPropertyIndex];

         $("#property-name").html(property.name);
		 $("#property-name-input").val(property.name);
		 $("#property-textarea textarea").val(property.content);
		 
         var converter = new showdown.Converter();
         var html = converter.makeHtml(property.content);
         $("#property-desc").html(html);
         

         $(".property ul li").removeClass('active');
         $(this).addClass('active');

         //添加属性
         if($(this).data('tag') == 'add') {
             $("#property-edit").click();
         }
		 
		 //定位弹窗位置
		 var top = $(this).offset().top;
		 var height = 500;
		 var winHeight = $(window).height();
		 var contentTop = top - 100;
		 if(contentTop < 0) {
			 contentTop = 0;
		 }
		 if(contentTop > winHeight-height) {
			 contentTop = winHeight-height - 10;
		 }
		 var left = $(this).offset().left;
		 contentLeft = left + 40 + $(this).width();


		 $("#overlayDivArrow").animate({'top':top-contentTop + 15});
		 $("#overlayDiv").animate({'left':contentLeft,'top':contentTop});
         $("#overlayDiv").show();
     });
     $("#overlayDivCloseBtn").click(function () {
         $("#overlayDiv").hide();
     });




     //防止文本选中
     $(".property").bind('selectstart', function(){ return false; });

 };









 //渲染
 tree.render = function () {
     var level = 0;
     var levelArr = {};


     //计算每个节点的高度
     function getNodeHeight(node,parentNode) {
         var height = 100;
         if(node.sub) {
             level ++;
             for(var i=0; i<node.sub.length; i++ ) {
                 var thisNodeHeight = getNodeHeight(node.sub[i],node);
                 height = height + thisNodeHeight;
             }
             level --;
             height = height - 100;
         }
         node.parent = parentNode;
         node.level = level;
         node.height = height;


         //生成二维数组层级树，用于后面计算pos的值
         if(levelArr[level] == undefined) {
             levelArr[level] = [];
         }
         levelArr[level].push(node);
         return height;
     }
     getNodeHeight(tree.baseData);








     //计算每个节点的位置
     function getNodePos(tree) {
         for(var level in tree) {
             if(level>0) {
                 for(var index in levelArr[level]) {
                     var node = levelArr[level][index];
                     var lastNode = levelArr[level][index-1]; //上一个节点
                     if(lastNode == undefined) {
                         lastNode = {};
                     }
                     if(node.parent == lastNode.parent) { //同一父节点，后面的节点处理
                         node.posY = lastNode.posY + lastNode.height/2 + node.height/2;
                     } else { //第一个节点
                         var parentTop = node.parent.posY - node.parent.height/2;
                         node.posY = parentTop + node.height/2;
                     }
                 }
             }
         }
     }
     getNodePos(levelArr);


     var nodes = document.getElementById('nodes');
     var lines = document.getElementById('lines');
     nodes.innerHTML = '';
     lines.innerHTML = '';
     $("#properties").html('');
     function makeTree (node) {
         if(node.sub) {
             for(var i=0; i<node.sub.length; i++ ) {
                 makeTree(node.sub[i]);
             }
         }

         var posX = node.level * 200;
         var posY = node.posY;


         //生成节点
         var nodeDiv = document.createElement('div');
         nodeDiv.setAttribute('key',node.key);
         nodeDiv.setAttribute('class','node');
         nodeDiv.style.left = (posX + tree.transformX - 10) + 'px';
         nodeDiv.style.top = (posY + tree.transformY - 25) + 'px';
         nodeDiv.innerHTML = node.name + ' <img src="asset/img/img_03.png" />';
         nodes.appendChild(nodeDiv);

         //生成连接线
         var parentY = 0;
         if(node.parent) {
             parentY = node.parent.posY;
             var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
             newLine.setAttribute('stroke','#29bd8b');
			 newLine.setAttribute('stroke-width','2');
             newLine.setAttribute('fill','none');
             newLine.setAttribute('d','M'+ posX +' '+ posY +' L'+ (posX-50) +' '+ posY +' L'+ (posX-50) +' '+ parentY +' L'+ (posX-200) +' '+ parentY +'');
             lines.appendChild(newLine);
         }

         //生成属性列表
         tree.renderProperty(node);
     }
     makeTree(tree.baseData);
     tree.addListener();
 };

 tree.renderProperty = function(node) {
     var div;
     if($('#property-list-'+node.id+'').length>0) {
         div = $('#property-list-'+node.id+'');
     } else {
         div = $('<div key="'+node.key+'" class="property" id="property-list-'+node.id+'"></div>');
     }

     var posX = node.level * 200;
     var posY = node.posY;

     var propertyHtml = '<ul>';
     for(i=0; i<node.property.length; i++ ) {
         propertyHtml += '<li><a><span class="img_1"></span>'+ node.property[i].name +'</a></li>';
     }
     propertyHtml += '<li data-tag="add"> <a class="add">添加属性</a> </li></ul>';

     div.css('left', (posX + tree.transformX) + 'px');
     div.css('top', (posY + tree.transformY + 35) + 'px');
     if(node.propertyShow) {
         div.show();
     }
     div.html(propertyHtml);

     $("#properties").append(div);
 };















