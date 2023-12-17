const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const ActivityBiz = require('../../../../biz/activity_biz.js');
const AdminActivityBiz = require('../../../../biz/admin_activity_biz.js');
const validate = require('../../../../../../helper/validate.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const PublicBiz = require('../../../../../../comm/biz/public_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		returnUrl: '',
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;



		this.setData(AdminActivityBiz.initFormData());
		this.setData({
			isLoad: true
		});
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

	url: function (e) {
		pageHelper.url(e, this);
	},
	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	}, 

	_bindFormSubmit: async function () {

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

			// 创建
			let result = await cloudHelper.callCloudSumbit('admin/activity_insert', data);
			let activityId = result.data.id;

			// 图片
			await cloudHelper.transFormsTempPics(forms, 'activity/', activityId, 'admin/activity_update_forms');

			let callback = () => {

				PublicBiz.removeCacheList('admin-activity-list');
				PublicBiz.removeCacheList('activity-list');
				PublicBiz.removeCacheList('activity-list-his');
				PublicBiz.removeCacheList('activity-list-run');

				wx.navigateBack();

			}

			pageHelper.showSuccToast('创建成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},

	bindJoinFormsCmpt: function (e) {
		this.setData({
			formJoinForms: e.detail,
		});
	},

	bindMapTap: function (e) {
		AdminActivityBiz.selectLocation(this);
	},

	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		await this._bindFormSubmit();
	}

})