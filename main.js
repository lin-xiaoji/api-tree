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

$("#btn-save").click(function () {
    function delParent(data) {
        delete data.parent;
        if(data.sub) {
            data.sub.map(function (item) {
                delParent(item);
            });
        }
    }
    delParent(baseData);

    var content = JSON.stringify(baseData);
    $.post('/api/files/save',{id:1,content:content},function(data){
        alert(data);
    });
});

