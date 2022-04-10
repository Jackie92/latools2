// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		__tag1__: null,
		__tag2__: null,
		tag_1: null,
		tag_2: null,
		__pageName__: 'user',
		userInfo: [],
		menu_1:[],

	},
	onShow:function(){
		this.getUserCatalog()
	},
	onLoad() {
		var _this = this;
		// 1,缓存中读取登录状态
		var userInfo = app.globalData.userInfo
		if (userInfo.user_state) {
			_this.setData({
				'userInfo': app.globalData.userInfo
			});
			// 获取全部收藏
			_this.getUserCatalog();
			// 获取选项
			_this.getUserMenu();
		} else {
			app.loginFun(_this).then((globalData) => {
				_this.setData({
					'userInfo': globalData.userInfo,
					'baseInfo': globalData.baseInfo
				})
				// 获取全部收藏
				_this.getUserCatalog();
				// 获取选项
				_this.getUserMenu();
			})
		}
		// 页面数据初始化
		this.pageInit();
	},

	getUserInfoFun: function (e) {
		var _this = this;
		var obj = e.detail;
		try {
			var baseInfo = wx.getStorageSync('baseInfo')
			if (baseInfo) {

				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (obj) => {
						obj.openId = baseInfo.openid
						app.__HTTP__.post('post_register', obj, res => {
					
							if (res.state == 200) {
								wx.setStorageSync('userInfo', res.userInfo)
								_this.setData({
									'userInfo': res.userInfo
								})
								app.loginFun();
							}
						})
					}
				})

			}
		} catch (e) {
			// Do something when catch error
		}


	},

	getUserMenu: function () {
		var _this = this;
		app.__HTTP__.get('get_userMenu', {
			'openId': _this.data.userInfo.openId
		}, res => {
			if(res.state==200){
				_this.setData({'menu_1':res.resData.menu,'checkList':res.resData.checkList});
			}
		})
	},

	getUserCatalog: function () {

		var _this = this;
		app.__HTTP__.post('get_userCatalog', {
			'openId': _this.data.userInfo.openId,
			'filter':_this.data.filter,
		}, res => {
	
			if (res.state == 200) {
				_this.setData({
					'list': res.resData
				})
			}
		})
	},

	tagTap1: function (e) {
		var _this = this;
		var num = e.target.dataset.num;
		var cid = e.target.dataset.cid;
		app.__HTTP__.post('get_userMenuFilter',{
			cid:cid,
			checkList:_this.data.checkList
		},res=>{
	
			if(res.state==200){
				_this.setData({
					'menu_2':res.resData,
					'__tag1__': num,
					'__tag2__': null,
					'filter':cid
				});
				_this.getUserCatalog();
			}
		})
		
	},

	tagTap2: function (e) {
		var _this = this;
		var num = e.target.dataset.num;
		var cid = e.target.dataset.cid;
		app.__HTTP__.post('get_userMenuFilter',{
			cid:cid,
			checkList:_this.data.checkList
		},res=>{

			if(res.state==200){
				_this.setData({
					'__tag2__': num,
					'filter':cid
				});
				_this.getUserCatalog();
			}
		})
	},

	collectFun:function(e){
		var _this = this;
		var cid = e.currentTarget.dataset.cid;
		var cur_state = e.currentTarget.dataset.state;
		app.__HTTP__.post('set_collectList',{'openid':_this.data.userInfo.openId,'cid':cid,'state':cur_state},res=>{

			if(res.state==200){
				_this.getUserCatalog();
			}else{
				wx.showToast({
					title: '网络不好，请稍后重试~',
				})
			}
		})
	},
	

	goMine: function () {
		wx.reLaunch({
			url: '../user/user',
		})
	},

	goDesign: function () {
		wx.reLaunch({
			url: '../design/design',
		})
	},

	goHome: function () {
		wx.reLaunch({
			url: '../index/index',
		})
	},

	goContent: function (e) {
		wx.navigateTo({
			url: '../content/content?index=' + e.currentTarget.dataset.index,
		})
	},

	pageInit: function () {
		var _this = this
		// 1,获取首页轮播图
		// app.__HTTP__.get('get_lunboPic', null, res => {
		// 	if (res.state == 200) {
		// 		_this.setData({
		// 			'lunboPic': res.resData
		// 		})
		// 	}
		// })
		// fake data
		_this.setData({
			lessionList: [{
				id: '1',
				name: '科目1',
				img: '/imageFile/defaultHead.png'
			},{
				id: '2',
				name: '科目2',
				img: '/imageFile/defaultHead.png'
			},{
				id: '3',
				name: '科目3',
				img: '/imageFile/defaultHead.png'
			}]
		})
		_this.setData({
			currenLession: "1"
		})
		// 2,获取首页免费项目分组


		// 3, 同步全局变量clollect
		app.loginFun(_this).then((globalData) => {
			_this.setData({
				'userInfo': globalData.userInfo,
				'baseInfo': globalData.baseInfo
			})
			// _this.getList();
		})

	},
	changeLession: function (e) {
		this.setData({
			currenLession: e.detail.currentItemId
		})
	}
})
