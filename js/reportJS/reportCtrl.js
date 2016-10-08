var reportConfig = angular.module('report', []);

reportConfig.controller('ReportCtrl', function($scope) {
		$scope.reportName = "";
		$scope.f_id = "";
//		打开modal框传值
		$scope.open = function($name,$id) {
			$scope.reportName = $name;
			$scope.f_id = $id;
		}
//		点选行checkbox
		$scope.clickRow = function($cid){
			var checkbox = document.getElementById($cid);
			checkbox.checked = !checkbox.checked;
		}
		
		$scope.flowName="请选择流程模板";
		$scope.selectFlow = function($flowName){
			$scope.flowName = $flowName;
		}
		
		$scope.cbclick = function($cid){
			var checkbox = document.getElementById($cid);
			checkbox.checked = !checkbox.checked;
		}

	})