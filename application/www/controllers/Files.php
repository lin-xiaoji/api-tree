<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Files extends Common {

	function index() {
		$userid = $this->get("userid",1);
		$files = M("files")->getList(['userid'=>$userid],'id,name');

		$this->success($files);
	}

	function read() {
		$id = $this->get("id",1);
		$data = M("files")->find($id);
		$this->success($data);
	}

	function save() {
		$this->check_login();

		$id = $this->post('id');
		$file = M("files")->find($id);


		if($file['userId'] == $this->userId) {
			$content = $this->post('content');
			M("files")->save(['content'=>$content],['id'=>$id]);
		} else {
			$this->error('无修改权限！');
		}

		$this->success();
	}

	function create() {
		$this->check_login();

		$name = $this->post('name');
		M("files")->add(['name'=>$name]);

		$this->success();
	}



}
