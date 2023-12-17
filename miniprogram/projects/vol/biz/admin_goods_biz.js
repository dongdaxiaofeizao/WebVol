/**
 * Notes: 商品后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-05 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const GoodsBiz = require('./goods_biz.js');
const projectSetting = require('../public/project_setting.js');

class AdminGoodsBiz extends BaseBiz {

	static initFormData(id = '') {
		let cateIdOptions = GoodsBiz.getCateList();

		return {
			id,

			cateIdOptions,
			fields: projectSetting.GOODS_FIELDS, 
		
			formTitle: '',
			formCateId: (cateIdOptions.length == 1) ? cateIdOptions[0].val : '',
			formOrder: 9999,
			
			formForms: [],
		}

	}

}

AdminGoodsBiz.CHECK_FORM = {
	title: 'formTitle|must|string|min:2|max:50|name=标题',
	cateId: 'formCateId|must|id|name=分类',
	order: 'formOrder|must|int|min:0|max:9999|name=排序号',
	forms: 'formForms|array',
};


module.exports = AdminGoodsBiz;