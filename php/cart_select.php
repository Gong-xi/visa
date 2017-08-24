<?php
/**
*查询指定用户的购物车内容
*请求参数：
  uid-用户ID，必需
*输出结果：
  {
    "uid": 1,
    "data":[
      {"cid":1,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':1},
      {"cid":3,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':3},
      ...
      {"cid":5,"title":"xxx","pic":"xxx","price":1599.00,'courseCount':5}
    ]
  }
*/
@$uid = $_REQUEST['uid'] or die('uid required');

require('init.php');

$output['uid'] = $uid;

$sql = "SELECT ay_cart.ctid,ay_cart.did,ay_cart.dishCount,ay_dish.name,ay_dish.img_sm,ay_dish.price FROM ay_dish,ay_cart WHERE ay_cart.did=ay_dish.did AND ay_cart.userid='$uid'";
$result = mysqli_query($conn,$sql);
$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


echo json_encode($output);
