/**
 * Notes: 商品模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-14 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const projectSetting = require('../public/project_setting.js');

class GoodsBiz extends BaseBiz { 

	static getCateName(cateId) {
		return BaseBiz.getCateName(cateId, projectSetting.GOODS_CATE);
	}

	static getCateList() {
		return BaseBiz.getCateList(projectSetting.GOODS_CATE);
	}

	static setCateTitle() {
		return BaseBiz.setCateTitle(projectSetting.GOODS_CATE);
	}


	/** 搜索菜单设置 */
	static async getSearchMenu() {
		let sortMenus = [{
			label: '全部',
			type: '',
			value: ''
		}];
		let sortMenusAfter = [{
			label: '最新',
			type: 'sort',
			value: 'new'
		},];
		let sortItems = [];

		sortMenus = sortMenus.concat(sortMenusAfter);

		return {
			sortItems,
			sortMenus
		}
	}
}

module.exports = GoodsBiz;