<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends Common {
	function index() {
		$post = $this->post();
		$username = $post['username'];
		$password = md5(md5($post['password']).'DDEWWD');

		$item = M("user")->getOne(['username'=>$username,'password'=>$password]);
		if($item) {
			$_SESSION['user_id'] = $item['id'];
			$_SESSION['username'] = $item['username'];
			$this->success($username);
		} else {
			$this->error('帐号或密码错误');
		}
	}

	function reg() {
		$post = $this->post();
		$username = $post['username'];
		$password = md5(md5($post['password']).'DDEWWD');
		$exist = M("user")->getOne(['username'=>$username]);
		if ($exist) {
			$this->error('帐号已存在');
		} else {
			$id = M("user")->add([
				'username'=>$username,
				'password'=>$password,
			]);
			$_SESSION['user_id'] = $id;
			$_SESSION['username'] = $username;
			$this->success($username);
		}

	}


	function isLogin() {
		if(isset($_SESSION['user_id'])) {
			$this->success();
		} else {
			$this->error();
		}
	}


}
