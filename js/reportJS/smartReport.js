var jsonStr = $("textarea").html();
var report = angular.module('app', []);
report.controller('reportCtrl', function($scope) {
	//表格初始化
	$scope.jsonStr = jsonStr;
	var tables = angular.fromJson($scope.jsonStr);
	$scope.tables = tables;
	$scope.colArr = SSheet.colName(SSheet.colArr(tables));
//	$scope.mywidth = [{"width":"20%"},{"width":"60%"},{"width":"20%"}];

	//鼠标单击事件  console.log("cool"); ------------------------------>>鼠标对表格单击事件<<------------------
	$scope.mousedown = function(e) {

			if(e.which == 1 || e.which == 3) {
				if($(e.target).is('div')) {
					var div = e.target;
					var td = $(div).parent();
					//点击框
					$("td").removeClass("current");
					$(td).addClass("current");

				} else {
					var td = e.target || e.srcElement;
					//点击框
					$("td").removeClass("current");
					$(td).addClass("current");
				}

			}

		} //end of mousedown

	//触发弹框
	var selectArr = []; //复选框选择的值
	$scope.dclick = function(e) {
		selectArr = [];
		//赋值
		var div;
		var selectVal = "";
		if($(e.target).is('div')) {
			div = $(e.target);
			selectVal = div.html();
		} else {
			var td = $(e.target);
			div = td.find('div');
			selectVal = div.html();
		}
		$scope.selectValue = selectVal.replace(/\<br>/g, ";");

		$scope.tableIndex = div.parent().parent().parent().parent().attr("id");
		$scope.rowIndex = div.parent().parent().attr("id");
		$scope.colIndex = div.parent().attr("id");
		$scope.tableId = $scope.tables[$scope.tableIndex].table_id;

		//打开模态框
		$('#selectValueModel').modal('toggle');
		//清空所有checkbox
		var el = $('#selectValueModel').find('input');
		var len = el.length;
		for(var i = 0; i < len; i++) {
			if(el[i].type == "checkbox") {
				el[i].checked = false;
			}
		}

	}

	//确定按钮
	$scope.submitValue = function(e) {
		$scope.tables[$scope.tableIndex].content[$scope.rowIndex].value[$scope.colIndex] = $scope.selectValue;
	}

	$scope.cleanValue = function() {
		$scope.selectValue = "";
	}

	//复选框
	$scope.clickedCheckbox = function(e) {
		$scope.selectValue = "";
		var ckb_id = $(e.target).attr('checkbox-id');
		//判断是否有值在里面
		var state = true;
		for(var i = 0; i < selectArr.length; i++) {
			var dic = selectArr[i];
			if(ckb_id == dic.id) {
				selectArr.splice(i, 1);
				state = false;
			}
		}
		if(state) {
			var dict = {
				"id": ckb_id,
				"value": $(e.target).parent().text()
			};
			selectArr.push(dict);
		}

		for(var i = 0; i < selectArr.length; i++) {
			var dic = selectArr[i];
			$scope.selectValue += dic.value + ";";
		}

	}

	//点击打开关联框
	$scope.opensub = function() {
		$('#modal2').modal('toggle');
	}

	//右键菜单
	$(function() {
		$.contextMenu({
			selector: '.context-menu-one',
			callback: function(key, options) {
				var m = "clicked: " + key;
				//				window.console && console.log(m) || console.log($(this).html());
				switch(key) {
					case 'uprow':
						{
							//先确认是第几个表格
							var index = $(this).parent().parent().parent().attr("id");
							//再次确认是第几行
							var rowIndex = $(this).parent().attr("id");
							if(typeof(rowIndex) == "undefined") {
								alert("亲，已经是最顶行了");
								break;
							}
							//判断有多少列
							var colNum = SSheet.colArr($scope.tables)[index];
							var val = [];
							for(var i = 0; i < colNum; i++) {
								val.push("/");
							}
							var newContent = {
								"value": val
							};
							$scope.tables[index].content.insert(parseInt(rowIndex), newContent);
							$scope.$digest();
						}
						break;
					case 'downrow':
						{
							//更新头部合并单元格的方法
							//$scope.colArr = SSheet.colName(SSheet.colArr($scope.tables));

							//先确认是第几个表格
							var index = $(this).parent().parent().parent().attr("id");
							//再次确认是第几行
							var rowIndex = $(this).parent().attr("id");
							//判断有多少列
							var colNum = SSheet.colArr($scope.tables)[index];
							var val = [];
							for(var i = 0; i < colNum; i++) {
								val.push("/");
							}
							var newContent = {
								"value": val
							};
							$scope.tables[index].content.insert(parseInt(rowIndex) + 1, newContent);
							$scope.$digest();
						}
						break;
					case 'leftcol':
						{
							//先确认是第几个表格
							var index = $(this).parent().parent().parent().attr("id");
							//确定第几列
							var colIndex = $(this).attr("id");
							if(typeof(colIndex) == "undefined") {
								alert("亲，这已经是最边缘了");
								break;
							}
							//重写入宽度值
							//先获取表的总宽度及每个cell的宽度
							var table = document.getElementsByTagName('table')[index];
							var cells = table.rows[0].cells;
							var total = 0;
							for(var i=1; i<cells.length;i++){
								total += cells[i].offsetWidth;
							}
							//计算出百分比
							var tdwidth=[];
							var maxWidth=0;
							var maxIndex=0;
							for(var i=1;i<cells.length;i++){
								var cellwidth = (cells[i].offsetWidth/total)*100;
								tdwidth.push(cellwidth.toFixed(2));
								if(cellwidth>maxWidth){
									maxWidth = cellwidth.toFixed(2);
									maxIndex=i-1;
								}
							}
							console.log(maxWidth*0.8);
							tdwidth.changeItem(maxIndex,maxWidth*0.8);
							tdwidth.insert(parseInt(colIndex),maxWidth*0.2);
							console.log(toString(tdwidth));
							//写入列值
							var table = $scope.tables[index];
							for(var i = 0; i < table.content.length; i++) {
								var arr = table.content[i].value;
								var newStr = "/";
								$scope.tables[index].content[i].value.insert(parseInt(colIndex), newStr);
							}
							$scope.colArr = SSheet.colName(SSheet.colArr($scope.tables));
							$scope.tables[index].tdWidth = tdwidth;
							$scope.$digest();
							
							
							
							
						}
						break;
					case 'rightcol':
						{
							//先确认是第几个表格
							var index = $(this).parent().parent().parent().attr("id");
							//确定第几列
							var colIndex = $(this).attr("id");
							var table = $scope.tables[index];
							for(var i = 0; i < table.content.length; i++) {
								var arr = table.content[i].value;
								var newStr = "/";
								$scope.tables[index].content[i].value.insert(parseInt(colIndex) + 1, newStr);
							}
							$scope.colArr = SSheet.colName(SSheet.colArr($scope.tables));
							
							
							$scope.$digest();
						}
						break;
					case 'deleterow':
						{
							//先确认是第几个表格
							var index = $(this).parent().parent().parent().attr("id");
							//再次确认是第几行
							var rowIndex = $(this).parent().attr("id");
							$scope.tables[index].content.splice(parseInt(rowIndex), 1);
							$scope.$digest();

						}
						break;
					case 'deletecol':
						{
							//先确认是第几个表格
							var index = $(this).parent().parent().parent().attr("id");
							//确定第几列
							var colIndex = $(this).attr("id");
							var table = $scope.tables[index];
							for(var i = 0; i < table.content.length; i++) {
								var arr = table.content[i].value;
								var newStr = "/";
								$scope.tables[index].content[i].value.splice(parseInt(colIndex), 1);
							}
							$scope.colArr = SSheet.colName(SSheet.colArr($scope.tables));
							$scope.$digest();

						}
						break;
					default:
						{
							alert("系统出错了...");
						}
				}
			},
			items: {
				"uprow": {
					name: "在上面添加行",
					icon: ""
				},
				"downrow": {
					name: "在下面添加行",
					icon: ""
				},
				"sep1": "---------",
				"leftcol": {
					name: "在左边添加列",
					icon: ""
				},
				"rightcol": {
					name: "在右边添加列",
					icon: ""
				},
				"sep2": "---------",
				"deleterow": {
					name: "删除整行",
					icon: ""
				},
				"deletecol": {
					name: "删除整列",
					icon: ""
				}
			}
		});

	}); //end of 右键菜单

	//加载拖拽DIV功能
	$(function(){
		var dragNum = 0;
		for(var i = 0; i < $scope.colArr.length; i++) {
			dragNum += $scope.colArr[i].length;
		}

		for(var i = 0; i < dragNum; i++) {
			drag(document.getElementsByClassName('resizeDivClass')[i]);
		}
	});

	//表格宽度拖拽
	var drag = function(o, r) {
			o.p_p_c_gw = function(index) /*取得o.parentNode.parentNode.cells的宽度，兼容IE6和Firefox*/ {
				if(window.ActiveXObject) {
					return o.parentNode.parentNode.cells[o.parentNode.cellIndex + index].offsetWidth;
				} else {
					return parseInt(o.parentNode.parentNode.cells[o.parentNode.cellIndex + index].offsetWidth) -
						parseInt(o.parentNode.parentNode.parentNode.parentNode.cellPadding) * 2 - 2;
				}
			}

			o.p_p_p_sw = function(index, w) /*设置所有行的第index个单元格为w，在IE下可只设第一行*/ {
				w = w + "px";
				for(var i = 0; i < o.parentNode.parentNode.parentNode.parentNode.rows.length; i++) {
					o.parentNode.parentNode.parentNode.parentNode.rows[i].cells[index].style.width = w;
				}
			}

			//	var out = document.getElementById('my');

			o.firstChild.onmousedown = function() {
				return false;
			};
			o.onmousedown = function(a) {
				var d = document;
				if(!a) a = window.event;
				var lastX = a.clientX;
				var watch_dog = o.p_p_c_gw(0) + o.p_p_c_gw(1); //有时候拖拽过快表格会变大，至于为什么会这样我也不清楚。watch_dog是为了保证表格不会变大，
				if(o.setCapture)
					o.setCapture();
				else if(window.captureEvents)
					window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
				// 
				d.onmousemove = function(a) {
					if(!a) a = window.event;
					if(o.p_p_c_gw(0) + o.p_p_c_gw(1) > watch_dog) {
						o.p_p_p_sw(o.parentNode.cellIndex + 1, watch_dog - o.p_p_c_gw(0));
						return;
					}
					var t = a.clientX - lastX;
					//			out.innerHTML = t;
					if(t > 0) { //right 
						if(parseInt(o.parentNode.parentNode.cells[o.parentNode.cellIndex + 1].style.width) - t < 10)
							return;
						o.p_p_p_sw(o.parentNode.cellIndex, o.p_p_c_gw(0) + t);
						o.p_p_p_sw(o.parentNode.cellIndex + 1, o.p_p_c_gw(1) - t);
					} else { //left 
						if(parseInt(o.parentNode.parentNode.cells[o.parentNode.cellIndex].style.width) + t < 10)
							return;
						o.p_p_p_sw(o.parentNode.cellIndex, o.p_p_c_gw(0) + t);
						o.p_p_p_sw(o.parentNode.cellIndex + 1, o.p_p_c_gw(1) - t);
					}
					lastX = a.clientX;
				};
				d.onmouseup = function() {
					if(o.releaseCapture)
						o.releaseCapture();
					else if(window.captureEvents)
						window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					d.onmousemove = null;
					d.onmouseup = null;
				};
			};
		} //end of 表格拖拽

});
//HTML化
report.filter('trustHtml', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
});

