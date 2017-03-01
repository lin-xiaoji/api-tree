<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Menu extends Curd {
	public function __construct() {
		parent::__construct();

		$parent_id = (int)$this->input->get('parent_id');
		$this->conf['edit'] = [
				'extraData'=>[
						[
								'table'=> 'menu',
								'where'=>['parent_id'=>0]
						]
				],
				'endFunc'=> function($data) use ($parent_id) {
					foreach ($data['menu'] as $item) {
						$item['sub'] = M("menu")->getList([
								'parent_id'=>$item['id']
						]);
						$tmp[] = $item;
					}
					$data['menu'] = $tmp;

					if(!$data['item']['parent_id']) {
						$data['item']['parent_id'] = $parent_id;
					}

					return $data;
				}

		];
	}

	function index() {
		$data['menu'] = $this->getMenu(0);


		$this->display($data);
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
