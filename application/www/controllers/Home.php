<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends Common {
	function __construct() {
		parent::__construct();

		echo  md5(md5('lxj201532').'DDEWWD');
	}
	function fileList() {
		echo  'sss';
	}



}
