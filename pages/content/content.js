// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		"richTxt":`<div class="div_class">
		<h1>Title</h1>
		<p class="p">
		  Life is&nbsp;<i>like</i>&nbsp;a box of
		  <b>&nbsp;chocolates</b>.
		</p>
	  </div>`

	  ,'videoShow':false
	},
	onLoad(option) {
		this.getStepContent(option.index);
	},

	getStepContent:function(idx){
		var _this = this;
		var pages = getCurrentPages();
		var parentPage = pages[pages.length - 2];
		var data = parentPage.data;
		var content = data.list[idx];
		content.photo_arys = content.photo.split(";");

		_this.setData({'content':content})
	},
	
	tagTap1: function (e) {
		var num = e.target.dataset.num;
		var systemInfo = wx.getSystemInfoSync();
		this.animation.translateX(150*num / 750 * systemInfo.windowWidth).step();

		this.setData({
			'cur_num':num,
			'animation': this.animation.export()
		});

	},


	preView:function(e){
		wx.previewImage({
			current: e.target.dataset.url, // 当前显示图片的http链接
			urls:[ e.target.dataset.url],
			showmenu:false
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
	
	changVideoShow:function(){
		this.setData({'videoShow':!this.data.videoShow});
	},
	catchVideo:function(){
		console.log('catchVideo111')
	},

})