//分号转换行符
report.filter('replaceCode', function() {
	return function(val) {
		if(!val) val = '';
		return val.replace(/\;/g, '<br/>');
	}
});

//数组转换逗号隔开的字符串
var toString = function(target) {
	return Object
		.keys(target)
		.map(function(key) {
			var val = target[key];
			if(typeof val === 'object') {
				return toString(val);
			}
			return val;
		})
		.join(',');
};

Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};
//replace
Array.prototype.changeItem = function(index, item) {
	this.splice(index, 1);
	this.splice(index, 0, item);
};

//初始化
var SSheet = {
	colName: function(arr) {
		var nameArr = [];
		var _A_code = "A".charCodeAt();
		//		console.log(String.fromCharCode(_A_code + 1));
		for(var i = 0; i < arr.length; i++) {
			var len = arr[i];
			var charArr = [];
			for(var j = 0; j < len; j++) {
				var chr = String.fromCharCode(_A_code + j);
				charArr[j] = chr;
			}
			nameArr[i] = charArr;
		}

		return nameArr;
	},
	colArr: function(tables) {
		//计算列数
		var colArr = [];
		for(var i = 0; i < tables.length; i++) {
			var table = tables[i];
			var len = 0;
			for(var j = 0; j < table.content.length; j++) {
				var content = table.content[j];
				if(len < content.value.length) {
					len = content.value.length;
				}
			}
			colArr[i] = len;
		}

		return colArr;
	}
}