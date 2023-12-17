/**
 * Notes: 用户管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-01-22  07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');

const util = require('../../../../framework/utils/util.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const UserModel = require('../../model/user_model.js'); 
const AdminHomeService = require('./admin_home_service.js'); 

// 导出用户数据KEY
const EXPORT_USER_DATA_KEY = 'EXPORT_USER_DATA';

class AdminUserService extends BaseProjectAdminService {
 
	/** 获得某个用户信息 */
	async getUser({
		userId,
		fields = '*'
	}) {
		let where = {
			USER_MINI_OPENID: userId,
		}
		return await UserModel.getOne(where, fields);
	}

	/** 取得用户分页列表 */
	async getUserList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		whereEx, //附加查询条件 
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_ADD_TIME: 'desc'
		};
		let fields = '*';


		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				USER_NAME: ['like', search]
			},
			{
				USER_MOBILE: ['like', search]
			},
			{
				USER_MEMO: ['like', search]
			},
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					where.and.USER_STATUS = Number(sortVal);
					break;
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'USER_ADD_TIME');
					break;
				}
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal, false);


		// 为导出增加一个参数condition
		result.condition = encodeURIComponent(JSON.stringify(where));

		return result;
	}

	async statusUser(id, status, reason) {
		status = Number(status);
		let whereUser = {
			USER_MINI_OPENID: id,
			USER_STATUS: ['<>', status]
		}
		await UserModel.edit(whereUser, { USER_STATUS: status, USER_CHECK_REASON: reason });
	}

	/**删除用户 */
	async delUser(id) {
		let whereUser = {
			USER_MINI_OPENID: id
		}

		// ** 删除用户记录
		await UserModel.del(whereUser);


		// ** 删除用户其他数据 
		let adminHomeService = new AdminHomeService();
		adminHomeService.clearUserData(id);

	}

	// #####################导出用户数据

	/**获取用户数据 */
	async getUserDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_USER_DATA_KEY);
	}

	/**删除用户数据 */
	async deleteUserDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_USER_DATA_KEY);
	}

	/**导出用户数据 */
	async exportUserDataExcel(condition, fields) {

		let where = {
			//USER_STATUS: ['in', '1,8']
		};

		if (condition) {
			where = JSON.parse(decodeURIComponent(condition));
		}

		// 计算总数
		let total = await UserModel.count(where);
		console.log('[ExportUser] TOTAL=' + total);

		// 定义存储数据 
		let data = [];

		const options = {
			'!cols': [
				{ column: '序号', wch: 10 },
				{ column: '姓名', wch: 20 },
				{ column: '手机', wch: 15 },
				{ column: '状态', wch: 15 },
				{ column: '注册时间', wch: 30 },
				...dataUtil.getTitleByForm(fields)
			]
		};

		// 标题栏
		let ROW_TITLE = options['!cols'].map((item) => (item.column));
		data.push(ROW_TITLE);

		// 按每次100条导出数据
		let size = 100;
		let page = Math.ceil(total / size);
		let orderBy = {
			'USER_ADD_TIME': 'desc'
		}

		let order = 0;
		for (let i = 1; i <= page; i++) {
			let list = await UserModel.getList(where, '*', orderBy, i, size, false);
			console.log('[ExportUser] Now export cnt=' + list.list.length);

			for (let k = 0; k < list.list.length; k++) {
				let node = list.list[k];

				order++;

				// 数据节点
				let arr = [];
				arr.push(order);

				arr.push(node.USER_NAME);
				arr.push(node.USER_MOBILE);
				arr.push(UserModel.getDesc('STATUS', node.USER_STATUS));
				arr.push(timeUtil.timestamp2Time(node.USER_ADD_TIME, 'Y-M-D h:m:s'));

				// 表单
				for (let k = 0; k < fields.length; k++) {
					arr.push(dataUtil.getValByForm(node.USER_FORMS, fields[k].mark, fields[k].title));
				}

				data.push(arr)
			}

		}

		return await exportUtil.exportDataExcel(EXPORT_USER_DATA_KEY, '用户数据', total, data, options);

	}

}

module.exports = AdminUserService;