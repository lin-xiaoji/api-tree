<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {
	public function __construct() {
		parent::__construct();


	}

	function index() {

		$this->view->display('login/index');
	}


	function login() {
		$post = $this->input->post();
		$username=$post['username'];
		$password=md5(md5($post['password'])."DI389K23K21K403L2GS2");

		$item = $this->db
				->from('member')
				->where(['username'=>$username,'password'=>$password])
				->get()
				->row_array();
		if($item) {
			$_SESSION['loginId'] = $item['id'];
			$_SESSION['loginName'] = $item['username'];
			$memberGroup = $this->db
					->from('member_group')
					->where(['id'=>$item['group_id']])
					->get()
					->row_array();
			$_SESSION['privilege'] = $memberGroup['privilege'];
			echo 'ok';
		} else {
			echo '帐号或密码错误';
		}
	}

}
