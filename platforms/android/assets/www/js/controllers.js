angular.module('starter.controllers', [])

.controller('ListCtrl', ['$rootScope','$scope','$ionicModal','$cordovaNetwork','$window','$ionicPopup','$ionicLoading','$timeout',function($rootScope,$scope,$ionicModal,$cordovaNetwork,$window,$ionicPopup,$ionicLoading,$timeout) {
	//设备准备状态（使用cordova时要）
	document.addEventListener("deviceready", function () {
		//用于判断逻辑
		$scope.flag = {};
		//模拟数据
		$scope.items = [
			{
				name:'小红',
				age:'14',
				sex:'woman',
				interest:{
					basketball:true,
					badminton:false,
					soccer:true,
					swim:false
				}
			},
			{
				name:'小明',
				age:'18',
				sex:'man',
				interest:{
					basketball:true,
					badminton:true,
					soccer:false,
					swim:true
				}
			}
		];
	    //要新添加的对象
		$scope.temp = {
			
		};
		//模态框
		$ionicModal.fromTemplateUrl('templates/addModal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		}).then(function(modal) {
		    $scope.modal = modal;
		});
		//打开模态框
		$scope.openModal = function(){
			//判断是否有本地保存的对象，如果有，直接填充表单
			if($window.localStorage.unSaveObj){
				$scope.temp = angular.fromJson($window.localStorage.unSaveObj);
				$window.localStorage.clear();
			}
			$scope.modal.show();
		};
		//关闭模态框
		$scope.closeModal = function(){
			$scope.modal.hide();
		};
		//删除列表对象
		$scope.delete_item = function(item){
			var idx = $scope.items.indexOf(item);
			$scope.items.splice(idx,1);
		};
		//编辑对象
		$scope.edit_item = function(item){
			$scope.temp = item;
			$scope.modal.show();
		};
		//添加对象到列表
		$scope.add_item = function(){
			//先判断是否有属性不为空再决定是否保存
			var hasPro = false;
			for(index in $scope.temp){
				hasPro = true;
				break;
			}
			if(hasPro){
				var onLine = $cordovaNetwork.isOnline();
				if(onLine){
					//显示载入指示器
					$ionicLoading.show({
						template: "<ion-spinner icon='android' class='spinner-positive'></ion-spinner>"
					});
					//延时三秒模拟保存的耗时行为
					$timeout(function(){
						//在线状态,直接添加
						$scope.items.push($scope.temp);
						//清空对象
					    $scope.temp = {};
					    //关闭指示器
						$ionicLoading.hide();
						//关闭模态框
						$scope.modal.hide();
					},3000);
				}else{
					//离线状态,使用H5本地存储
				   	$ionicPopup.confirm({
				     	title: '提示',
				     	template: '您当前是离线环境，是否把表单保存到本地?'
				   	}).then(function(res) {
				     	if(res) {
				     		//显示载入指示器
							$ionicLoading.show({
								template: "<ion-spinner icon='android' class='spinner-calm'></ion-spinner>"
							});
							//延时三秒模拟保存的耗时行为
							$timeout(function(){
					     		//H5本地存储功能（必须先把对象转换为字符串）
					       		$window.localStorage.unSaveObj = angular.toJson($scope.temp);
					       		//清空对象
					       		$scope.temp = {};
					       		//关闭指示器
								$ionicLoading.hide();
					       		//关闭模态框
								$scope.modal.hide();
							},3000);
				     	} else{
				     		return false;
				     	}
					});
				}
			}else{
				$ionicPopup.alert({
				     title: '警告!',
				     template: '对象为空'
				});
			}
		};
	//deviceready结束
  	}, false);
}])

.controller('LoginCtrl', ['$scope','$state','$ionicPopup',function($scope,$state,$ionicPopup) {
	$scope.login = function(){
	  	var username = document.getElementsByName('username')[0].value;
	  	var password = document.getElementsByName('password')[0].value;
	  	if(username=='admin'&&password=='admin'){
	  		$state.go("list");
	  	}else{
	  		$ionicPopup.alert({
	  			title: '登录失败', 
			  	template: '<b style="font-size:16px;">用户名或密码不正确</b>', 
			  	okText: '确定'
	  		});
	  	}
	}
}]);
