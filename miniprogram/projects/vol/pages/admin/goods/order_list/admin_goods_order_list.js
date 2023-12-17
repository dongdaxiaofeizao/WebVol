const AdminBiz = require('../../../../../../comm/biz/admin_biz.js');
const GoodsBiz = require('../../../../biz/goods_biz.js');
const pageHelper = require('../../../../../../helper/page_helper.js');
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

		//设置搜索菜单
		this._getSearchMenu();

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () { },

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () { },

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () { },

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () { },

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindStatusTap: async function (e) {
		if (!AdminBiz.isAdmin(this)) return;
		let id = pageHelper.dataset(e, 'id');
		let status = Number(pageHelper.dataset(e, 'status'));
		let params = {
			id,
			status
		}

		let cb = async () => {
			try {
				await cloudHelper.callCloudSumbit('admin/order_status', params).then(res => {
					pageHelper.modifyListNode(id, this.data.dataList.list, 'ORDER_STATUS', status, '_id');
					this.setData({
						dataList: this.data.dataList
					});
					pageHelper.showSuccToast('操作成功');
				});
			} catch (err) {
				console.log(err);
			} 
		}
		pageHelper.showConfirm('确认执行此操作？', cb);

	},

	_getSearchMenu: function () {
		let sortMenus = [
			{ label: '全部', type: '', value: '' },
			{ label: '待领取', type: 'status', value: 1 },
			{ label: '已领取', type: 'status', value: 9 },
			{ label: '系统取消', type: 'status', value: 0 },
		]
		this.setData({
			sortItems: [],
			sortMenus
		})

	}

})