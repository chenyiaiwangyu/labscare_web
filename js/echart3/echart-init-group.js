function groupCount() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('groupCount'), 'macarons');
	// 指定图表的配置项和数据
	option = {
		title: {
			text: '分组比例',
			x: 'center',
			textStyle:{
				color:'#BBBBBB',
				fontSize:16
			}
			
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		series: [{
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: 120,
				name: '检测水质仪器分组'
			}, {
				value: 60,
				name: '检测气体仪器分组'
			}, {
				value: 70,
				name: '检测声音仪器分组'
			}, {
				value: 35,
				name: '检测土样仪器分组'
			}],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	// 为echarts对象加载数据 
	myChart.setOption(option);
}


function sampleCount() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('sampleCount'), 'macarons');
	// 指定图表的配置项和数据
	option = {
		title: {
			text: '样品数比例',
			x: 'center',
			textStyle:{
				color:'#BBBBBB',
				fontSize:16
			}
			
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		series: [{
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: 71,
				name: '检测水质仪器分组'
			}, {
				value: 60,
				name: '检测气体仪器分组'
			}, {
				value: 45,
				name: '检测声音仪器分组'
			}, {
				value: 67,
				name: '检测土样仪器分组'
			}],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};

	// 为echarts对象加载数据 
	myChart.setOption(option);
}

function verificationCount() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('verificationCount'), 'macarons');
	// 指定图表的配置项和数据
	option = {
		title: {
			text: '检定次数比例',
			x: 'center',
			textStyle:{
				color:'#BBBBBB',
				fontSize:16
			}
			
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		series: [{
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: 267,
				name: '检测水质仪器分组'
			}, {
				value: 158,
				name: '检测气体仪器分组'
			}, {
				value: 67,
				name: '检测声音仪器分组'
			}, {
				value: 138,
				name: '检测土样仪器分组'
			}],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	// 为echarts对象加载数据 
	myChart.setOption(option);
}

function fitCount() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('fitCount'), 'macarons');
	// 指定图表的配置项和数据
	option = {
		title: {
			text: '维修次数比例',
			x: 'center',
			textStyle:{
				color:'#BBBBBB',
				fontSize:16
			}
			
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		series: [{
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: 44,
				name: '检测水质仪器分组'
			}, {
				value: 27,
				name: '检测气体仪器分组'
			}, {
				value: 98,
				name: '检测声音仪器分组'
			}, {
				value: 78,
				name: '检测土样仪器分组'
			}],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	// 为echarts对象加载数据 
	myChart.setOption(option);
}

function changeCount() {
	// 基于准备好的dom，初始化echarts图表
	var myChart = echarts.init(document.getElementById('changeCount'), 'macarons');
	// 指定图表的配置项和数据
	option = {
		title: {
			text: '更换耗材次数比例',
			x: 'center',
			textStyle:{
				color:'#BBBBBB',
				fontSize:16
			}
			
		},
		tooltip: {
			trigger: 'item',
			formatter: "{b} : {c} ({d}%)"
		},
		series: [{
			type: 'pie',
			radius: '55%',
			center: ['50%', '60%'],
			data: [{
				value: 39,
				name: '检测水质仪器分组'
			}, {
				value: 65,
				name: '检测气体仪器分组'
			}, {
				value: 83,
				name: '检测声音仪器分组'
			}, {
				value: 23,
				name: '检测土样仪器分组'
			}],
			itemStyle: {
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}]
	};
	// 为echarts对象加载数据 
	myChart.setOption(option);
}