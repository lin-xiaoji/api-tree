<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Files extends Common {

	function index() {
		$userid = $this->get("userid",1);
		$files = M("files")->getList(['userid'=>$userid],'id,name');
		$data['username'] = $_SESSION['username'];
		$data['files'] = $files;
		$this->success($data);
	}

	function read() {
		$id = $this->get("id",1);
		$node = $this->readNode($id, 0);
		$data['name'] = $node[0]['name'];
		$data['content'] = json_encode($node[0]);
		//$data = M("files")->find($id);
		$this->success($data);
	}

	//递归读取节点
	private function readNode($file_id, $parent_id) {
		$data = M("node")->getList(['file_id'=>$file_id, "parent_id"=>$parent_id]);

		foreach ($data as $key => $item) {
			$sub = $this->readNode($file_id, $item['id']);
			$data[$key]['key'] = 'key-'.$item['id'];
			if($sub) $data[$key]['sub'] = $sub;
			$data[$key]['property'] = M("property")->getList(['node_id'=>$item['id']],'id,name,content');
//echo  M("property")->db->last_query();
			unset($data[$key]['addtime']);
		}

		return $data;
	}



	//保存数据
	function save() {
		$this->check_login();

		$id = $this->post('id');
		$content = $this->post('content');
		$file = M("files")->find($id);


		$data = json_decode($content);
		if($file['userId'] == $this->userId) {
			//保存文件名
			M("files")->save(['name'=>$data->name],['id'=>$id]);
			//保存节点和属性
			$this->saveNode($data, $id);
		} else {
			$this->error('无修改权限！');
		}

		$this->success();
	}


	private function saveNode($data, $file_id) {
		$node['file_id'] = $file_id;
		$node['parent_id'] = (int)$data->parent_id;
		$node['name'] = $data->name;
		$node['level'] = $data->level;
		$node['height'] = $data->height;
		$node['posY'] = $data->posY;
		if($data->id) {
			M("node")->save($node,['id'=>$data->id]);
		} else {
			$data->id = M("node")->add($node);
		}

		//保存子节点
		foreach ($data->sub as $item) {
			$item->parent_id = $data->id;
			$this->saveNode($item, $file_id);
		}
	}

	function saveProperty() {
		$this->check_login();
		$property = $this->post();
		if($property['id']) {
			M("property")->save($property,['id'=>$property['id']]);
		} else {
			$property['id'] = M("property")->add($property);
		}
		$this->success($property);
	}




	function create() {
		$this->check_login();

		$name = $this->post('name');
		M("files")->add(['name'=>$name]);

		$this->success();
	}



}
