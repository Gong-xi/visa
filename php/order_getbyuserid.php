<?php
/**根据用户id查询订单数据**/
header('Content-Type:application/json');

$output = [];

@$userid = $_REQUEST['userid'];

if(empty($userid)){
    echo "[]"; //若客户端未提交用户id，则返回一个空数组，
    return;    //并退出当前页面的执行
}

//访问数据库
require('init.php');

$sql = "SELECT ay_order.oid,ay_order.userid,ay_order.phone,ay_order.addr,
ay_order.totalprice,ay_order.user_name,ay_order.order_time,
ay_orderdetails.did,ay_orderdetails.dishcount,ay_orderdetails.price,
ay_dish.name,ay_dish.img_sm

 from ay_order,ay_orderdetails,ay_dish
WHERE ay_order.oid = ay_orderdetails.oid and ay_orderdetails.did = ay_dish.did and ay_order.userid='$userid'";
$result = mysqli_query($conn, $sql);

$output['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($output);
?>
