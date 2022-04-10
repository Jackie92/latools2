// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		project_id: "",
		// screenList: ["全部", 50, 100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000],
		screenList: [{
			value: "",
			name: "全部"
		}, {
			value: 50,
			name: 50,
		}, {
			value: 100,
			name: 100
		}, {
			value: 200,
			name: 200
		}, {
			value: 300,
			name: 300
		}, {
			value: 400,
			name: 400
		}, {
			value: 500,
			name: 500
		}, {
			value: 600,
			name: 600
		}, {
			value: 800,
			name: 800
		}, {
			value: 1000,
			name: 1000
		}, {
			value: 1200,
			name: 1200
		}, {
			value: 1500,
			name: 1500
		}, {
			value: 2000,
			name: 2000
		}],
		screenIndex: 0,
		'initObj': {
			'target': {
				'dataset': {
					'num': 0
				}
			}
		},
		'__tag1__': null,
		'__tag2__': null,
		'__tag3__': null,
		'__tag4__': null,
		tag1_id: null,
		tag2_id: null,
		tag3_id: null,
		tag4_id: null,

		drop_idx_1:0,
		drop_idx_2:0,
		drop_idx_3:0,

		'stepNumber': 0,
		'__pageName__': 'user',
		'cur_num': 0,
		'animateData': null,
		'list': [],
		'pageNum': 1,
		'menuFixed': false,
		'videoShow': false,
		'defaultPoster': 'https://admin.cradlela-art.com/static/_cradle_/icon/defaultPoster.png'
	},
	onLoad(option) {
		// 获取step信息
		this.setData({'onLoad_option':option})
		this.getStep(option.project_id)
		this.project_id = option.project_id
		this.animation = wx.createAnimation()
	},
	onShow(option){
		console.log(option);
	},
	//点赞和取消点赞
	collectFun: function (e) {
		var _this = this;
		console.log(e)
		var cid = e.currentTarget.dataset.cid;
		var cur_state = e.currentTarget.dataset.state;

		if (app.globalData.userInfo == undefined || app.globalData.userInfo.user_state != 1) {
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
				'openid': app.globalData.baseInfo.openid,
				'cid': cid,
				'state': cur_state
			}, res => {
				console.log(res);
				if (res.state == 200) {
					wx.showToast({
						title: '收藏成功！',
						icon: 'success',
						duration: 2000,
						success: function () {
							var list = _this.data.list
							var tem_a = [];
							var tem_b = [];
							list.forEach(item => {
								if (item.id == cid) {
									item.collectState = item.collectState == 1 ? 0 : 1
								}
								if (item.collectState == 1) {
									tem_a.push(item)
								} else {
									tem_b.push(item)
								}
							})
							var tem = tem_a.concat(tem_b)
							_this.setData({
								'list': tem
							})
						}
					})


				} else {
					wx.showToast({
						title: '网络不好，请稍后重试~',
					})
				}
			})
		}
	},
	bindPickerChange(e) {
		this.setData({
			screenIndex: e.detail.value
		})
		this.getStep(this.project_id)
	},
	getStep: function (project_id) {
		var _this = this;
		app.__HTTP__.post('get_stepJson', {
			'project_id': project_id
		}, res => {
			if (res.state == 200) {
				_this.setData({
					'step': res.resData
				});
				
				_this.getMenuFromCheck(true); //初始化菜单
				// _this.getStepList();
			}
		})
	},

	getStepList: function (more = false) {

		var _this = this;
		if (!more) {
			_this.setData({
				'list': []
			})
		}

		function deteleObject(obj) {
			var uniques = [];
			var stringify = {};
			for (var i = 0; i < obj.length; i++) {
				var keys = Object.keys(obj[i]);
				keys.sort(function (a, b) {
					return (Number(a) - Number(b));
				});
				var str = '';
				for (var j = 0; j < keys.length; j++) {
					str += JSON.stringify(keys[j]);
					str += JSON.stringify(obj[i][keys[j]]);
				}
				if (!stringify.hasOwnProperty(str)) {
					uniques.push(obj[i]);
					stringify[str] = true;
				}
			}
			uniques = uniques;
			return uniques;
		}

		app.__HTTP__.post('get_stepList', {
			'check': _this.data.step[_this.data.stepNumber].check,
			'pageNum': _this.data.pageNum,
			'size': _this.data.screenList[_this.data.screenIndex], //新增加的
			'tag1_id': _this.data.tag1_id,
			'tag2_id': _this.data.tag2_id,
			'tag3_id': _this.data.tag3_id,
			'tag4_id': _this.data.tag4_id,
			'user_openid': app.globalData.baseInfo.openid,
			'scaleFilter': _this.data.screenList[_this.data.screenIndex].value,
		}, res => {
			if (res.state == 200) {
				var temAry = _this.data.list;
				temAry = temAry.concat(res.resData.list);
				_this.setData({
					'list': deteleObject(temAry),
					'pageNum': res.resData.pageNum,
					'notMenu': res.resData.notMenu
				})
			} else if (res.state == 201) {
				wx.showToast({
					title: '没有更多啦',
					icon: 'error',
					duration: 2000
				})
			}
		})
	},

	getMoreFun: function () {
		console.log('getMoreFun')
		this.getStepList(true);
	},

	getMenuFromCheck: function (action=false) {
		var _this = this;
		var checkList = _this.data.step[_this.data.stepNumber].check;

		app.__HTTP__.post('get_stepMenuFromCheck', {
			'checkList': checkList
		}, res => {
			if (res.state == 200 && res.menuList.length > 0) {
				_this.setData({
					'menuList': res.menuList
				});
				_this.tagTap1(_this.data.initObj);
				_this.drop_event({
					currentTarget:{dataset:{dropper:'drop_idx_1'}},
					detail:{value:0},
					trigger:true,
				})//模拟筛选下拉菜单点击

				if(action){
					_this.getStepList();
				}
			}
		})
	},

	getMenu: function (pid) {
		var _this = this;
		app.__HTTP__.post('get_stepMenu', {
			'pid': pid
		}, res => {
			if (res.state == 200) {
				_this.setData({
					'menu_2': res.resData
				})
			}

		})
	},

	tagTap0: function (e) {
		console.log(e)
		var id = e.target.dataset.id;
		var num = e.target.dataset.num;
		var systemInfo = wx.getSystemInfoSync();
		var moveX = 230 * num / 750 * systemInfo.windowWidth;
		this.animation.translateX(moveX).step();
		this.setData({
			'cur_num': num,
			'animation': this.animation.export(),
			'__tag1__': null,
			'__tag2__': null,
			'tag1_id': null,
			'tag2_id': null,
			'tag3_id': null,
			'tag4_id': null,
			'pageNum': 1,
			'list': []
		});

		this.tagTap1(this.data.initObj);
		this.drop_event({
			currentTarget:{dataset:{dropper:'drop_idx_1'}},
			detail:{value:0},
			trigger:true,	
		})//模拟筛选下拉菜单点击
	},


	tagTap1: function (e) {
		console.log('=tagTap1=');
		var _this = this;
		var num = e.target.dataset.num;

		// var tag1_id = _this.data.step[_this.data.stepNumber].s_contain[_this.data.cur_num].children[num].id;
		var tag1_id = _this.data.menuList[_this.data.cur_num].children.length ? _this.data.menuList[_this.data.cur_num].children[num].id : null;
		var tag2_id =   _this.data.menuList[_this.data.cur_num].children[num].children.length ?  _this.data.menuList[_this.data.cur_num].children[num].children[0].id : null;
		var tag2_num = _this.data.menuList[_this.data.cur_num].children[num].children.length ? 0 : null;
		_this.setData({
			'__tag1__': num,
			'tag1_id': tag1_id,
			'__tag2__': tag2_num,
			'tag2_id': tag2_id,

			'__tag3__': null,
			'tag3_id': null,
			'__tag4__': null,
			'tag4_id': null,
			'pageNum': 1
		});
		
		// 获取菜单数据
		// _this.getMenu(tag1_id)
		_this.drop_event({
			currentTarget:{dataset:{dropper:'drop_idx_1'}},
			detail:{value:0},
			trigger:true,
		})//模拟筛选下拉菜单点击

		// 获取list数据
		_this.getStepList();
	},

	tagTap2: function (e) {
		var _this = this;
		var num = e.target.dataset.num;
		var tag2_id = e.target.dataset.cid;
		_this.setData({
			'__tag2__': num,
			'tag2_id': tag2_id,
			'pageNum': 1
		});
		_this.getStepList();
	},

	preStep: function () {
		var _this = this;
		var stepNumber = _this.data.stepNumber;
		if (stepNumber > 1) {
			stepNumber = stepNumber - 1;
		} else {
			stepNumber = 0;
			wx.showToast({
				title: '已经第一步了',
				icon: 'error',
				duration: 2000
			})
		}
		_this.animation.translateX(0).step();
		_this.setData({
			'cur_num': 0,
			'stepNumber': stepNumber,
			'tag1_id': null,
			'__tag1__': null,
			'tag2_id': null,
			'__tag2__': null,
			'tag3_id': null,
			'__tag3__': null,
			'tag4_id': null,
			'__tag4__': null,
			'animation': _this.animation.export()
		});

		_this.getMenuFromCheck(true);
		wx.pageScrollTo({
			'scrollTop': '0px'
		})
	},

	nextStep: function () {
		var _this = this;
		var stepNumber = _this.data.stepNumber;


		var steps = _this.data.step;
		if (stepNumber > (steps.length - 2)) {
			stepNumber = steps.length - 1;
			wx.showToast({
				title: '没有更多的步骤了',
				icon: 'error',
				duration: 2000
			})
		} else {
			stepNumber = stepNumber + 1;
		}

		_this.animation.translateX(0).step();

		_this.setData({
			'cur_num': 0,
			'stepNumber': stepNumber,
			'tag1_id': null,
			'__tag1__': null,
			'tag2_id': null,
			'__tag2__': null,
			'tag3_id': null,
			'__tag3__': null,
			'tag4_id': null,
			'__tag4__': null,
			'animation': _this.animation.export()
		});


		_this.getMenuFromCheck(true);
		wx.pageScrollTo({
			'scrollTop': '0px'
		})

	},

	fixedMenu: function (e) {
		this.setData({
			'menuFixed': true
		});
	},
	floatMenu: function (e) {
		this.setData({
			'menuFixed': false
		});
	},

	scrollFun: function (e) {
		var the_top = e.detail.scrollTop;
		var the_width = e.detail.scrollWidth;
		if ((the_width / the_top) > 1 || (the_width / the_top) < 0) {
			this.setData({
				'menuFixed': false
			});
		} else {
			this.setData({
				'menuFixed': true
			});
		}
	},

	preViewImg: function () {
		var url = this.data.step[this.data.stepNumber].s_pic
		console.log(url)
		wx.previewImage({
			urls: [url],
			showmenu: false,
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

	goMaterialEdit(e) {
		var index = e.currentTarget.dataset.index
		var cur_num = this.data.cur_num
		var __tag1__ = this.data.__tag1__
		var __tag2__ = this.data.__tag2__
		var title0 = cur_num != undefined ? this.data.menuList[cur_num].title : ""
		var title1 = __tag1__ != undefined ? this.data.menuList[cur_num].children[__tag1__].title : ""
		var title2 = __tag2__ != undefined ? this.data.menuList[cur_num].children[__tag1__].children[__tag2__]
			.title : ""
		wx.navigateTo({
			url: '../materialEdit/index?item=' + encodeURIComponent(JSON.stringify({
				index,
				title0,
				title1,
				title2,
			})),
		})
	},

	goContent: function (e) {
		// wx.navigateTo({
		// 	url: '../content/content?index=' + e.currentTarget.dataset.index,
		// })
		var idx = e.currentTarget.dataset.index;
		var cur = this.data.list[idx];
		if(cur.isMyUploadMaterial==1){
			var photo = cur.sketch;
		}else{
			var photo = cur.photo;
		}
		
		photo = photo.split(';');
		console.log(photo);
		wx.previewImage({
			urls: photo // 需要预览的图片http链接列表
			,showmenu:false
		})


	},

	changVideoShow: function () {
		this.setData({
			'videoShow': !this.data.videoShow
		});
	},
	catchVideo: function () {
		console.log('catchVideo111')
	},

	playRate: function (e) {
		let rate = e.currentTarget.dataset.rate;
		console.log('倍速播放' + rate);
		let videoContext = wx.createVideoContext('videoBox');
		console.log(videoContext);
		var res = videoContext.playbackRate(Number(rate))
		console.log(res)
		videoContext.play()
	},

	drop_event:function(e){
		console.log(e);
		var dropper = e.currentTarget.dataset.dropper;
		var idx = e.detail.value;
		var obj = [];
		if(dropper == 'drop_idx_1'){
			obj['drop_idx_2'] = 0;
			obj['drop_idx_3'] = 0;
		}else if(dropper == 'drop_idx_2'){
			obj['drop_idx_3'] = 0;
		}
		obj['pageNum'] = 1;
		obj[dropper] = idx
		this.setData(obj);
		var cur_num = this.data.cur_num;
		var menuList = this.data.menuList ;
		var __tag1__ = this.data.__tag1__;
		var drop_idx_1 = this.data.drop_idx_1;
		var drop_idx_2 = this.data.drop_idx_2;
		var drop_idx_3 = this.data.drop_idx_3;
		// var drop_1 = menuList[cur_num].children[__tag1__].children[drop_idx_1];
		var drop_1 = this._getDrop_([drop_idx_1],menuList[cur_num].children[__tag1__].children);
		// var drop_2 = menuList[cur_num].children[__tag1__].children[drop_idx_1].children[drop_idx_2];
		var drop_2 = this._getDrop_([drop_idx_1,drop_idx_2],menuList[cur_num].children[__tag1__].children);
		// var drop_3 = menuList[cur_num].children[__tag1__].children[drop_idx_1].children[drop_idx_2].children[drop_idx_3];
		var drop_3 = this._getDrop_([drop_idx_1,drop_idx_2,drop_idx_3],menuList[cur_num].children[__tag1__].children);
		var temObj = {};
		if(drop_1){
			temObj.tag2_id = drop_1.id;
		}else{
			temObj.tag2_id = null;
		}
		if(drop_2){
			temObj.tag3_id = drop_2.id;
		}else{
			temObj.tag3_id = null;
		}
		if(drop_3){
			temObj.tag4_id = drop_3.id;
		}else{
			temObj.tag4_id = null;
		}
		this.setData(temObj);
		if(!e.trigger){
			this.getStepList();
		}
		
		console.log({d1:drop_1,d2:drop_2,d3:drop_3})
	},

	_getDrop_:function(ary,list){
			var indx =ary.length;
			var tem = '';
			console.log([ary,list])
			if(list.length<1){
				return null;
			}else if(indx == 1){
				return list[ary[0]];
			}else if(indx == 2 && list[ary[0]].children.length){
				return list[ary[0]].children[ary[1]];
			}else if(indx == 3 && list[ary[0]].children.length && list[ary[0]].children[ary[1]].children.length){
				return list[ary[0]].children[ary[1]].children[ary[2]];
			}else{
				return null;
			}

	},

	deleteMaterial: function (e) {
		var that = this;
		var mid = e.currentTarget.dataset.mid;
		if (mid) {
			wx.showModal({
				title: '提示',
				content: '确认删除此素材么？',
				success(res) {
					if (res.confirm) {
						console.log('用户点击确定')
						app.__HTTP__.post('del_material', {
							'material_id': mid
						}, res => {
							if (res.state == 200) {
								wx.showToast({
									title: '删除成功！',
									icon: 'success',
									duration: 2000
								})
								var list = that.data.list;
								var tem = [];
								for (let index = 0; index < list.length; index++) {
									const element = list[index];
									if (element.material_id != mid) {
										tem.push(element)
									}
								}
								that.setData({
									'list': tem
								});
							} else {
								wx.showToast({
									title: '网络不好，请稍后重试~',
								})
							}
						})
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				}
			})
		} else {
			wx.showToast({
				title: '此素材禁止删除...',
			})
		}
	},
})