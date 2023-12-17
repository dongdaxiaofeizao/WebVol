/**
 * Notes: 资讯模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2021-07-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const AdminStatService = require('../../service/admin/admin_stat_service.js');

class AdminStatController extends BaseProjectAdminController { 
	 
	async getAdminMonthList() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminStatService();
		let result = await service.getAdminMonthList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {

		}
		result.list = list;

		return result;

	} 

}

module.exports = AdminStatController;