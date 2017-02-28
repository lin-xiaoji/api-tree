$("#btn-login").click(function () {
    layer.open({
        area: ['500px', '300px']
        ,title: false
        ,content: '<div style="padding:50px;"><input id="account" ><input id="password" > <button id="login">登陆</button></div>'
    });

    $("#login").click(function () {
        alert(1);
    });
});

