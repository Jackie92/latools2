const {
	default: ajax
} = require("./utils/ajax")

// app.js
App({


	// --- 初始化页面载入 -------------------------------
	onLaunch() {
		var _this = this;

		//判断是否为电脑登录，禁止电脑端访问
		wx.getSystemInfo({
			success: (res) => {
				// window | mac为pc端
				// android | ios为手机端
				console.log('#'+res.platform+'#');
				if (res.platform == 'window' || res.platform == 'mac') {
					console.log('电脑登录')
					wx.redirectTo({
						url: '/pages/user/pcmac',
					})
				}
			}
		});

		// 登录
		wx.checkSession({
			success: (res) => {
				console.log('==session处于有效期内==')
				try {
					var baseInfo = wx.getStorageSync('baseInfo');
					var userInfo = wx.getStorageSync('userInfo');
					if (baseInfo && userInfo) {
						_this.globalData.baseInfo = baseInfo;
						_this.globalData.userInfo = userInfo;
					}
				} catch (e) {
					// Do something when catch error
					console.log(e)
					_this.loginFun();
				}
			},
			fail: (res) => {
				console.log('==session已过期==')
				_this.loginFun();
			}
		})



	},

	loginFun: function (pageThis = false) {
		var _this = this;
		return new Promise((resolve, reject) => {
			wx.login({
				success: wxRes => {
					_this.__HTTP__.post('post_wxlogin', {
						'code': wxRes.code
					}, myRes => {
						if (myRes.state == 200) {
							// 用户信息存入缓存
							wx.setStorageSync('baseInfo', myRes.baseInfo)
							wx.setStorageSync('userInfo', myRes.userInfo)
							// 用户信息存入全局变量
							_this.globalData.baseInfo = myRes.baseInfo
							_this.globalData.userInfo = myRes.userInfo

							// 设置“设计”未读角标数
							if (myRes.unreadCounter > 0) {
								_this.globalData.unreadNumber = myRes.unreadCounter.toString()
								_this.unreadCounter()
							}
						} else if (myRes.state == 201) {
							// 用户信息存入缓存
							wx.setStorageSync('baseInfo', myRes.baseInfo)
							// 用户信息存入全局变量
							_this.globalData.baseInfo = myRes.baseInfo
							// 设置地理位置
							_this.setUserLocation(myRes.baseInfo.openid);
							// 强制要求登录
							wx.showModal({
								title: '提示',
								showCancel: false,
								content: '请先登录',
								success(res) {
									if (res.confirm) {
										wx.switchTab({
											url: '/pages/design/design'
										})
									}
								}
							})
						}
						console.log('loginFun已完成');
						resolve(_this.globalData);
					})
				}
			})

		})
	},

	// 获取地理位置
	setUserLocation: function (openid) {
		var _this = this;
		// 获取定位
		wx.getLocation({
			type: 'wgs84',
			success(resLocation) {
				resLocation.openid = openid;
				_this.__HTTP__.post('setUserLocation', resLocation, res => {

				})
			}
		})
	},

	// --- 全局变量 -------------------------------
	globalData: {

	},

	// --- GET、POST请求 -------------------------------
	__HTTP__: ajax,

	// --- 设置 “设计”栏目未读消息角标-------------------

	unreadCounter: function () {
		var _this = this
		var num = _this.globalData.unreadNumber;
		if (num > 0) {
			wx.setTabBarBadge({
				index: 1,
				text: num
			})
		} else {
			wx.removeTabBarBadge({
				index: 1
			})
		}

	},
})