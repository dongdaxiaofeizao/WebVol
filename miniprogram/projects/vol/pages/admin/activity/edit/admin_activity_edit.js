const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');  
const AdminActivityBiz = require('../../../../biz/admin_activity_biz.js');
const ActivityBiz = require('../../../../biz/activity_biz.js');
const validate = require('../../../../../../helper/validate.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		if (!pageHelper.getOptions(this, options)) return;


		AdminActivityBiz.loadActivityDetail(this);
	},

	/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await AdminActivityBiz.loadActivityDetail(this);
		this.selectComponent("#cmpt-form").reload();
		wx.stopPullDownRefresh();
	},

	model: function (e) {
		pageHelper.model(this, e);
	},  

	bindFormSubmit: async function () {


		// 数据校验
		let data = this.data;
		data = validate.check(data, AdminActivityBiz.CHECK_FORM, this);
		if (!data) return;

		if (data.end < data.start) {
			return pageHelper.showModal('结束时间不能早于开始时间');
		}
		if (data.method == 0 && !data.address) {
			pageHelper.anchor('formAddress', this);
			return pageHelper.formHint(this, 'formAddress', '请选择或填写活动地点！');
		}

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = ActivityBiz.getCateName(data.cateId);

		try {
			let activityId = this.data.id;
			data.id = activityId;

			// 先修改，再上传 
			let result = await cloudHelper.callCloudSumbit('admin/activity_edit', data);

			await cloudHelper.transFormsTempPics(forms, 'activity/', activityId, 'admin/activity_update_forms');

			let callback = () => {
				// 更新列表页面数据
				let node = {
					'ACTIVITY_TITLE': data.title,
					'ACTIVITY_CATE_NAME': data.cateName,
					'ACTIVITY_ORDER': data.order,
					'ACTIVITY_START': data.start, 
					'ACTIVITY_BEGIN': data.begin,
					'ACTIVITY_STOP': data.stop,
					'ACTIVITY_MAX_CNT': data.maxCnt, 
					'ACTIVITY_CANCEL_SET': data.cancelSet, 
					statusDesc: result.data.statusDesc
				}
				pageHelper.modifyPrevPageListNodeObject(activityId, node);
				wx.navigateBack();
			}

			pageHelper.showSuccToast('修改成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},

	bindMapTap: function (e) {
		AdminActivityBiz.selectLocation(this);
	},

	url: function (e) {
		pageHelper.url(e, this);
	},

	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	},

	bindJoinFormsCmpt: function (e) {
		this.setData({
			formJoinForms: e.detail,
		});
	},
})