$(function () {
    //读取数据函数
    function readFile(id) {
        $.get('/api/files/read',{id:id},function (data) {
            var info = JSON.parse(data).data;
            $("#file-name").html(info.name);
            var treeData = JSON.parse(info.content);

            tree.init(treeData);
            tree.render();
        });
    }


    //读取文件列表
    $.get('/api/files',function (data) {
        data = JSON.parse(data);
        var files = data.data;
        $("#file-list ul").html('');
        files.map(function (item) {
            $("#file-list ul").append('<li data-id="'+ item.id +'"><i class="iconfont">&#xe628;</i>'+ item.name +'</li>');
        });
        readFile(files[0].id);
    });

    //点击显示某个文件
    $("#file-list ul").on('click','li',function () {
        readFile($(this).data('id'));
    });









    $("#btn-login").click(function () {
        layer.open({
            area: ['500px', '300px']
            ,title: false
            ,content: '<div style="padding:50px;">' +
            '<input id="username" ><br>' +
            '<input id="password" type="password" > <br>' +
            '<button id="login">登陆</button>' +
            '</div>'
        });

        $("#login").click(function () {
            $.post('/api/login',{username:$("#username").val(),password:$("#password").val()},function(data){
                alert(data);
            });
        });
    });

    $("#btn-reg").click(function () {
        layer.open({
            area: ['500px', '300px']
            ,title: false
            ,content: '<div style="padding:50px;">' +
            '<input id="username" > <br>' +
            '<input id="password" type="password" > <br>' +
            '<button id="login">注册</button>' +
            '</div>'
        });

        $("#login").click(function () {
            $.post('/api/login/reg',{username:$("#username").val(),password:$("#password").val()},function(data){
                alert(data);
            });
        });
    });



    //保存数据
    function saveData() {
        function delParent(data) {
            delete data.parent;
            if(data.sub) {
                data.sub.map(function (item) {
                    delParent(item);
                });
            }
        }
        delParent(tree.baseData);

        var content = JSON.stringify(tree.baseData);
        $.post('/api/files/save',{id:1,content:content},function(data){
            alert(data);
        });
    }
    //ctrl+s保存
    $("#btn-save").click(function () {
        saveData();
    });

    //ctrl+s保存
    $(document).keydown(function(e){
        if( e.ctrlKey  == true && e.keyCode == 83 ){
            saveData();
            return false; // 截取返回false就不会保存网页了
        }
    });

    //滚轮滚动
    var $root = $("#tree");
    $(document).on("mousewheel DOMMouseScroll", function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

        if (delta > 0) {
            // 向上滚
            $root.css('top',($root.position().top + 30) + 'px');
        } else if (delta < 0) {
            // 向下滚
            $root.css('top',($root.position().top - 30) + 'px');
        }
    });
});


