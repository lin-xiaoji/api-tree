<?php
if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * 公共辅助函数
 *
 * Created by xiaoji.lin.
 *
 */


//获取公共model，来操作数据库
function M($table){
    $CI =& get_instance();
    $CI->common_model->table = $table;

    return $CI->common_model;
}
