/**
 * Notes:统计后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-10 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js'); 
const MonthModel = require('../../model/month_model.js');  

class AdminStatService extends BaseProjectAdminService { 

	async getAdminMonthList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'MONTH_TITLE': 'desc',
			'MONTH_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {};
		if (search && search.includes('#')) {
			let arr = search.split('#');
			where.MONTH_TITLE = ['between', arr[0], arr[1]];
		}


		return await MonthModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = AdminStatService;