// pages/work/work.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		CK_show:false,
		tabNow: 'work',
		keyword: '选择课程',
		showList: false,
		show_C: false,
		tipList: false,
		filter_list: false,
		tap_cur_Q: 0,
		tap_cur_D: 0,
		tap_cur_L: false,
		big_pic:false,
		cur_selector:[],
		show_selector:[],
		videoShow:false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var _this = this;
		var pages = getCurrentPages();
		var parentPage = pages[pages.length - 2];
		var parentData = parentPage.data;
		_this.setData({
			parentData: parentData
		})
		_this.getWorkList();
	},

	// 获取作业列表
	getWorkList: function () {
		var _this = this;

		app.__HTTP__.post('get_workList', {
			'user_openid': app.globalData.baseInfo.openid,
			'project_id': _this.data.parentData.packageInfo.project_id
		}, res => {
			if (res.state == 200) {
				_this.setData({
					'dataList': res.resData
				});
			} else {
				wx.showToast({
					title: '网路故障。Error：502',
				})
			}

		})
	},

	chooseBtn: function (e) {
		var _this = this;
		var idx = e.currentTarget.dataset.idx;
		app.__HTTP__.post('get_tipList', {
			'id':_this.data.dataList[idx].id,
			'tip_list': _this.data.dataList[idx].tip_list
		}, res => {
			_this.setData({
				'type_list':res.resData.type_list,
				'tipList': res.resData.tipList,
				'LM_list': res.resData.LM_list,
				'dataList_idx': idx,
				'showList': false,
				'keyword': _this.data.dataList[idx].project_name,
			});
			_this.tagTap0('init');
			_this.tagTap1('init');
			// 更新未读作业数
			_this.countUnread();
		})
	},


	stopCatch: function () {
		return 0;
	},

	hide_C:function(){
		this.setData({'show_C': !this.data.show_C,})
	},
	
	show_C: function (e) {
		var _this = this
		var LM_id = e.currentTarget.dataset.id;

		app.__HTTP__.post('get_MC_counter',{'user_openid':app.globalData.userInfo.openId,'cur_selector':_this.data.cur_selector,'LM_id':LM_id},res=>{

			if(res.state==200){
				_this.setData({
					'show_C': !this.data.show_C,
					'MC_counter':res.MC_counter,
					'LM_title':res.LM_title
				})
			}
		})

	},
	showCheckList: function () {
		this.setData({
			'showList': !this.data.showList
		})
	},

	
	
	changeCheckBox:function(e){
		var _this =this
		_this.setData({'cur_selector':e.detail.value})
	},
	
	submitBtn: function () {
		//模拟提交
		var _this = this
		app.__HTTP__.post('get_LM_counter',{'user_openid':app.globalData.userInfo.openId,cur_selector:_this.data.cur_selector},res=>{

			if(res.state==200){
				_this.setData({
					'filter_list': true,
					'showList':false,
					'LM_counter':res.LM_counter
				})
			}
		})
		
	},
	tabNow: function (e) {
		this.setData({
			tabNow: e.currentTarget.dataset.now
		})
	},
	tagTap0: function (e) {
		var num = e=='init'? 0 : e.currentTarget.dataset.num;

		this.setData({
			'tap_cur_Q': num,
			'LM_cur':this.data.LM_list[num].id 
		})
		this.tagTap1('init')
	},
	tagTap1: function (e) {
		var _this = this
		var num = null;
		if(e=='init'){
			var tipList = _this.data.tipList
			tipList.forEach((item,idx)=>{
				
				if(item.LM_id == _this.data.LM_list[_this.data.tap_cur_Q].id ){
					console.log('idx:'+idx)
					num = num==null?idx:num;
				}
			})
		}else{
			num = e.currentTarget.dataset.num
		}
		console.log(num)
		this.setData({
			'big_pic':false,
			'tap_cur_D': num,
			'marks': this.data.tipList[num].marks,
		})
	},
	tagTap2: function (e) {
		this.setData({
			'tap_cur_L': e.currentTarget.dataset.num
		})
	},

	tagTapChakan:function(e){
		var _this = this
		var num = e.currentTarget.dataset.num
		var info = _this.data.tipList[num]
		app.__HTTP__.post('crop_read',{'crop_id':info.crop_id},res=>{
			if(res.state==200){
				var tipList = _this.data.tipList;
				tipList[num].read_time = 1;
				_this.setData({'tipList':tipList})
			}
		})
		_this.setData({'CK_show':info})
	},
	CK_hide:function(){
		this.setData({'CK_show':false,'videoShow':false})
	},
	big_show:function(e){
		this.setData({big_pic:e.currentTarget.dataset});
	},
	big_hide:function(){
		this.setData({big_pic:false});
	},

	uploadWork: function () {
		var _this = this;
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths
				tempFilePaths.forEach((item,index)=>{
					wx.uploadFile({
						url: 'https://admin.cradlela-art.com/cradle/upload_work/secondSub', //仅为示例，非真实的接口地址
						filePath: item,
						name: 'file',
						formData: {
							'id': _this.data.dataList[_this.data.dataList_idx].id,
						},
						success(uploadRes) {
							var _Res = JSON.parse(uploadRes.data)
							if(_Res.state==200){
								wx.showToast({
								title: '上传成功！',
								})
							}else if(_Res.state==201){
								wx.showModal({
									title: '提示',
									content: _Res.msg,
									success (res) {
									if (res.confirm) {
										_this.goWork()
									}
									}
								})
							}
						}
					})
				})
			}
		})
	},

	countUnread:function(){
		app.__HTTP__.post('get_unreadCounter',{'openid':app.globalData.baseInfo.openid},res=>{
			if(res.state==200){
				app.globalData.unreadNumber = res.counter.toString()
			}
		})
	},

	changVideoShow:function(){
		this.setData({'videoShow':!this.data.videoShow});
	},
	catchVideo:function(){
		console.log('catchVideo111')
	},
})