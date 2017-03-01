<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends Curd {
	public function __construct() {
		parent::__construct();

		session_start();
		$this->conf['index'] = [
			'tableName' => 'menu',
			'where'=>['parent_id'=>0],
			'pageSize'=> 'all',
			'endFunc'=> function($data) {
				$parent_id = $this->input->get('parent_id');
				if(empty($parent_id)) {
					$parent_id = 1;
				}
				$list = M('menu')->getList([
					'parent_id'=>$parent_id,
					'id in' => explode(',',$_SESSION['privilege'])
				]);
				foreach($list as $item) {
					$item['subMenu'] = M('menu')->getList([
						'parent_id'=>$item['id'],
						'id in' => explode(',',$_SESSION['privilege'])
					]);

					$leftMenu[] = $item;
				}
				$data['leftMenu'] = $leftMenu;
				$data['parent_id'] = $parent_id;
				return $data;
			},
			//'debug'=>true
		];
	}


	function welcome() {
		echo '控制台';
	}


}
