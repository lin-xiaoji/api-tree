

 var tree = {};
 tree.baseData = null;
 tree.currentNode = null;
 tree.currentPropertyIndex = null;

 tree.init = function (baseData) {
     tree.baseData = baseData;
     tree.currentNode = baseData;

     window.onkeyup = function(e) {
         //添加子节点
         if(e.keyCode == 13 ) {
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

         //删除节点
         if(e.keyCode == 46 && e.shiftKey == false) {
             var arr = tree.currentNode.parent.sub;
             for(var i=0; i < arr.length; i++) {
                 if(arr[i] == tree.currentNode) {
                     arr.splice(i,1);
                 }
             }
             tree.render(tree.baseData);
         }

         //删除属性
         if(e.keyCode == 46 && e.shiftKey == true) {
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
     $(".node").click(function(){
         var key = $(this).attr("key");
         if(tree.currentKey == key) {
             return false;
         }
         tree.currentKey = key;
         $(".node").css("border",'solid 1px rgb(115, 161, 191)');
         $(this).css("border",'solid 3px rgb(115, 161, 191)');
         tree.currentNode = tree.findNodeByKey(key);
     });
    //显示属性列表
     $(".node img").click(function() {
         $(".property").slideUp();
         $(".property[key='"+$(this).parent().attr('key')+"']").toggle(function(){
             if ($(this).is(':hidden')) {
                 tree.currentNode.propertyShow = false;
             } else {
                 tree.currentNode.propertyShow = true;

             }
         });
     });

     //编辑节点
     $(".node").dblclick(function(){
         var text = $(this).text();
         layer.open({
             area: ['500px', '300px']
             ,title: false
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
     $(".property ul li").click(function() {
         var key = $(this).parent().parent().attr('key');
         tree.currentNode = tree.findNodeByKey(key);
         tree.currentPropertyIndex = $(this).index();
         var property = tree.currentNode.property[tree.currentPropertyIndex];

         $(".apiDetail h2").html(property.name);
         $(".desc").html(property.content);

         $(".property ul li").removeClass('active');
         $(this).addClass('active');
		 
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

     //编辑属性
     $(".property ul li").dblclick(function() {
         layer.open({
             area: ['500px', '300px']
             ,title: false
             ,shade: 0.6 //遮罩透明度
             ,content: '<div style="padding:50px;"><input id="text-val" value="'+ $(this).text() +'"> <button id="edit-property">保存</button></div>'
         });
         $("#edit-property").click(function() {
             tree.currentNode.property[tree.currentPropertyIndex] = $("#text-val").val();
             tree.render(tree.baseData);
             layer.closeAll();
         });
     });
     $(".property").bind('selectstart', function(){ return false; });




     //添加属性
     $(".add-property").click(function(){
         var key = $(this).parent().parent().attr('key');
         tree.currentNode = tree.findNodeByKey(key);
         layer.open({
             area: ['500px', '300px']
             ,title: false
             ,content: '<div style="padding:50px;"><input id="text-val" > <button id="add-property">添加</button></div>'
         });

         $("#add-property").click(function () {
             tree.currentNode.property.push($("#text-val").val());
             tree.render(tree.baseData);
             layer.closeAll();
         })
     });
 };









 //渲染
 tree.render = function () {
     var level = 0;
     var levelArr = {};
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
     var properties = document.getElementById('properties');
     nodes.innerHTML = '';
     lines.innerHTML = '';
     properties.innerHTML = '';
     function makeTree (node) {
         if(node.sub) {
             for(var i=0; i<node.sub.length; i++ ) {
                 makeTree(node.sub[i]);
             }
         }

         var posX = node.level * 200;
         var posY = node.posY;
         var borderWidth = 1;
         if(node == tree.currentNode) {
             borderWidth = 3;
         }
         //生成节点
         //var newNode = document.createElementNS('http://www.w3.org/2000/svg','g');
         //newNode.setAttribute('transform','translate( '+ posX +' '+ posY +' )');
         //newNode.setAttribute('key',node.key);
         //var innerHTML = '<path fill="rgb(238, 243, 246)" stroke="rgb(115, 161, 191)"\
         //   d="M-17,-13h90a3,3,0,0,1,3,3v20a3,3,0,0,1,-3,3h-90a3,3,0,0,1,-3,-3v-20a3,3,0,0,1,3,-3z"\
         //   stroke-width="'+ borderWidth +'"></path>\
         //   <text dominant-baseline="text-before-edge" font-size="14" dy="0" x="-15" y="-7">'+ node.name +'</text>\
         //   <path fill="black" stroke="none" style="cursor: pointer;" transform="translate( 52.5 -6.5 )"\
         //   d="M9,9H3V8h6L9,9L9,9z M9,7H3V6h6V7z M9,5H3V4h6V5z M8.5,11H2V2h8v7.5 M9,12l2-2V1H1v11" ></path>\
         //   ';
         //newNode.innerHTML = innerHTML;
         //nodeBox.appendChild(newNode);

         var nodeDiv = document.createElement('div');
         nodeDiv.setAttribute('key',node.key);
         nodeDiv.setAttribute('class','node');
         nodeDiv.style.left = (posX + 145) + 'px';
         nodeDiv.style.top = (posY + 385) + 'px';
         nodeDiv.innerHTML = node.name + ' <img src="asset/img/property.gif" />';
         nodes.appendChild(nodeDiv);

         //生成连接线
         var parentY = 0;
         if(node.parent) {
             parentY = node.parent.posY;
             var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
             newLine.setAttribute('stroke','#2eb5e5');
			 newLine.setAttribute('stroke-width','2');
             newLine.setAttribute('fill','none');
             newLine.setAttribute('d','M'+ posX +' '+ posY +' L'+ (posX-100) +' '+ posY +' L'+ (posX-100) +' '+ parentY +' L'+ (posX-200) +' '+ parentY +'');
             lines.appendChild(newLine);
         }

         //生成属性列表
         var propertyHtml = '<ul>';
         for(i=0; i<node.property.length; i++ ) {
             propertyHtml += '<li>'+ node.property[i].name +'</li>';
         }
         propertyHtml += '<div class="add-property"> 添加属性 </div></ul>';
         var div = document.createElement('div');
         div.setAttribute('key',node.key);
         div.setAttribute('class','property');
         div.style.left = (posX+160) + 'px';
         div.style.top = (posY + 420) + 'px';
         if(node.propertyShow) {
             div.style.display = 'block';
         }
         div.innerHTML = propertyHtml;

         properties.appendChild(div);

     }
     makeTree(tree.baseData);
     this.addListener();
 };















