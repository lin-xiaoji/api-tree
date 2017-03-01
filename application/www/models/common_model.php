<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 公共model
 * Created by
 * Date: 2015/12/15
 */

class Common_model extends CI_Model {

    function __construct(){
        $this->table = "";
    }

    //获取某张表的列表数据
    function getList($where=[],$field='*',$order='',$limit=null){
        $query = $this->db
            ->select($field)
            ->from($this->table);

        foreach ($where as $key=>$item) {
            if(strpos($key,' in')) {
                $query->where_in(current(explode(' ',$key)),$item);
                unset($where[$key]);
            }
        }

        $result = $query
            ->where($where)
            ->order_by($order)
            ->limit($limit)
            ->get()
            ->result_array();

        return $result;
    }

    //获取一行数据
    function getOne($where=[],$field='*',$order=''){
        $result=$this->getList($where,$field,$order,1);
        if($result) {
        	$result = $result[0];
		}
        return $result;
    }

    //快速根据id得到某张表的某个值或某些值
    function getValue($id,$field = ''){
        $result = $this->getOne(['id'=>$id],$field);

        if(count($result) == 1) {
            return $result[$field];
        } else {
            return $result;
        }
    }

    //根据id查找信息
    function find($id){
        $result= $this->getOne(['id'=>$id]);
        return $result;
    }

    //查找记录条数
    function count($where){
        $result= $this->db->from($this->table)->where($where)->count_all_results();
        return $result;
    }


    //添加新数据
    function add($data){

        $this->db->insert($this->table,$data);
        return $this->db->insert_id();
    }

    //修改数据
    function save($data,$where=[]){
        if(!empty($where)){
            return $this->db->where($where)->update($this->table, $data);
        }else{
            return false;
        }
    }

    //删除数据
    function del($where=[]){
        if(!empty($where)){
            return $this->db->where($where)->delete($this->table);
        }else{
            return false;
        }
    }

}