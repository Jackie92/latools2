// pages/design/resume.js
// 获取应用实例
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		editState:false,
		resume:{},
		xingzhi: ['请选择', '应届', '往届'],
		kmList :{'waiyu':'外语','zhengzhi':'政治','yewu1':'业务课1','yewu2':'业务课2'},
		pick_2_idx: 0,

		pick_xuexiao: [{
			'name': '请选择'
		}],
		pick_xuexiao_idx: 0,

		pick_yuanxi: [{
			'yx_name': '请选择'
		}],
		pick_yuanxi_idx: 0,

		pick_zhuanye: [{
			'id': 'default',
			'mingcheng': '请选择'
		}],
		pick_zhuanye_idx: 0,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		//1,获取头像和昵称
		this.setData({'userInfo':app.globalData.userInfo});
		//2,报考科目初始化
		this.formatKemu(app.globalData.userInfo.resume_kemujson);
		

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/*切换编辑状态*/
	editState:function(){
		var editState = this.data.editState;
		this.setData({editState:true});
		//2，获取学校列表
		this.getXuexiao();
	},

	/*获取学校列表*/
	getXuexiao: function () {
		var _this = this
		app.__HTTP__.post('getXuexiaoList', {}, res => {
			console.log(res);
			if (res.state == 200) {
				_this.setData({
					'pick_xuexiao': res.xuexiaoList
				})
			}
		})
	},



	/*考试时间选择器*/
	pick_date: function (e) {
		this.setData({
			pick_1: e.detail.value
		})
	},

	/*考试性质选择器*/
	pick_xingzhi: function (e) {

		this.setData({
			pick_2_idx: e.detail.value
		})
	},

	/*学校选择器*/
	pick_xuexiao_fun: function (e) {
		var _this = this
		_this.setData({
			pick_xuexiao_idx: e.detail.value,
			pick_yuanxi_idx: 0,
			pick_yuanxi: [{
				'yx_name': '请选择'
			}],
		
			pick_zhuanye_idx: 0,
			pick_zhuanye: [{
				'id': 'default',
				'mingcheng': '请选择'
			}],

			kemuData:null,
			
		})
		var xuexiao_code = _this.data.pick_xuexiao[e.detail.value]['code'];
		if (xuexiao_code == 'default') {
			return 0;
		}
		var data = {
			'xuexiao_code': xuexiao_code
		}
		// 获取院系列表
		app.__HTTP__.post('getYuanxiList', data, res => {
			if (res.state == 200) {
				_this.setData({
					'pick_yuanxi': res.yuanxiList
				})
			}
		})

	},

	/*院系选择器*/
	pick_yuanxi_fun: function (e) {
		var _this = this
		_this.setData({
			pick_yuanxi_idx: e.detail.value,
			pick_zhuanye_idx: 0,
			pick_zhuanye: [{
				'id': 'default',
				'mingcheng': '请选择'
			}],
			kemuData:null,
		})
		var xyuanxi_info = _this.data.pick_yuanxi[e.detail.value];
		if (xyuanxi_info['id'] == 'default') {
			return 0;
		}
		// 获取院系列表
		app.__HTTP__.post('getZhuanyeList', xyuanxi_info, res => {
			console.log(res);
			if (res.state == 200) {
				_this.setData({
					'pick_zhuanye': res.zhuanyeList
				})
			}
		})

	},

	/*专业选择器*/
	pick_zhuanye_fun: function (e) {
		var _this = this
		_this.setData({
			pick_zhuanye_idx: e.detail.value,
			kemuData:null,
		})
		var zhuanye_info = _this.data.pick_zhuanye[e.detail.value];
		if (zhuanye_info['id'] == 'default') {
			return 0;
		}
		// 获取院系列表
		var thisData  = _this.data;
		var data = {
			'xuexiao_code':thisData.pick_xuexiao[thisData.pick_xuexiao_idx]['code'],
			'yuanxi_id':thisData.pick_yuanxi[thisData.pick_yuanxi_idx]['id'],
			'zhuanye_id':thisData.pick_zhuanye[thisData.pick_zhuanye_idx]['id'],
		}
		app.__HTTP__.post('getKaoshikemu', data, res => {
			console.log(res);
			if (res.state == 200) {
				_this.setData({
					'kemuData': res.kemuData
				})
			}
		})

	},
	/*输入监控*/
	inputer:function(e){
		var key = e.currentTarget.dataset.keyname
		var val = e.detail.value
		var resume = this.data.resume
		resume[key] = val
		this.setData({'resume':resume})
	},

	/*提交保存*/
	submiter:function(){
		var _this = this
		var curdate = this.data
		var resume = this.data.resume
		resume.id = curdate.userInfo.id
		if(curdate.pick_1){resume['resume_kaoshishijian'] = curdate.pick_1}
		if(curdate.pick_2){resume['resume_kaoshixingzhi'] = curdate.xingzhi[curdate.pick_2_idx]}
		if(curdate.pick_xuexiao_idx){resume['resume_zhaoshengdanwei'] = curdate.pick_xuexiao[curdate.pick_xuexiao_idx].name}
		if(curdate.pick_yuanxi_idx){resume['resume_suoshuxueyuan'] = curdate.pick_yuanxi[curdate.pick_yuanxi_idx].yx_name}
		if(curdate.pick_zhuanye_idx){resume['resume_baokaozhuanye'] = curdate.pick_zhuanye[curdate.pick_zhuanye_idx].mingcheng}
		if(curdate.kemuData){resume['resume_kemujson'] = curdate.kemuData}
		
		app.__HTTP__.post('postResume', resume, res => {
			console.log(res);
			if (res.state == 200) {
				app.globalData.userInfo = res.data
				_this.formatKemu(res.data.resume_kemujson)
				_this.setData({'userInfo':res.data,'editState':false});
			}
		})
	},

	formatKemu:function(str){
		var obj = JSON.parse(str)
		this.setData({kemuData:obj})
	},

})