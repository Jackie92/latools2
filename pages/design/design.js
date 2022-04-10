// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		'cur_num': 0,
		'animateData': null,
		'__pageName__': 'design',
	},
	onLoad() {

		var _this = this;
		// 1,缓存中读取登录状态
		var userInfo = app.globalData.userInfo
		if (('userInfo' in app.globalData) && userInfo.user_state) {
			_this.setData({
				'userInfo': app.globalData.userInfo
			});

			// 页面初始化
			_this.animation = wx.createAnimation();
			_this.pageInit();

		} else {
			app.loginFun(_this).then((globalData) => {
				_this.setData({
					'userInfo': globalData.userInfo,
					'baseInfo': globalData.baseInfo
				})
			})
		}

		if (wx.getUserProfile) {
			this.setData({
				canIUseGetUserProfile: true
			})
		}
		
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
								app.loginFun(_this).then((globalData) => {
									// 页面初始化
									console.log('注册之后载入页面');
									_this.animation = wx.createAnimation();
									_this.pageInit();
								})
								
								
							}
						})
					}
				})

			}
		} catch (e) {
			// Do something when catch error
		}


	},
	
	onShow:function(){
		console.log('=onShow=')
		console.log(app.globalData.unreadState)
		if(app.globalData.unreadState){
			app.unreadCounter(app.globalData.unreadState)
		}

		
	},

	pageInit: function () {
		var _this = this
		// 1,获取课程包
		app.__HTTP__.get('get_packag', {
			'user_openid': app.globalData.userInfo.openId
		}, res => {

			if (res.state == 200) {
				_this.setData({
					'fenlei': res.resData.fenlei,
					'cur_package':res.resData.list
				})
			}
		})


	},

	tagTap1: function (e) {
		var num = e.target.dataset.num;
		var systemInfo = wx.getSystemInfoSync();
		this.animation.translateX((230 * num )/ 750 * systemInfo.windowWidth).step();

		this.setData({
			'cur_num': num,
			'animation': this.animation.export()
		});

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

	goCourse: function (e) {
		var _this = this
		var idx = e.currentTarget.dataset.idx;
		// 验证是否已经过期
		var expire_state = _this.data.cur_package[_this.data.cur_num][idx]['expire_state'];
	
		if (expire_state == 'validity') {
			wx.navigateTo({
				url: '../course/course?idx=' + idx,
			})

		} else if (expire_state == 'overdue') {
			wx.showModal({
				title: '提示',
				content: '访问权限已过期，点击确定联系管理员获取访问权限',
				success(res) {
					if (res.confirm) {
						wx.navigateTo({
						  url: '../user/contact-us',
						})
					}
				}
			})
		} else {
			wx.showModal({
				title: '提示',
				content: '还没有获得访问权限，点击确定联系管理员获取访问权限',
				success(res) {
					if (res.confirm) {
						wx.navigateTo({
							url: '../user/contact-us',
						})
					}
				}
			})
		}

	},

	sch_mine:function() {
		wx.navigateTo({
		  url: '../schedule/mine',
		})	
	},

	goToResume:function() {
		wx.navigateTo({
			url: './resume',
		})	
	},

})
