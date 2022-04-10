// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		ad_show: true,
		__tag1__: 0,
		__tag2__: 0,
		pageNum: 1,
		__pageName__: '',
		filterMenu_1_Id: 0,
		filterMenu_2_Id: 0,
		searchWord: null,
		searchId: 0,
		picker_ary: null,
		lunboPic: [],
		list: [],

	},

	onLoad() {
		// 页面数据初始化
		this.pageInit();
	},
	onShow: function () {
			//判断是否为电脑登录，禁止电脑端访问
			wx.getSystemInfo({
				success: (res) => {
					// window | mac为pc端
					// android | ios为手机端
			
					if (res.platform == 'window' || res.platform == 'mac') {
						console.log('电脑登录')
						wx.redirectTo({
							url: '/pages/user/pcmac',
						})
					}
				}
			});

		var _this = this;
		if (_this.data.userInfo == undefined || _this.data.userInfo.user_state != 1) {
			// 3, 同步全局变量clollect
			app.loginFun(_this).then((globalData) => {
				_this.setData({
					'userInfo': globalData.userInfo,
					'baseInfo': globalData.baseInfo
				})
				_this.getList();
			})
		}
	},

	pageInit: function () {
		var _this = this
		// 1,获取首页轮播图
		app.__HTTP__.get('get_lunboPic', null, res => {
			if (res.state == 200) {
				_this.setData({
					'lunboPic': res.resData
				})
			}
		})

		// 2,获取首页免费项目分组


		// 3, 同步全局变量clollect
		app.loginFun(_this).then((globalData) => {
			_this.setData({
				'userInfo': globalData.userInfo,
				'baseInfo': globalData.baseInfo
			})
			_this.getList();
		})

	},

	getMoreFun: function () {
		this.getList();
	},
	getList: function (init = false) {
		var _this = this;
		wx.showLoading({
			title: '加载中',
		})
		if (init) {
			_this.setData({
				'pageNum': 1
			})
		}
		app.__HTTP__.post('get_indexPageList', {
			'openid': _this.data.baseInfo.openid,
			'pageNum': _this.data.pageNum,
			'searchId': _this.data.searchId,
			'filterMenu_1_Id': _this.data.filterMenu_1_Id,
			'filterMenu_2_Id': _this.data.filterMenu_2_Id
		}, res => {
			if (res.state == 200) {
				var temAry = _this.data.list;
				temAry = temAry.concat(res.resData.list)
				var obj = {
					'pageNum': res.resData.pageNum,
					'list': temAry,
					'picker_ary': res.resData.outer_catalog_selecter,
				}
				if (res.resData.menu_1) {
					obj.menu_1 = res.resData.menu_1;
				}
				if (res.resData.menu_2) {
					obj.menu_2 = res.resData.menu_2;
				}
				_this.setData(obj)

				setTimeout(() => {
					wx.hideLoading();
				}, 300);
			} else if (res.state == 201) {
				wx.showToast({
					title: '没有更多啦',
					icon: 'error',
					duration: 2000
				})
			}


		})
	},



	tagTap1: function (e) {
		var _this = this;
		var num = e.target.dataset.num;
		_this.setData({
			'__tag1__': num,
			'__tag2__': null,
			filterMenu_1_Id: _this.data.menu_1[num].id,
			filterMenu_2_Id: null,
			menu_2: null,
			'list': []
		});
		this.getList(true)
	},

	tagTap2: function (e) {
		var _this = this;
		var num = e.target.dataset.num;
		_this.setData({
			'__tag2__': num,
			filterMenu_2_Id: _this.data.menu_2[num].id,
			'list': []
		});
		this.getList(true)
	},
	selectFun: function (e) {
		console.log(e)

	},

	picker_change: function (e) {
		var pickerValue = this.data.picker_ary[e.detail.value];

		this.setData({
			'__tag1__': null,
			'__tag2__': null,
			'searchWord': pickerValue.title,
			'searchId': pickerValue.id,
			'list': [],
			'filterMenu_1_Id': 0,
			'filterMenu_2_Id': 0,
			'menu_1': null,
			'menu_2': null
		});

		this.getList(true)
	},

	picker_cancel: function (e) {
		this.setData({
			'__selectBtnClass__': !this.data.__selectBtnClass__
		});
	},



	collectFun: function (e) {
		var _this = this;
		var cid = e.currentTarget.dataset.cid;
		var cur_state = e.currentTarget.dataset.state;
		if (_this.data.userInfo == undefined || _this.data.userInfo.user_state != 1) {
			wx.showModal({
				title: '提示',
				showCancel: false,
				content: '请先登录',
				success(res) {
					if (res.confirm) {
						wx.switchTab({
							url: '/pages/user/user'
						})
					}
				}
			})
		} else {
			app.__HTTP__.post('set_collectList', {
				'openid': _this.data.baseInfo.openid,
				'cid': cid,
				'state': cur_state
			}, res => {
				console.log(res);
				if (res.state == 200) {
					var list = _this.data.list
					list.forEach(item => {
						if (item.id == cid) {
							item.collectState = item.collectState == 1 ? 0 : 1
						}
					})
					_this.setData({
						'list': list
					})
				} else {
					wx.showToast({
						title: '网络不好，请稍后重试~',
					})
				}
			})
		}
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
	ad_show:function(){
		this.setData({'ad_show':!this.data.ad_show});
	}


})
