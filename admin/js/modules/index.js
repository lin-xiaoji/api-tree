layui.define(['element', 'layer'], function(exports){
    var element = layui.element();
    var layer = layui.layer;
    var $ = layui.jquery;

    //iframe自适应
    $(window).on('resize', function() {
        var content = $('.admin-nav-card .layui-tab-content');
        content.height($(this).height() - 147);
        content.find('iframe').each(function() {
            $(this).height(content.height());
        });
    }).resize();


    //添加tab
    var $tabs = $('#admin-tab');
    var $container = $('#admin-tab-container');
    //绑定 nav 点击事件
    $('ul.admin-nav-tree').find('dd > a').each(function() {
        var $this = $(this);
        //获取设定的url
        var url = $this.data('url');
        if(url !== undefined) {
            $this.on('click', function() {
                var iframe = '<iframe src="' + url + '"></iframe>';
                var aHtml = $this.html();
                var count = 0;
                var tabIndex;
                $tabs.find('li').each(function(i, e) {
                    var $cite = $(this).children('cite');
                    if($cite.text() === $this.find('cite').text()) {
                        count++;
                        tabIndex = i;
                    }
                });
                //tab不存在
                if(count === 0) {
                    //添加删除样式
                    aHtml += '<i class="layui-icon layui-unselect layui-tab-close">&#x1006;</i>';
                    //添加tab
                    element.tabAdd('admin-tab', {
                        title: aHtml,
                        content: iframe
                    });
                    //iframe 自适应
                    var $content = $('.admin-nav-card .layui-tab-content');
                    $content.find('iframe').each(function() {
                        $(this).height($content.height());
                    });
                    //绑定关闭事件
                    $tabs = $('#admin-tab');
                    var $li = $tabs.find('li');
                    $li.eq($li.length - 1).children('i.layui-tab-close').on('click', function() {
                        element.tabDelete('admin-tab', $(this).parent('li').index()).init();
                    });
                    //获取焦点
                    element.tabChange('admin-tab', $li.length - 1);

                } else {
                    //切换tab
                    element.tabChange('admin-tab', tabIndex);
                }
            });
        }
    });

    $('#user').on('click', function() {
        $('#user-item').toggle();
    });
	
	$(".layui-nav-tree .layui-nav-child dd a").eq(0).click();

    //手机设备的简单适配
    var treeMobile = $('.site-tree-mobile'),
        shadeMobile = $('.site-mobile-shade');
    treeMobile.on('click', function() {
        $('body').addClass('site-mobile');
    });
    shadeMobile.on('click', function() {
        $('body').removeClass('site-mobile');
    });

    exports('index');
});
