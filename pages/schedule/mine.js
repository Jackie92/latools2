// pages/schedule/mine.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		complete:'',
		project_ary:['选择课程','D1 方案基础','D2 方案第二个','D2 方案第3333个','D2 方案第4444个','D2 方案第5555555555555555555555555555555555个'],
		project_idx:0,
		date_ary:['选择时间','最近一周','最近一月','一个月前'],
		date_idx:0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var _this = this

		// 查询约课记录
		_this.sql_mine();
	},


	/**
	 * 查询约课记录
	 */
	sql_mine:function() {
		var _this = this
		wx.showLoading({
		  title: '载入中...',
		})
	
		var obj = {}
		if(_this.data.project_idx>0){
			var pidx = parseInt(_this.data.project_idx)
			obj['pro_id'] = _this.data.project_ary[pidx].id
		}

		if(_this.data.date_idx>0){
			obj['date_idx'] = _this.data.date_idx
		}




		var data = Object.assign({'user_openid':app.globalData.baseInfo.openid,complete:_this.data.complete}, obj) 

		app.__HTTP__.post('sql_mine',data,res=>{
			wx.hideLoading()
			if(res.state==200){
				_this.setData({'sch_list':res.sch_list,'project_ary':res.all_mine_order});
			}
		})
	},
	
	
	

	completeFun:function (e) {
		var curValue = e.currentTarget.dataset.cur;
		this.setData({'complete':curValue})
		this.sql_mine();
	},
	pickProject:function(e) {
		this.setData({project_idx:e.detail.value})
		this.sql_mine();
	},
	pickDate:function(e) {
		this.setData({date_idx:e.detail.value})

		this.sql_mine();
	},

})