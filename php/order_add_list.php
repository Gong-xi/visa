<?php
 //16:50--17:00
 //1:修改响应头格式json
 //2:创建数据库连接 设置编码
 header("content-type:application/json;charset=utf-8");
 require("init.php");
 @$ph=$_REQUEST['phone'];
 @$un=$_REQUEST['user_name'];
 @$sex=$_REQUEST['sex'];
 @$addr=$_REQUEST['addr'];
 @$did=$_REQUEST['did'];
 $sql = "INSERT INTO ay_order VALUES(null,'$ph','$un',$sex,now(),'$addr',$did)";
 //4:向数据库输入
 $result = mysqli_query($conn,$sql);
 $id = mysqli_insert_id($conn);
 if($result){
	$list=["code"=>1,"msg"=>"订单成功","id"=>$id];}
 else{$list=["code"=>-1,"msg"=>"订单未下订成功"];}
 echo json_encode($list);
 ?>