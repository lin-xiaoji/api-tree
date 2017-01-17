

 var tree = {};

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
         if(e.keyCode == 8 && e.shiftKey) {
             var arr = tree.currentNode.parent.sub;
             for(var i=0; i < arr.length; i++) {
                 if(arr[i] == tree.currentNode) {
                     arr.splice(i,1);
                 }
             }
             tree.render(tree.baseData);
         }
         //console.log(e);
     };





     //拖拽
     var root =document.getElementById('tree-root');
     var properties = document.getElementById('properties');
     var matrix = root.transform.baseVal[0].matrix;
     root.onmousedown = function(e) {
         var diffX = e.clientX - matrix.e;
         var diffY = e.clientY - matrix.f;

         document.onmousemove = function(e) {
             var left=e.clientX-diffX;
             var top=e.clientY-diffY;

             matrix.e = left;
             matrix.f = top;

             properties.style.left = (left - 160) + 'px';
             properties.style.top = (top - 400) + 'px';
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


 tree.addListener = function () {
     var list = document.getElementById('node-box').childNodes;
     var item;
     var i;
     for(i = 0; i<list.length; i++) {
         item = list[i];

         //单击选中节点
         item.onclick = function() {
             if(tree.currentKey == this.getAttribute('key')) {
                 return false;
             }
             tree.currentKey = this.getAttribute('key');
             //选择dom节点
             for(i = 0; i<list.length; i++) {
                 list[i].childNodes[0].setAttribute('stroke-width','1');
             };
             this.childNodes[0].setAttribute('stroke-width','3');


             //找到对应的object对象
             var key = this.getAttribute('key');
             tree.currentNode = tree.findNodeByKey(key);
         };

         //双击编辑文字
         item.ondblclick = function() {
             var text = this.children[1].textContent;
             layer.open({
                 area: ['500px', '300px']
                 ,title: false
                 ,shade: 0.6 //遮罩透明度
                 ,content: '<div style="padding:50px;"><input id="text-val" value="'+ text +'"> <button id="save-btn">保存</button></div>'
             });
             $("#save-btn").click(function() {
                 tree.currentNode.name = $("#text-val").val();

                 tree.render(tree.baseData);

                 layer.closeAll();
             });
         };


         //显示属性列表
         item.children[2].onclick = function() {
             $("div[key='"+$(this).parent().attr('key')+"']").toggle(function(){
                 if ($(this).is(':hidden')) {
                     tree.currentNode.propertyShow = false;
                 } else {
                     tree.currentNode.propertyShow = true;
                 }
             });
         };


         //禁止文字被选中
         item.onselectstart = function() {
             return false;
         }
     }
 };

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




     var nodeBox = document.getElementById('node-box');
     var lines = document.getElementById('lines');
     var properties = document.getElementById('properties');
     nodeBox.innerHTML = '';
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
         var newNode = document.createElementNS('http://www.w3.org/2000/svg','g');
         newNode.setAttribute('transform','translate( '+ posX +' '+ posY +' )');
         newNode.setAttribute('key',node.key);
         var innerHTML = '<path fill="rgb(238, 243, 246)" stroke="rgb(115, 161, 191)"\
            d="M-17,-13h90a3,3,0,0,1,3,3v20a3,3,0,0,1,-3,3h-90a3,3,0,0,1,-3,-3v-20a3,3,0,0,1,3,-3z"\
            stroke-width="'+ borderWidth +'"></path>\
            <text dominant-baseline="text-before-edge" font-size="14" dy="0" x="-15" y="-7">'+ node.name +'</text>\
            <path fill="black" stroke="none" style="cursor: pointer;" transform="translate( 52.5 -6.5 )"\
            d="M9,9H3V8h6L9,9L9,9z M9,7H3V6h6V7z M9,5H3V4h6V5z M8.5,11H2V2h8v7.5 M9,12l2-2V1H1v11" ></path>\
            ';

         newNode.innerHTML = innerHTML;

         nodeBox.appendChild(newNode);

         //生成连接线
         var parentY = 0;
         if(node.parent) {
             parentY = node.parent.posY;
             var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
             newLine.setAttribute('stroke','#999999');
             newLine.setAttribute('fill','none');
             newLine.setAttribute('d','M'+ posX +' '+ posY +' L'+ (posX-100) +' '+ posY +' L'+ (posX-100) +' '+ parentY +' L'+ (posX-200) +' '+ parentY +'');
             lines.appendChild(newLine);
         }

         //生成属性列表
         var propertyHtml = '';
         for(i=0; i<node.property.length; i++ ) {
             propertyHtml += '<div>'+ node.property[i] +'</div>';
         }
         propertyHtml += '<div class="add-property"> 添加属性 </div>';
         var div = document.createElement('div');
         div.setAttribute('key',node.key);
         div.setAttribute('class','property');
         div.style.position = 'absolute';
         div.style.left = (posX+160) + 'px';
         div.style.top = (posY + 420) + 'px';
         if(node.propertyShow) {
             div.style.display = 'block';
         }
         div.innerHTML = propertyHtml;
         properties.appendChild(div);

     }

     makeTree(tree.baseData);

     $(".add-property").click(function(){
         var key = this.parentElement.getAttribute('key');
         tree.currentNode = tree.findNodeByKey(key);
         layer.open({
             area: ['500px', '300px']
             ,title: false
             ,content: '<div style="padding:50px;"><input id="text-val" > <button id="add-btn">添加</button></div>'
         });

         $("#add-btn").click(function () {
             tree.currentNode.property.push($("#text-val").val());

             tree.render(tree.baseData);
             layer.closeAll();
         })
     });


     this.addListener();


 };















