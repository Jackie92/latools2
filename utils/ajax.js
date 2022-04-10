function myrequest(url, method,param, successCallback, failCallback) {
	var _this = this;
	
	// 接口域名
	var __domain__ = 'https://admin.cradlela-art.com/';
	
	// 接口API列表
	var apiList = {
        'post_wxlogin':__domain__ + 'cradle/login/wxlogin', //给服务器提交wxlogin的code
        'get_unreadCounter':__domain__ + 'cradle/login/unreadCounter', //计算未读消息
        'setUserLocation':__domain__ + 'cradle/login/setUserLocation', //设置用户地理位置
        'get_collectList':__domain__ + 'cradle/page_index/getCollectList', // 获取收藏列表
        'set_collectList':__domain__ + 'cradle/page_index/collectFun', // 设置收藏状态
        'post_register':__domain__ + 'cradle/login/register', // 提交用户userInfo注册账号
		'get_lunboPic': __domain__ + 'cradle/page_index/lunboPic',//获取轮播图
		'get_indexPageList': __domain__ + 'cradle/page_index/indexPageList',//获取首页列表
		'get_packag':__domain__ + 'cradle/page_design/getPackag_new',//获取课程包
        'get_project':__domain__ + 'cradle/page_course/getProject',//获取项目信息
        'get_stepJson':__domain__ + 'cradle/page_step/getStep', // 获取步骤json
        'get_stepList':__domain__ + 'cradle/page_step/getSepList', // 获取步骤的列表信息
        'get_stepMenu':__domain__ + 'cradle/page_step/getMenu', // 获取step的次级菜单
        'get_stepMenuFromCheck':__domain__ + 'cradle/page_step/getMenuFromCheck', // 获取step的所有菜单
        'get_userCatalog':__domain__ + 'cradle/page_user/getUserCatalog', //获取user 的收藏列表
        'get_userMenu':__domain__ + 'cradle/page_user/getUserMenu', // 获取user一级的菜单 
        'get_userMenuFilter':__domain__ + 'cradle/page_user/getUserMenuFilter', // 获取user一级的菜单 
        'get_workList':__domain__ + 'cradle/page_work/homeworklist', // 获取作业列表 
        'get_tipList':__domain__ + 'cradle/page_work/tipList', // 获取批改详情 
        'get_LM_counter':__domain__ + 'cradle/page_work/LM_counter', // 获取批改详情 
        'get_MC_counter':__domain__ + 'cradle/page_work/MC_counter', // 获取批改详情 
        'crop_read':__domain__ + 'cradle/page_work/crop_read', // 获取批改详情 
        'query_lessonList':__domain__ + 'cradle/page_schedule/query_lessonList', // 查询可选约课
        'query_lessonDayTime':__domain__ + 'cradle/page_schedule/query_lessonDayTime', // 查询可选约课时间
        'order_schedule':__domain__ + 'cradle/page_schedule/order_schedule', // 查询可选约课时间
        'sql_mine':__domain__ + 'cradle/page_schedule/sql_mine', // 查询可选约课时间
        'del_material':__domain__ + 'cradle/page_step/del_material', // 查询可选约课时间
        'getXuexiaoList':__domain__ + 'cradle/page_resume/getXuexiaoList', // 获取学校列表
        'getYuanxiList':__domain__ + 'cradle/page_resume/getYuanxiList', // 获取院系列表
        'getZhuanyeList':__domain__ + 'cradle/page_resume/getZhuanyeList', // 获取专业列表
        'getKaoshikemu':__domain__ + 'cradle/page_resume/getKaoshikemu', // 获取对应的考试科目
        'postResume':__domain__ + 'cradle/page_resume/postResume', // 获取对应的考试科目
	}

	if(apiList.hasOwnProperty(url)){
		url = apiList[url]
	}
	
    wx.request({
        url: url,
        data: param,
        dataType: 'json',
        method: method,
        header: {
            'custom-header': method,
            'content-type': 'application/json'
        },
        success: (res) => {
            if (successCallback) {
                successCallback(res.data);
            }
        },
        fail: (res) => {
      
            if (failCallback) {
                failCallback(res);
            }
        }
    });
}

export default {
    get:function(url, param, success, fail) {
        return myrequest(url,"GET",param,success,fail)
    },

    getSync:function(url, param){
        return new Promise((resolve,reject)=>{
            return myrequest(url,"GET",param,resolve,reject)
        })
    },

    post:function(url, param, success, fail){
        return myrequest(url,"POST",param,success,fail)
    },

    postSync:function(url, param, success, fail){
        return new Promise((resolve,reject)=>{
            return myrequest(url,"POST",param,resolve,reject)
        })
    },

    put:function(url, param, success, fail){
        return myrequest(url,"PUT",param,success,fail)
    },

    putSync:function(url, param, success, fail){
        return new Promise((resolve,reject)=>{
            return myrequest(url,"PUT",param,resolve,reject)
        })
    },

    delete:function(url, param, success, fail){
        return myrequest(url,"DELETE",param,success,fail)
    },

    deleteSync:function(url, param, success, fail){
        return new Promise((resolve,reject)=>{
            return myrequest(url,"DELETE",param,resolve,reject)
        })
    }
}