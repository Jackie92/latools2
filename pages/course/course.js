// index.js
// 获取应用实例
const app = getApp()

Page({
	data: {
		alertIndex: null,
		videoShow:false,
	},
	onLoad(option) {
		//获取基本信息
		this.getParentPackageInfo(option.idx);
		
	},

	getParentPackageInfo: function (idx) {

		var pages = getCurrentPages();
		var parentPage = pages[pages.length - 2];
		var data = parentPage.data;
		var packageInfo = data.cur_package[data.cur_num][idx];

		// 1,获取项目信息
		app.__HTTP__.post('get_project', {
			'user_openid':app.globalData.baseInfo.openid,
			'project_id': packageInfo.project_id
		}, res => {
			if (res.state == 200) {
				this.setData({
					'packageInfo': packageInfo,
					'list': res.resData
				});
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

	tapProject: function (e) {
		var idx = e.currentTarget.dataset.index;
		this.setData({
			'alertIndex': idx
		})
	},

	goStep: function () {
		var _this = this;

		wx.navigateTo({
			url: '../step/step?project_id=' + _this.data.list[_this.data.alertIndex].id,
		})
		this.setData({
			'alertIndex': null
		})
	},

	uploadWork: function () {
		var _this = this;
		var project_id = _this.data.list[_this.data.alertIndex].id;
		var project_name = _this.data.list[_this.data.alertIndex].p_title;
		
		wx.chooseImage({
			success(res) {
				const tempFilePaths = res.tempFilePaths

				tempFilePaths.forEach((item,index)=>{
					wx.uploadFile({
						url: 'https://admin.cradlela-art.com/cradle/upload_work/firstSub', //仅为示例，非真实的接口地址
						filePath: item,
						name: 'file',
						formData: {
							'project_id': project_id,
							'project_name': project_name,
							'user_openid':app.globalData.baseInfo.openid
						},
						success(uploadRes) {
							console.log(uploadRes)
							var _Res = JSON.parse(uploadRes.data)
							console.log(_Res)
							if(_Res.state==200){
								wx.showToast({
								  title: '上传成功！',
								})
								_this.closeAlert();
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

	goWork: function () {
		var _this = this;

		wx.navigateTo({
			url: '../work/work',
		})

	},
	closeAlert: function () {
		this.setData({
			'alertIndex': null,
			'videoShow':false
		})
	},
		
	changVideoShow:function(){
		this.setData({'videoShow':!this.data.videoShow});
	},
	catchVideo:function(){
		console.log('catchVideo111')
	},

	yuekeFun:function() {
		var _this = this
		wx.showLoading({
		  title: '查询中...',
		})
		app.__HTTP__.post('query_lessonList',{pro_id:_this.data.list[_this.data.alertIndex].id},res=>{
			wx.hideLoading();
			console.log(res);
			if(res.listNum>0){
				_this.setData({'lesson_list':res.lesson_list})
				wx.navigateTo({
					url: '../schedule/reserve',
				})
			}else{
				wx.showToast({
				  title: '当前无可约课程',
				  icon:"error"
				})
			}
		})
		
	}

})
