<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Member_group extends Curd {
	public function __construct() {
		parent::__construct();


	}

	function privilege() {
		$id = $this->input->get('id');
		$item = M('member_group')->find($id);
		if($_SERVER['REQUEST_METHOD'] != 'POST') {
			$data['menu'] = $this->getMenu(0);
			$data['privilege'] = explode(',', $item['privilege']);

			$this->display($data);
		} else {
			$privilege = $this->input->post('privilege');
			$privilege = implode(',',$privilege);
			M('member_group')->save(['privilege'=>$privilege],['id'=>$id]);

			$this->saveOk();
		}
	}


	//递归得到所有栏目数据
	function getMenu($parent_id) {
		$list = M('menu')->getList(['parent_id'=>$parent_id]);
		foreach ($list as $item) {
			$item['sub'] = $this->getMenu($item['id']);
			$out[] = $item;
		}
		return $out;
	}


}
