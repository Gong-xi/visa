//创建并使用模块
var app = angular.module("ay_visa", ["ng","ionic"]);
//自定义服务
//    配置状态
app.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider){
    //设置无论在那种手机设备上tabs都是在最底部展示
    $ionicConfigProvider.tabs.position('bottom');
    $stateProvider.state("detail",{
        url:"/detail/:id",
        templateUrl:"tpl/detail.html",
        controller:"detailCtrl"
    })
        .state("main",{
            url:"/main",
            templateUrl:"tpl/main.html",
            controller:"mainCtrl"
        })
        .state("myOrder",{
            url:"/myOrder",
            templateUrl:"tpl/myOrder.html",
            controller:"myOrderCtrl"
        })
        .state("cart",{
            url:"/cart",
            templateUrl:"tpl/cart.html",
            controller:"cartCtrl"
        })
        .state("order",{
            url:"/order/:did",
            templateUrl:"tpl/order.html",
            controller:"orderCtrl"
        })
        .state("start",{
            url:"/start",
            templateUrl:"tpl/start.html"
        });
    //处理特殊情况路径
    $urlRouterProvider.otherwise("/start");
});
//全局设置请post求头
app.run(function($http){
    $http.defaults.headers.post = {
        'Content-Type':
            'application/x-www-form-urlencoded'
    }}
);
//创建父控制器实现页面跳转,并传参。
app.controller("parentCtrl", ["$scope","$state",function($scope,$state){
    $scope.jump=function(stateName,params){
       $state.go(stateName,params);
   }
}]);
////main页面控制器
app.controller("mainCtrl", ["$scope","$http",function($scope,$http){
   $scope.list=[];
    //默认向下拉加载，并且默认文字不显示
    $scope.hasMore=true;
    $scope.exist=true;
    var page=5;
    //初始化用户id为1
    sessionStorage["uid"]=1;
    //创建异步添加函数
    function use(p){
        //发送异步请求
        $http.get("php/dish_getbypage.php?end="+p).success(function(data){
            $scope.list=data;
            //如果加载完成，取消向下拉页面的标签，并且默认文字显示出来
            if(p>data.length){
                $scope.hasMore=false;
                $scope.exist=false;
            }
            //用事件的方式通知滚动完成
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }
    //直接调用，异步添加
    use(page);
    //点击按钮添加更多
    $scope.add=function(){
        page+=5;
       use(page);
    };
    //搜索查询,注意监听关键字的时候，要先将其封装在一个对象中，html文件中也要
    $scope.inputTxt={kw:""};
    $scope.select=function(){
        //发送异步请求
        $http.get("php/dish_getbykw.php?kw="+$scope.inputTxt.kw).success(function(data){
            $scope.list=data;
        });
    };
}]);
////myOrder页面控制器
app.controller("myOrderCtrl", ["$scope","$http",function($scope,$http){
    var uid=sessionStorage["uid"];
    console.log(uid);
    //发送异步get请求
    $http.get("php/cart_select.php?uid="+uid).success(function(result){
        console.log(result);
        $scope.list=result.data;
    });
    }]);
////detail页面控制器
app.controller("detailCtrl", ["$scope","$http","$ionicPopup","$stateParams",function($scope,$http,$ionicPopup,$stateParams){
    //获取产品id
    $scope.sid=$stateParams.id;
    $scope.addToCart=function(){
        $http.get("php/cart_update.php?uid="+sessionStorage['uid']+"&did="+$scope.sid+"&count=-1").success(function(data){
            console.log(data);
            //  将添加都购物车的结果弹窗显示
            $ionicPopup.alert({
                template: '添加到购物车成功'
            })
        });
    };
    //发送异步get请求
    $http.get("php/dish_getbyid.php?id="+$scope.sid).success(function(data){
        $scope.list=data;
    });
}]);
//order页面控制器
app.controller("orderCtrl", ["$scope","$http","$stateParams","$httpParamSerializerJQLike",function($scope,$http,$stateParams,$httpParamSerializerJQLike){
    var did=$stateParams.did;
    //注意在用ng-model视图向模型数据传递的时候要用对象的方式传递
    $scope.input={name:"",phone:"",sex:"",addr:""};
    //点击提交
    $scope.order=function(){
        var user =
    {user_name:$scope.input.name,phone:$scope.input.phone,sex:$scope.input.sex,addr:$scope.input.addr,did:did};
        console.log(user);
        sessionStorage["tel"]=$scope.input.phone;
        //通过post方式的内置序列化服务，将对象转为字符串参数拼接
        var result =
        $httpParamSerializerJQLike(user);
        //发送异步post请求
    $http.post("php/order_add_list.php",result).success(function(data){
        if(data.code>0){$scope.success="订单成功，您的订单编号："+data.id+"您可以在用户中心查看订单状态";}
        else{alert(data.msg)}
    })
    }}]);
//cart页面控制器
app.controller("cartCtrl", ["$scope","$http",function($scope,$http){
    $scope.editEnable=false;
    $scope.editText="编辑";
    $scope.toggleEdit=function(){
        if($scope.editEnable){
            $scope.editEnable=false;
            $scope.editText="完成";}
        else{
            $scope.editEnable=true;
            $scope.editText="编辑";}
    };
    //页面一加载，就异步请求数据
    $http.get("php/cart_select.php?uid="+sessionStorage["uid"]).success(function(result){
            console.log(result);
            $scope.cart=result.data;
    });
    //编辑按钮，更新数据库中的数据，绑定cart_update.php
    $scope.updateToServer=function(did,count){
        $http.get("php/cart_update.php?uid="+sessionStorage["uid"]+"&did="+did+"&count="+ count).success(function (data) {
                //$scope.data.totalNumInCount = 0;
                //angular.forEach($scope.cart, function (value, key) {
                //    $scope.data.totalNumInCount+= parseInt(value.dishCount);
                //})
            })
        };
        //加号点击触发函数
        $scope.add = function (index) {
            $scope.hasChange = true;
            $scope.cart[index].dishCount++;
            $scope.updateToServer($scope.cart[index].did, $scope.cart[index].dishCount);
        };
    //减号点击促发函数
        $scope.delete = function (index) {
            $scope.hasChange = true;
            var num = $scope.cart[index].dishCount;
            num--;
            if (num <= 0) {
                num = 1;
            }
            else {
                $scope.cart[index].dishCount = num;
                $scope.updateToServer($scope.cart[index].did, $scope.cart[index].dishCount);
            }
        };
    }]);
