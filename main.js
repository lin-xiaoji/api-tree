$(function () {

    
    $.get('/api/files',function (data) {
        data = JSON.parse(data);
		//登陆状态
		var username = data.data.username;
		if(username) {
			$(".account").html(username);
			$(".login").show();
			$("#btn-login").hide();
		}
		
		//读取文件列表
        var files = data.data.files;
        $("#file-list ul").html('');
        files.map(function (item) {
            $("#file-list ul").append('<li data-id="'+ item.id +'"><a><i class="iconfont">&#xe612;</i>'+ item.name +'</a></li>');
        });
        $("#file-list ul li:eq(0)").click();
    });
	
	

    //点击显示某个文件
    $("#file-list ul").on('click','li',function () {
		$("#file-list ul li a").removeClass("special");								 
		$(this).find("a").addClass("special");
		
		
		//读取数据
		window.fileId = id = $(this).data('id');
        $.get('/api/files/read',{id:id},function (data) {
            var info = JSON.parse(data).data;
            $("#file-name").html(info.name);
            var treeData = JSON.parse(info.content);

            tree.init(treeData);
            tree.render();
        });
    });



	//添加文档
	$(".add-file").click(function() {
		layer.open({
             area: ['500px', '300px']
             ,title: false
			 ,btn:false
             ,shade: 0.6 //遮罩透明度
             ,content: '<div style="padding:50px;"><input id="text-val" > <button id="edit-file">保存</button></div>'
         });
	});



	//登陆注册
	function loginOk(data) {
		if(data.code == 1) {
			$(".account").html(data.data);
			$(".login").show();
			$("#btn-login").hide();
			layer.closeAll();
		} else {
			alert(data.msg);
		}
	}
    $("#btn-login").click(function () {
        layer.open({
            area: ['500px', '300px']
            ,title: false
			,btn:false
            ,content: '<div style="padding:50px;">' +
            '<div class="login"><span>用户名:</span><input id="username" class="input_l" ></div>' +
            '<div class="login"><span>密 码：</span><input id="password" type="password" class="input_l"></div>' +
            '<button id="login">登陆</button>' +
            '</div>'
        });

        $("#login").click(function () {
            $.post('/api/login',{username:$("#username").val(),password:$("#password").val()},function(data){
                loginOk(data);
            },'json');
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
                loginOk(data);
            },'json');
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
        $.post('/api/files/save',{id:window.fileId,content:content},function(data){
            data = JSON.parse(data);
            if(data.code == 0) {
                alert(data.msg);
            } else {
                alert('保存成功');
            }
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


    //编辑属性
    $("#property-edit").click(function () {
        $(".apiDetail:eq(0)").hide();
		$(".apiDetail:eq(1)").show();
    });
    //预览
    $("#property-preview").click(function () {
        var converter = new showdown.Converter();
        var html = converter.makeHtml($("#property-textarea textarea").val());
        $("#property-name").html($("#property-name-input").val());
        $("#property-desc").html(html);

        $(".apiDetail:eq(0)").show();
		$(".apiDetail:eq(1)").hide();
    });
    //保存
    $("#property-save").click(function () {
        tree.currentNode.property[tree.currentPropertyIndex].name = $("#property-name input").val();
        tree.currentNode.property[tree.currentPropertyIndex].content = $("#property-textarea textarea").val();
        tree.render(tree.baseData);
        $("#btn-save").click();
    });

    //滚轮滚动
    var $root = $("#tree");
    var $overlay = $("#overlayDiv");
    $(document).on("mousewheel DOMMouseScroll", function (e) {
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));              // firefox

        if (delta > 0) {
            // 向上滚
            $root.css('top',($root.position().top + 30) + 'px');
            $overlay.css('top',($overlay.position().top + 30) + 'px');
        } else if (delta < 0) {
            // 向下滚
            $root.css('top',($root.position().top - 30) + 'px');
            $overlay.css('top',($overlay.position().top - 30) + 'px');
        }
    });
});


