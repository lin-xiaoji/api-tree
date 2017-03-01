layui.define(['form', 'layer', 'laydate', 'upload'], function(exports){
    var layer = layui.layer;
	var form = layui.form();
	
	var hash = 0; //每次递增，用于标识每次添加的表单项目

	//保存表单
	$(".save-form").click(function() {
		layer.open({
			  type: 2,
			  title:'保存表单',
			  area: ['620px', '340px'], //宽高
			  content: '/view_builder/save'
		});
	});

	//拖动排序
	$(".layui-form").sortable();
	$(".table-head").sortable();
	
	//选中
	$(".layui-form").on('click','.layui-form-item',function() {
		$(".layui-form .layui-form-item").removeClass('on-selected');
		$(this).addClass('on-selected');
		
		var hash = $(this).attr('hash');
		$(".layui-table th").removeClass('on-selected');
		$(".layui-table th[hash='"+hash+"']").addClass('on-selected');
	});
	
	
	
	//删除组件
	$(".layui-form").on('click','.deleteButton',function() {
		var hash = $(this).parent().attr('hash');
		$(".layui-table th[hash='"+hash+"']").remove();
		$(this).parent().remove();
	});
	$(".layui-table").on('click','.deleteButton',function() {
		$(this).parent().remove();
	});
	
	
	//读取组件默认值
	$(".layui-form").on('click','.layui-form-item',function() {
		var hash = $(this).attr('hash');
		$(".layui-table th[hash='"+hash+"']").attr('field',$(this).find('.form-item').attr('name'));
															
		$(".component-title").val($(this).find('.layui-form-label').html());
		
		$(".component-name").val($(this).find('.form-item').attr('name'));
		
		var width = $(this).find('.layui-input-block').attr('style');
		width = width.replace('width:','').replace('%','').replace(';','');
		$(".component-width").val(width);
		
		$(".component-required").prop('checked',$(this).find('.layui-form-label').hasClass('layui-input-required'));
	});
	
	
	
	
	//编辑组件
	$(".component-title").keyup(function() {
		$(".layui-form .on-selected .layui-form-label").html($(this).val());
		$(".layui-table .on-selected").html($(this).val());
	});
	
	$(".component-name").keyup(function() {
		$(".layui-form .on-selected .form-item").attr('name',$(this).val());
		$(".layui-table .on-selected").attr('field',$(this).val());
	});
	$(".component-width").keyup(function() {
		$(".layui-form .on-selected .layui-input-block").css('width',$(this).val()+'%');
	});
	$(".component-required").change(function() {
		$(".layui-form .on-selected .layui-form-label").toggleClass('layui-input-required');
		if(!$(".layui-form .on-selected .form-item").attr('lay-verify')){
			$(".layui-form .on-selected .form-item").attr('lay-verify','required');
		}else{
			$(".layui-form .on-selected .form-item").removeAttr('lay-verify')
		}
		
	});
	
	$(".component-search").change(function() {		   
		if($(this).is(':checked')) { 
			$(".search-form").html('\
				<form method="get" class="layui-form">\n\
                    <div class="layui-input-inline">\n\
                        <input class="layui-input" type="text" id="keyword" name="keyword"  placeholder="关键词" >\n\
                    </div>\n\
                    <div class="layui-input-inline">\n\
                        <button class="layui-btn" lay-submit="" lay-filter="newsfilter"><i class="layui-icon">&#xe615;</i> 搜索</button> \n\
						<a href="javascript:;" class="layui-btn add" ><i class="layui-icon">&#xe608;</i> 添加</a>\n\
                    </div>\n\
            </form>\n');
		}else{
			$(".search-form").html('<div class="layui-input-inline">\n\
						<a href="javascript:;" class="layui-btn add" ><i class="layui-icon">&#xe608;</i> 添加</a>\n\
                    </div>\n\
					');
		}
		
	});
	
	
	
	
	//插入组件
	$(".utility").click(function() {
		hash = hash + 1;
		var index = $(this).index();
		var added;
		var label;
		if(index == 0) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">文本框</label>\n\
				<div class="layui-input-block" style="width:50%">\n\
					<input type="text" name=""  autocomplete="off"  class="layui-input form-item">\n\
				</div>\n\
			</div>\n\
			');
			label = '文本框';
		}
		if(index == 1) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">文本域</label>\n\
				<div class="layui-input-block" style="width:50%">\n\
					<textarea  class="layui-textarea form-item"></textarea>\n\
				</div>\n\
			</div>\n\
			');
			label = '文本域';
		}
		if(index == 2) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">下拉菜单</label>\n\
				<div class="layui-input-block" style="width:20%">\n\
					<select name="" class="form-item">\n\
						<option >请选择</option>\n\
			  		</select>\n\
				</div>\n\
			</div>\n\
			');
			label = '下拉菜单';
		}
		if(index == 3) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">日期</label>\n\
				<div class="layui-input-block" style="width:20%">\n\
					<input type="text" name="" lay-verify="date" autocomplete="off" class="layui-input form-item" onclick="layui.laydate({elem: this})">\n\
				</div>\n\
			</div>\n\
			');
			label = '日期';
		}
		if(index == 4) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">多选框</label>\n\
				<div class="layui-input-block" style="width:80%">\n\
					<input type="checkbox" name="" title="选项1" class="form-item">\n\
			 		<input type="checkbox" name="" title="选项2" class="form-item">\n\
			  		<input type="checkbox" name="" title="选项3" class="form-item">\n\
				</div>\n\
			</div>\n\
			');
			label = '多选框';
		}
		
		
		if(index == 5) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">单选框</label>\n\
				<div class="layui-input-block" style="width:80%">\n\
					<input type="radio" name="" value="1" title="选项1" class="form-item">\n\
					<input type="radio" name="" value="2" title="选项2" class="form-item">\n\
				</div>\n\
			</div>\n\
			');
			label = '单选框';
		}
		if(index == 6) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">附件</label>\n\
				<div class="layui-input-block" style="width:50%">\n\
					<input type="file" name="" class="layui-upload-file form-item" lay-title="添加文件"> \n\
				</div>\n\
			</div>\n\
			');
			label = '附件';
		}
		
		if(index == 7) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">编辑器</label>\n\
				<div class="layui-input-block" style="width:85%">\n\
					<textarea class="layui-input form-item kindeditor" rows="4" name=""></textarea>\n\
				</div>\n\
			</div>\n\
			');
			label = '编辑器';
		}
		
		if(index == 8) {
			added = $('\n\
			<div class="layui-form-item" hash="item-'+hash+'">\n\
				<div class="deleteButton"></div>\n\
				<label class="layui-form-label">纯文本</label>\n\
				<div class="layui-input-block" style="width:80%">\n\
					文本内容\n\
				</div>\n\
			</div>\n\
			');
			label = '纯文本';
		}
		
		$(".form-end").before(added);
		$("#th-end").before('<th field="" class="on-selected" hash="item-'+hash+'"><div class="deleteButton"></div>'+label+'</th>');
		added.click();
		form.render();
		if(index == 6) {
			layui.upload();
		}

	});
	
	

    exports('view-builder');
});