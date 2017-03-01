<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 扩展CI的CI_Controller类
 */
class MY_Controller extends CI_Controller {



}

class Common extends MY_Controller {
	public function __construct() {
		parent::__construct();
		error_reporting(E_ERROR);

		//验证登陆
		session_start();
		if(!$_SESSION['loginId']) {
			header("Location:/login");
			exit();
		}
		$this->member_id = $_SESSION['loginId'];

		//验证操作权限，暂时只支持到controller,需要控制action后面再扩展
		$where = [];
		$controller = $this->router->class;
		if(!in_array($controller,['home','main'])) {
			$where['controller'] = $controller;
		}
		if(!empty($where)) {
			$menu = $this->db
					->from('menu')
					->where($where)
					->get()
					->row_array();
			if($menu and in_array($menu['id'],explode(',',$_SESSION['privilege']))) {
				//'有权限';
			} else {
				//无权限
				$this->error('您无操作权限！');
			}
		}

	}


	function display($view='',$data=[]) {
		if(is_array($view)){
			$data = $view;
			$view = $this->router->fetch_class()."/".$this->router->fetch_method();
		} elseif (empty($view)) {
			$view = $this->router->fetch_class()."/".$this->router->fetch_method();
		}
		$this->view->assign($data);
		$this->view->display($view);
	}


	//保存成功，关闭弹窗
	function saveOk() {
		echo '<script>
var $ = parent.layui.jquery;
$(".layui-show iframe").attr("src",$(".layui-show iframe").attr("src"));
var index = parent.layui.layer.getFrameIndex(window.name);
parent.layui.layer.close(index);
</script>';
		exit();
	}

	function error($msg) {
		echo "<h3>{$msg}</h3>";
		die;
	}
}


/**
 * 数据库基本增删查改
 */
class Curd extends Common  {
	protected $conf = [1,2];
	protected $tableName = '';

	public function __construct() {
		parent::__construct();
		$this->tableName = $this->router->class;

	}




	/**
	 * 列表页
	 * @return string
	 */
	function index() {
		$get = $this->input->get();
		$data = [];

		//开始钩子函数
		if($this->conf['index']['startFunc']) {
			$data = $this->conf['index']['startFunc']();
		}

		//额外数据|二维数组
		if($this->conf['index']['extraData']) {
			$extraData = $this->extraData($this->conf['index']['extraData']);
			$data = array_merge($data,$extraData);
		}


		//自定义表名
		if($this->conf['index']['tableName']) {
			$this->tableName = $this->conf['index']['tableName'];
		}

		$query= $this->db->from($this->tableName);



		//搜索条件 | 一维无键值数组
		if($this->conf['index']['search']) {
			$search = $this->conf['index']['search'];
			foreach ($search as $value) {
				$arr = explode('|',$value);
				$searchField = $arr[0];
				$searchType = $arr[1];
				if(!$searchType) $searchType = '=';
				if($get[$value] or $get[$value] === '0') {
					$query->where($searchField.' '.$searchType,$get[$value]);
				}
			}
		}




		//where  | 一维有键值数组
		if($this->conf['index']['where']) {
			$query->where($this->conf['index']['where']);
		}
		//where_in  | 一维有键值数组
		if($this->conf['index']['where_in']) {
			$query->where_in($this->conf['index']['where_in']);
		}

		//join | 二维数组
		if($this->conf['index']['join']) {
			foreach ($this->conf['index']['join'] as $item) {
				$query->join($item[0],$item[1]);
			}
		}



		//field
		if($this->conf['index']['field']) {
			$query->select($this->conf['index']['field']);
		}

		//order
		if($this->conf['index']['order']) {
			$query->order_by($this->conf['index']['order']);
		}


		//pageSize
		if($this->conf['index']['pageSize'] != 'all') {
			$pageSize = $this->conf['index']['pageSize'];
			if(empty($pageSize)){
				$pageSize = 10;
			}
			$page = $get['page'];
			if($page<=0) $page = 1;
			$query->limit($pageSize,($page-1)*$pageSize);

			//总页数
			$totle = $query->count_all_results(null,false);
			$pages = ceil($totle/$pageSize);
			$data['pages'] = $pages;
		}



		$list = $query->get()->result_array();



		//循环处理的钩子
		if($this->conf['index']['itemFunc']) {
			$listTmp = [];
			foreach ($list as $item) {
				$listTmp[] = $this->conf['index']['itemFunc']($item);
			}
			$list = $listTmp;
		}

		$data['list'] = $list;


		//view
		if($this->conf['index']['view']) {
			$view = $this->conf['index']['view'];
		}


		//结束钩子函数
		if($this->conf['index']['endFunc']) {
			$data = $this->conf['index']['endFunc']($data);
		}

		if($this->conf['index']['debug']) {
			echo $query->last_query()."<br >";
			print_r($data);
		}


		$this->display($view,$data);
	}



	/**
	 * 添加和修改数据的公共处理方法
	 * @return string
	 */
	function edit() {
		//自定义表名
		if($this->conf['edit']['tableName']) {
			$this->tableName = $this->conf['edit']['tableName'];
		}

		//保存
		if($_SERVER['REQUEST_METHOD'] == 'POST') {
			$post = $this->input->post();
			//开始钩子函数
			if($this->conf['save']['startFunc']) {
				$post = $this->conf['save']['startFunc']($post);
			}

			//保存数据
			$id = $post['id'];
			if ($id) {
				M($this->tableName)->save($post,['id'=>$id]);
			} else {
				$id = M($this->tableName)->add($post);
			}


			//结束钩子函数
			if($this->conf['save']['endFunc']) {
				$this->conf['save']['endFunc']($id);
			}


			$this->saveOk();
		}


		//表单信息--------------------


		$id = $this->input->get('id');
		$data = [];
		//开始钩子函数
		if($this->conf['edit']['startFunc']) {
			$data = $this->conf['edit']['startFunc']();
		}

		//额外数据
		if($this->conf['edit']['extraData']) {
			$extraData = $this->extraData($this->conf['edit']['extraData']);
			$data = array_merge($data,$extraData);
		}

		$data['item']= M($this->tableName)->find($id);


		//自定义模板文件
		if($this->conf['edit']['view']) {
			$view = $this->conf['edit']['view'];
		}
		//结束钩子函数
		if($this->conf['edit']['endFunc']) {
			$data = $this->conf['edit']['endFunc']($data);
		}

		$this->display($view,$data);
	}



	/**
	 * 删除
	 * @return string
	 */
	function del(){
		$id = $this->input->get('id');
		//开始钩子函数
		if($this->conf['del']['startFunc']) {
			$this->conf['del']['startFunc']($id);
		}
		if(M($this->tableName)->del(['id' => $id])){
			echo 'ok';
		} else {
			echo '删除失败';
		}
	}


	/**
	 * 获取其它额外数据的函数
	 * @param $config
	 * @return array
	 */
	function extraData($config) {
		$extraData = [];
		foreach($config as $arr){
			if($arr['table']) {
				$extraData[$arr['table']] = $this->db
						->from($arr['table'])
						->select($arr['field'])
						->where($arr['where'])
						->where_in($arr['where_in'])
						->order_by($arr['order'])
						->limit($arr['limit'])
						->get()
						->result_array();
			}
		}
		return $extraData;
	}


}
// END MY_input Class

/* End of file MY_Controller.php */
/* Location: ./system/libraries/MY_Controller.php */
