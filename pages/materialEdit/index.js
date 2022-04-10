// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		item: null,
		imgUrl: "",
		inputValue: "",
		selectList: [],
		screenList: [{
			num: 50
		}, {
			num: 100
		}, {
			num: 200
		}, {
			num: 300
		}, {
			num: 400
		}, {
			num: 500
		}, {
			num: 600
		}, {
			num: 800
		}, {
			num: 1000
		}, {
			num: 1200
		}, {
			num: 1500
		}, {
			num: 2000
		}]
	},
	onLoad(options) {
		this.setData({
			item: JSON.parse(decodeURIComponent(options.item))
		})
	},
	selectImg() {
		var that = this
		wx.chooseImage({
			count: 1,
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success(res) {
				that.setData({
					imgUrl: res.tempFilePaths[0]
				})
			}
		})
	},
	bindKeyInput: function (e) {
		this.setData({
			inputValue: e.detail.value
		})
	},
	addSize(e) {
		var index = e.currentTarget.dataset.index
		if (this.data.screenList[index].select) {
			this.data.screenList[index].select = false
			this.setData({
				screenList: this.data.screenList
			})
			this.data.selectList.push(this.data.screenList[index].num)
		} else {
			this.data.screenList[index].select = true
			this.setData({
				screenList: this.data.screenList
			})
			for (var i = 0; i < selectList.length; i++) {
				if (this.data.screenList[index].num == selectList[i]) {
					this.data.selectList.splice(i, 1)
					break;
				}
			}
		}
	},
	selectAll() {
		var bool = true
		if (this.data.selectList.length == this.data.screenList.length) {
			bool = false
		}
		this.data.selectList = []
		for (var i = 0; i < this.data.screenList.length; i++) {
			this.data.screenList[i].select = bool
		}
		this.setData({
			screenList: this.data.screenList
		})
		if (bool) {
			for (var i = 0; i < this.data.screenList.length; i++) {
				this.data.selectList.push(this.data.screenList[i].num)
			}
		}
	},
	confirm() {
		console.log(this.data.selectList) //比例尺列表
		console.log(this.data.imgUrl) //临时图片地址
		console.log(this.data.inputValue) //图片名称

		var item = this.data.imgUrl;
		var scale = this.data.selectList;
		var title = this.data.inputValue;

		var pages = getCurrentPages();
		var parentPage = pages[pages.length - 2];
		var data = parentPage.data;

		if(data.tag4_id){
			var cid = data.tag4_id ;
		}else if(data.tag3_id){
			var cid = data.tag3_id ;
		}else if(data.tag2_id){
			var cid = data.tag2_id ;
		}else if(data.tag1_id){
			var cid = data.tag1_id ;
		}
		
		wx.navigateBack({
			delta: 1,
			success: function () {
				var pages = getCurrentPages();
				var parentPage = pages[pages.length - 1];
				var data = parentPage.data;
				console.log(data)
			}
		})

		// 上传图片
		wx.uploadFile({
			url: 'https://admin.cradlela-art.com/cradle/upload_work/upload_material',
			filePath: item,
			name: 'file',
			formData: {
				'scale': scale,
				'title': title,
				'user_openid': app.globalData.baseInfo.openid,
				'cid': cid,
			},
			success(uploadRes) {
				console.log(uploadRes)
				var _Res = JSON.parse(uploadRes.data)
				console.log(_Res)
				if (_Res.state == 200) {
					wx.showToast({
						title: '上传成功！',
					})


				} else if (_Res.state == 201) {
					wx.showModal({
						title: '提示',
						content: _Res.msg,
						success(res) {

						}
					})
				}
			}
		})

	}
})
