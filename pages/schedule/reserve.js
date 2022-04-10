// pages/schedule/reserve.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		time: '12:01',
		lesson_list:[],
		lesson_idx:0,
		lesson_day:'请先选择课程',
		lesson_time:'请先选择日期',
		mutiMenu:[
			['请先选择课程'],
			['请选择日期']
		],
		
		banben:'home'
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var _this = this;
		var pages = getCurrentPages();
		var parentPage = pages[pages.length - 2];
		var data = parentPage.data;
		_this.setData(data)
	},

	/**
	 * 日期选择器
	 */
	DayTime_select: function (e) {
		var val = e.detail.value;
		var menu = this.data.mutiMenu
		var lesson_day = menu[0][val[0]] 
		var lesson_time = menu[1][val[1]] 
		this.setData({'lesson_day':lesson_day,'lesson_time':lesson_time})
	},
	DayTime_change:function(e) {
		var fixData = e.detail
		var _this = this
		var menu = _this.data.mutiMenu
		var t = menu[fixData.column][fixData.value];
		switch (fixData['column']){
			case 0:
				menu[1] = _this.data.timeList[t]?_this.data.timeList[t]:['暂无']
				break;
			case 1:
				break;
			default:
				break;
		} 
		_this.setData({'mutiMenu':menu});
		console.log(e)
	},

	/**
	 * 课程选择器
	 */
	bindChangeLesson: function (e) {
		var _this = this
		var idx = e.detail.value;
		_this.setData({
			'lesson_idx':idx
		})
		var curData = _this.data.lesson_list[idx]
		wx.showLoading({
		  title: '查询上课时间...',
		})
		app.__HTTP__.post('query_lessonDayTime',curData,res=>{
			if(res.state==200){
			
				var menu = _this.data.mutiMenu;
				menu[0]=res.dayList
				menu[1]=res.timeList
				_this.setData({'dayList':res.dayList,'timeList':res.timeList,'mutiMenu':menu,lesson_day:'请先选择课程',lesson_time:'请先选择日期'});
				wx.hideLoading();
			}else{
				wx.showToast({
				  title: '网络故障',
				})
			}
		})

	},
	
	/**
	 * 课程选择器
	 */
	order_schedule:function() {
		var _this = this
		var postData = {
			'sch_id':_this.data.lesson_list[_this.data.lesson_idx].sch_id,
			'banben':_this.data.banben,
			'user_openid':app.globalData.baseInfo.openid,
		}
		wx.showLoading({ title: '预约中...',})
		app.__HTTP__.post('order_schedule',postData,res=>{
			wx.hideLoading()
			wx.showModal({
				title: res.state==200?'成功！':'失败！',
				showCancel:false,
				content:res.msg
			})
		})
	},
	/**
	 * 家庭版
	 */
	homeFun:function() {
		this.setData({banben:'home'});
	},
	/**
	 * 线上版
	 */
	studioFun:function() {
		this.setData({banben:'studio'});
	},
})