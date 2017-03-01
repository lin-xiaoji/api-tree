<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class View_builder extends Curd {
	public function __construct() {
		parent::__construct();

	}

	function form(){
		$this->display();
	}


	function save() {
		if($_SERVER['REQUEST_METHOD'] == 'POST'){
			$fileName = 'edit.html';
			$basePath = '../application/admin/views/';
			$path = $this->input->post('path');
			$path = trim($path,'/');

			if(strpos($path,'.')){
				$fileName = end(explode('/',$path));
				$tmpArr = explode('/',$path);
				unset($tmpArr[count($tmpArr)-1]);
				$path = implode('/',$tmpArr);
			}

			@mkdir($basePath.$path,0777,true);

			$content = $this->input->post('content');

			//清理代码
			$content = str_replace('<div class="deleteButton"></div>','',$content);
			$content = str_replace('ui-sortable-handle','',$content);
			$content = str_replace('ui-sortable','',$content);
			$content = str_replace('<div class="layui-form-item',"\n\n\n			<div class=\"layui-form-item",$content);

			//添加value
			preg_match_all('|name="(.*)"|U',$content,$out);
			foreach ($out[1] as $value) {
				if(trim($value)){
					$content = str_replace('name="'.$value.'"></textarea>','name="'.$value.'">{$item.'.$value.'}</textarea>',$content);
					$content = str_replace('name="'.$value.'" ','name="'.$value.'" value="{$item.'.$value.'}" ',$content);
				}
			}

			$content = '{include file="../public/header.html"}
			<div class="layui-main">
			'.$content.'
			</div>
			{include file="../public/footer.html"}';
			file_put_contents($basePath.$path.'/'.$fileName,$content);






			//---------------------生成列表文件
			// modules/rbac/views/menu 或 views/order/
			$listContent = $this->input->post('listContent');
			//清理代码
			$listContent = str_replace('<div class="deleteButton"></div>','',$listContent);
			$listContent = str_replace('ui-sortable-handle','',$listContent);
			$listContent = str_replace('ui-sortable','',$listContent);
			$listContent = str_replace('</th><th',"</th>\n                        <th",$listContent);

			//添加数据列表
			$listForeach = "\n".' 					{foreach from=$list item=item}
					<tr>';
			preg_match_all('|field="(.*)"|U',$listContent,$out);
			foreach ($out[1] as $value) {
				$listForeach .= "\n".' 						<td>{$item.'.$value.'}</td>';
			}
			$listForeach .= "\n".' 						<td>
                            <a href="javascript:;" class="layui-btn layui-btn-mini edit" data-id="{$item.id}">编辑</a>
                            <a href="javascript:;" class="layui-btn layui-btn-danger layui-btn-mini del" data-id="{$item.id}">删除</a>
						</td>
                    </tr>
					{/foreach}';
			$listContent = str_replace('<tbody>','<tbody>'.$listForeach,$listContent);
			$listContent = '{include file="../public/header.html"}
			'.$listContent.'
			{include file="../public/footer.html"}';
			file_put_contents($basePath.$path.'/index.html',$listContent);







			//生成controller文件
			$controllerFile = $this->input->post('controllerFile');
			if($controllerFile) {
				$fileContent = file_get_contents($basePath.'view_builder/tpl.php');
				$controllerName = ucfirst($path);
				$fileContent = str_replace('Tpl',$controllerName,$fileContent);
				file_put_contents($basePath."../controllers/".$controllerName.".php",$fileContent);
			}



			echo 'ok';
		} else {
			$this->display();
		}

	}


	function actionList() {

		return $this->render('/view-builder/list.html');
	}

}
