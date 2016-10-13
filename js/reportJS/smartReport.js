var jsonStr = $("#data_table").html();
var sampleStr = $("#data_sample").html();
var report = angular.module('app', ['ui.sortable']);
report.controller('reportCtrl', function($scope) {
	//表格初始化
	var tables = angular.fromJson(jsonStr);
	var colArr = SSheet.colName(SSheet.colArr(tables));
	for(var i = 0; i < tables.length; i++) {
		var table = tables[i];
		table.colChr = colArr[i];
	}
	$scope.tables = tables;
	//样品初始化
	var samples = angular.fromJson(sampleStr);
	var colArr = SSheet.colName(SSheet.colArr(samples));
	for(var i = 0; i < samples.length; i++) {
		var sample = samples[i];
		sample.colChr = colArr[i];
	}

	//鼠标单击事件  console.log("cool"); ------------------------------>>鼠标对表格单击事件<<------------------
	$scope.mousedown = function(e) {
			var selectVal = "";
			if(e.which == 1 || e.which == 3) {
				if($(e.target).is('div')) {
					var div = e.target;
					var td = $(div).parent();
					//点击框
					$("td").removeClass("current");
					$(td).addClass("current");
					selectVal = $(div).html();
				} else {
					var td = e.target || e.srcElement;
					//点击框
					$("td").removeClass("current");
					$(td).addClass("current");
					var div = $(td).find('div');
					selectVal = div.html();
				}
			}
			$scope.selectValue = selectVal.replace(/\<br>/g, ";");

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
							var colNum = $scope.tables[index].colChr.length;
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
							var colNum = $scope.tables[index].colChr.length;
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

							//写入列值
							var table = $scope.tables[index];
							for(var i = 0; i < table.content.length; i++) {
								var arr = table.content[i].value;
								var newStr = "/";
								$scope.tables[index].content[i].value.insert(parseInt(colIndex), newStr);
							}
							var colArr = SSheet.colName(SSheet.colArr($scope.tables));
							for(var i = 0; i < $scope.tables.length; i++) {
								$scope.tables[i].colChr = colArr[i];
								console.log($scope.tables[i].colChr);
							}
							//							$scope.tables[index].tdWidth = SSheet.tdWidth(index, colIndex, 0);
							$scope.$digest();
							loadDrag();
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
							var colArr = SSheet.colName(SSheet.colArr($scope.tables));
							for(var i = 0; i < $scope.tables.length; i++) {
								$scope.tables[i].colChr = colArr[i];
								console.log($scope.tables[i].colChr);
							}
							//							$scope.tables[index].tdWidth = SSheet.tdWidth(index, colIndex + 1, 1);
							$scope.$digest();
							loadDrag();
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
							var colArr = SSheet.colName(SSheet.colArr($scope.tables));
							for(var i = 0; i < $scope.tables.length; i++) {
								$scope.tables[i].colChr = colArr[i];
								console.log($scope.tables[i].colChr);
							}
							$scope.tables[index].tdWidth = SSheet.tdWidth(index, colIndex, 2);
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

	//加载拖拽DIV设置表格宽度功能
	var loadDrag = function() {
		var dragNum = 0;
		for(var i = 0; i < $scope.tables.length; i++) {
			if($scope.tables[i].colChr != null) {
				dragNum += $scope.tables[i].colChr.length;
			}
		}
		for(var i = 0; i < dragNum; i++) {
			drag(document.getElementsByClassName('resizeDivClass')[i]);
		}
	};

	$(function() {
		loadDrag();
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
				d.onmouseup = function(e) {
					if(o.releaseCapture)
						o.releaseCapture();
					else if(window.captureEvents)
						window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
					d.onmousemove = null;
					d.onmouseup = null;
					//把尺寸写入数组
					var tr = e.target.parentNode.parentNode;
					var index = $(e.target).parent().parent().parent().parent().attr("id");
					var tdwidth = [];
					for(var i = 1; i < tr.cells.length; i++) {
						var width = parseInt(tr.cells[i].offsetWidth) - 2;
						tdwidth.push(width);
					}
					$scope.tables[index].tdWidth = tdwidth;
				};
			};
		} //end of 表格拖拽

	//右边栏的数据
	var originalDraggables = [{
		title: '标题',
		type: "label",
		tdWidth: [],
		content: []
	}, {
		title: '文本框',
		type: 'textarea'
	}, {
		title: "表格",
		qrImage: "",
		tdWidth: [],
		colChr: ['A', 'B', 'C'],
		type: "table",
		header: "none",
		content: [{
			"value": ["/", "/", "/"]
		}, {
			"value": ["/", "/", "/"]
		}, {
			"value": ["/", "/", "/"]
		}]
	}, {
		title: '图片',
		"URL": "http://58pic.ooopic.com/58pic/14/70/68/34858PIC6sf.jpg",
		"type": "img",
		"tdWidth": [],
		"content": []
	}];
	for(var i = 0; i < samples.length; i++) {
		originalDraggables.push(samples[i]);
	}
	//	$scope.draggables = originalDraggables.map(function(x) {
	//		return [x];
	//	});
	$scope.draggableArray = JSON.parse(JSON.stringify(originalDraggables));

	$scope.changeStatus = function(s) {
		$scope.modalStatus = s;
	}
	$scope.draggableOptions = {
		connectWith: ".sort_list",
		stop: function(e, ui) {
			// if the element is removed from the first container
			//			if(ui.item.sortable.source.hasClass('draggable-element-container') &&
			//				ui.item.sortable.droptarget &&
			//				ui.item.sortable.droptarget != ui.item.sortable.source &&
			//				ui.item.sortable.droptarget.hasClass('sort_list')) {
			// restore the removed item
			//				ui.item.sortable.sourceModel.push(ui.item.sortable.model);
			if($(e.target).hasClass('draggable-element-container') &&
				ui.item.sortable.droptarget &&
				e.target != ui.item.sortable.droptarget[0]) {
					
				$scope.draggableArray = JSON.parse(JSON.stringify(originalDraggables));
				loadDrag();
				loadColSpan();
			}

		}
	};

	//拖拽换位排序
	$scope.sortableOptions = {
			axis: 'y',
			placeholder: "item-list",
			connectWith: ".sort_list",
			handle: '> .myHandle',
			update: function(e, ui) {
				if(ui.item.sortable.model == "can't be moved") {
					ui.item.sortable.cancel();
				}
				loadDrag();
			}
		} //end of 上下拖拽

	//	删除一个模块组件
	$scope.deleteComp = function(index) {
		$scope.tables.splice(index, 1);
		setTimeout(function() {
			loadDrag();
			loadColSpan();
		}, 300);

	}

	//双击打开标题修改框
	$scope.dbclickLabel = function(e) {
		if($(e.target).is('label')) {
			var labelVal = $(e.target).html();
			$scope.labelVal = labelVal;
			$scope.tableIndex = $(e.target).parent().attr("id");
			//打开模态框
			$('#textViewModal').modal('toggle');
		}
	}

	//确定按钮
	$scope.submitLabelValue = function() {
			$scope.tables[$scope.tableIndex].title = $scope.labelVal;
		}
		//	清除按钮
	$scope.cleanLabelValue = function() {
		$scope.labelVal = "";
	}

	//双击打开选择图片
	$scope.dbclickImg = function(e) {
		var result = [{
			title: '图片1',
			img: 'http://img1.dzwww.com:8080/tupian/20160905/89/11391693537493694937.jpg'
		}, {
			title: '图片2',
			img: 'http://dwz.cn/4lY1c3'
		}, {
			title: '图片3',
			img: 'http://img3.imgtn.bdimg.com/it/u=530554461,336189006&fm=21&gp=0.jpg'
		}, {
			title: '图片4',
			img: 'http://img3.cache.netease.com/photo/0279/2014-09-09/A5MMPT5O5S0C0279.jpg'
		}, {
			title: '图片5',
			img: 'http://img3.imgtn.bdimg.com/it/u=530554461,336189006&fm=21&gp=0.jpg'
		}, {
			title: '图片6',
			img: 'http://upload.cbg.cn/2016/1003/1475462213948.jpg'
		}];
		$scope.imgArr = result;
		$scope.tableIndex = $(e.target).parent().attr("id");
		$('#imgViewModal').modal('toggle');
	}

	//确认图片选择
	//	$scope.submitImgValue = function() {
	//
	//	}

	//点选图片事件
	$scope.selectImg = function(e) {
		var src = "";
		if($(e.target).is('a')) {
			var img = $(e.target).find('img');
			src = img[0].src;
		} else {
			var img = $(e.target);
			src = img.context.src;
		}
		$scope.tables[$scope.tableIndex].URL = src;
		$('#imgViewModal').modal('hide');

		console.log($scope.tables);

	}

}); //end of controller

//HTML化 过滤器
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
	},
	//重写入宽度值 
	//index:第几个表格
	//colIndex:第几列
	//s:0=左边，1=右边，2=删除
	tdWidth: function(index, colIndex, s) {
		//先获取表的总宽度及每个cell的宽度
		var table = document.getElementsByTagName('table')[index];
		var cells = table.rows[0].cells;
		var total = 0;
		for(var i = 1; i < cells.length; i++) {
			total += cells[i].offsetWidth;
		}

		var tdwidth = [];
		if(s == 2) {
			var minWidth = total;
			var minIndex = 0;
			for(var i = 1; i < cells.length; i++) {
				var cellwidth = (cells[i].offsetWidth / total) * 100;
				tdwidth.push(cellwidth.toFixed(2));
				if(cellwidth < minWidth) {
					minWidth = cellwidth.toFixed(2);
					minIndex = i - 1;
				}
			}
			var newWidth = parseFloat(minWidth) + parseFloat(tdwidth[colIndex]);
			tdwidth.changeItem(minIndex, parseFloat(newWidth).toFixed(2));
			tdwidth.splice(colIndex, 1);
		} else {
			//计算出百分比
			var maxWidth = 0;
			var maxIndex = 0;
			for(var i = 1; i < cells.length; i++) {
				var cellwidth = (cells[i].offsetWidth / total) * 100;
				tdwidth.push(cellwidth.toFixed(2));
				if(cellwidth > maxWidth) {
					maxWidth = cellwidth.toFixed(2);
					maxIndex = i - 1;
				}
			}
			tdwidth.changeItem(maxIndex, (maxWidth * 0.8).toFixed(2));
			tdwidth.insert(parseInt(colIndex), (maxWidth * 0.2).toFixed(2));
		}
		console.log(toString(tdwidth));
		return tdwidth;
	}
}

jQuery.fn.rowspan = function(colIdx) { //封装的一个JQuery小插件 
	return this.each(function() {
		var that;
		$('tr', this).each(function(row) {
			$('td:eq(' + colIdx + ')', this).filter(':visible').each(function(col) {
				if(that != null && $(this).html() == $(that).html()) {
					rowspan = $(that).attr("rowSpan");
					if(rowspan == undefined) {
						$(that).attr("rowSpan", 1);
						rowspan = $(that).attr("rowSpan");
					}
					rowspan = Number(rowspan) + 1;
					$(that).attr("rowSpan", rowspan);
					$(this).hide();
				} else {
					that = this;
				}
			});
		});
	});
}

var loadColSpan = function() {
	$(".table-sample").rowspan(0); //传入的参数是对应的列数从0开始，哪一列有相同的内容就输入对应的列数值 
	$(".table-sample").rowspan(1);
	$(".table-sample").rowspan(2);
}