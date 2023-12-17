const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
const dataHelper = require('../../../../../../helper/data_helper.js');
const cloudHelper = require('../../../../../../helper/cloud_helper.js');
const validate = require('../../../../../../helper/validate.js');
const AdminGoodsBiz = require('../../../../biz/admin_goods_biz.js');
const GoodsBiz = require('../../../../biz/goods_biz.js'); 

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

		this._loadDetail(); 
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
		await this._loadDetail();
		this.selectComponent("#cmpt-form").reload();
		wx.stopPullDownRefresh();
	},

	model: function (e) {
		pageHelper.model(this, e);
	},

	_loadDetail: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		let id = this.data.id;
		if (!id) return;

		if (!this.data.isLoad) this.setData(AdminGoodsBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			title: 'bar'
		};
		let goods = await cloudHelper.callCloudData('admin/goods_detail', params, opt);
		if (!goods) {
			this.setData({
				isLoad: null
			})
			return;
		};

		this.setData({
			isLoad: true,

			formTitle: goods.GOODS_TITLE,
			formCateId: goods.GOODS_CATE_ID,
			formOrder: goods.GOODS_ORDER,
		
			formForms: goods.GOODS_FORMS,
		});
	},

	bindFormSubmit: async function () {
		if (!AdminBiz.isAdmin(this)) return;

		// 数据校验
		let data = this.data;
		data = validate.check(data, AdminGoodsBiz.CHECK_FORM, this);
		if (!data) return;

		let forms = this.selectComponent("#cmpt-form").getForms(true);
		if (!forms) return;
		data.forms = forms;

		data.cateName = GoodsBiz.getCateName(data.cateId);

		try {
			let goodsId = this.data.id;
			data.id = goodsId;

			// 先修改，再上传 
			await cloudHelper.callCloudSumbit('admin/goods_edit', data);

			await cloudHelper.transFormsTempPics(forms, 'goods/', goodsId, 'admin/goods_update_forms');

			let callback = async () => {

				// 更新列表页面数据
				let node = { 
					'GOODS_OBJ': {
						'limit': dataHelper.getDataByKey(forms, 'mark', 'limit').val,
						'score': dataHelper.getDataByKey(forms, 'mark', 'score').val,
					},
					'GOODS_TITLE': data.title,
					'GOODS_CATE_NAME': data.cateName,
					'GOODS_ORDER': data.order,
				}
				pageHelper.modifyPrevPageListNodeObject(goodsId, node);

				wx.navigateBack();

			}
			pageHelper.showSuccToast('修改成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},


	url: function (e) {
		pageHelper.url(e, this);
	}

})