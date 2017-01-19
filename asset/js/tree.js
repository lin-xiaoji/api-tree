
var baseData = {
    name:'object0',
    property:[
        'ddwee',
        'sdeewe'
    ],
    key:'key-0',
    posY:0,
    sub:[
        {
            name:'event1',
            property:[
                '1111',
                '22222'
            ],
            propertyShow:true,
            key:'key-1',
            sub:[
                {
                    name:'event2',
                    property:[],
                    key:'key-2',
                    sub:[
                        {
                            name:'event3',
                            property:[],
                            key:'key-3',
                        },
                        {
                            name:'element3',
                            property:[],
                            key:'key-4',
                        }
                    ]
                },
                {
                    name:'element',
                    property:[],
                    key:'key-5',
                }
            ]
        },
        {
            name:'element',
            property:[],
            key:'key-6',
        },
        {
            name:'element',
            property:[],
            key:'key-8',
            sub:[
                {
                    name:'event',
                    property:[],
                    key:'key-9',
                },

                {
                    name:'element',
                    property:[],
                    key:'key-10',
                }
            ]
        }
    ]
};
var tree = {};

function resetLayout(baseData,currentNode) {
    var level = 0;
    var tree = {};
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


        //���ɶ�ά����㼶�������ں������pos��ֵ
        if(tree[level] == undefined) {
            tree[level] = [];
        }
        tree[level].push(node);
        return height;
    }
    getNodeHeight(baseData);



    function getNodePos(tree) {
        for(var level in tree) {
            if(level>0) {
                for(var index in tree[level]) {
                    var node = tree[level][index];
                    var lastNode = tree[level][index-1]; //��һ���ڵ�
                    if(lastNode == undefined) {
                        lastNode = {};
                    }
                    if(node.parent == lastNode.parent) { //ͬһ���ڵ㣬����Ľڵ㴦��
                        node.posY = lastNode.posY + lastNode.height/2 + node.height/2;
                    } else { //��һ���ڵ�
                        var parentTop = node.parent.posY - node.parent.height/2;
                        node.posY = parentTop + node.height/2;
                    }
                }
            }
        }
    }
    getNodePos(tree);




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
        if(node == currentNode) {
            borderWidth = 3;
        }
        //���ɽڵ�
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

        //����������
        var parentY = 0;
        if(node.parent) {
            parentY = node.parent.posY;
            var newLine = document.createElementNS('http://www.w3.org/2000/svg','path');
            newLine.setAttribute('stroke','#999999');
            newLine.setAttribute('fill','none');
            newLine.setAttribute('d','M'+ posX +' '+ posY +' L'+ (posX-100) +' '+ posY +' L'+ (posX-100) +' '+ parentY +' L'+ (posX-200) +' '+ parentY +'');
            lines.appendChild(newLine);
        }

        //���������б�
        var propertyHtml = '';
        for(i=0; i<node.property.length; i++ ) {
            propertyHtml += '<div>'+ node.property[i] +'</div>';
        }
        propertyHtml += '<div class="add-property"> ������� </div>';
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

    makeTree(baseData);

    $(".add-property").click(function(){
        var key = this.parentElement.getAttribute('key');
        currentNode = findNodeByKey(key);
        layer.open({
            area: ['500px', '300px']
            ,title: false
            ,content: '<div style="padding:50px;"><input id="text-val" > <button id="add-btn">���</button></div>'
        });

        $("#add-btn").click(function () {
            currentNode.property.push($("#text-val").val());

            resetLayout(baseData,currentNode);
            selectNodeLister();
            layer.closeAll();
        })
    });


}




var currentNode = baseData;
resetLayout(baseData,currentNode);



function findNodeByKey(key){
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
    selected(baseData);
    return tmpNode;
}


//ѡ�нڵ��¼�����
var currentKey = '';
function selectNodeLister() {
    var list = document.getElementById('node-box').childNodes;
    list.forEach(function(item){
        //����ѡ�нڵ�
        item.onclick = function() {
            if(currentKey == this.getAttribute('key')) {
                return false;
            }
            currentKey = this.getAttribute('key');
            //ѡ��dom�ڵ�
            list.forEach(function(item){
                item.childNodes[0].setAttribute('stroke-width','1');
            });
            this.childNodes[0].setAttribute('stroke-width','3');


            //�ҵ���Ӧ��object����
            var key = this.getAttribute('key');
            currentNode = findNodeByKey(key);
        };

        //˫���༭����
        item.ondblclick = function() {
            var text = this.children[1].textContent;
            layer.open({
                area: ['500px', '300px']
                ,title: false
                ,shade: 0.6 //����͸����
                ,content: '<div style="padding:50px;"><input id="text-val" value="'+ text +'"> <button id="save-btn">����</button></div>'
            });
            $("#save-btn").click(function() {
                currentNode.name = $("#text-val").val();

                resetLayout(baseData,currentNode);
                selectNodeLister();
                layer.closeAll();
            });
        };


        //��ʾ�����б�
        item.children[2].onclick = function() {
            $("div[key='"+$(this).parent().attr('key')+"']").toggle(function(){
                if ($(this).is(':hidden')) {
                    currentNode.propertyShow = false;
                } else {
                    currentNode.propertyShow = true;
                }
            });
        };


        //��ֹ���ֱ�ѡ��
        item.onselectstart = function() {
            return false;
        }
    });
}
selectNodeLister();






//����ӽڵ�
window.onkeyup = function(e) {
    if(e.keyCode == 13 ) {
        var newObject = {
            name:'new-element',
            property:[],
            key:'key-' + Math.random()
        };
        if(currentNode.parent) {
            var index = 0;
            for(var i=0; i<currentNode.parent.sub.length; i++ ) {
                if(currentNode.parent.sub[i] == currentNode) {
                    index = i + 1;
                }
            }
            currentNode.parent.sub.splice(index,0,newObject);
        }else {
            currentNode.sub.push(newObject);
        }
        currentNode = newObject;

        resetLayout(baseData,currentNode);
        selectNodeLister();
    }
};





//��ק
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