/**
 * Notes: 商品模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-11 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');

const AdminGoodsService = require('../../service/admin/admin_goods_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');
const GoodsModel = require('../../model/goods_model.js');

class AdminGoodsController extends BaseProjectAdminController {

	/** 置顶与排序设定 */
	async sortGoods() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			sort: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminGoodsService();
		await service.sortGoods(input.id, input.sort);
	}

	/** 首页设定 */
	async vouchGoods() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			vouch: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminGoodsService();
		await service.vouchGoods(input.id, input.vouch);
	}

	/** 状态修改 */
	async statusGoods() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminGoodsService();
		await service.statusGoods(input.id, input.status);

	}

	/** 列表 */
	async getAdminGoodsList() {
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

		let service = new AdminGoodsService();
		let result = await service.getAdminGoodsList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].GOODS_ADD_TIME = timeUtil.timestamp2Time(list[k].GOODS_ADD_TIME, 'Y-M-D h:m:s');

			if (list[k].GOODS_OBJ && list[k].GOODS_OBJ.detail)
				delete list[k].GOODS_OBJ.detail;
		}
		result.list = list;

		return result;

	}


	/** 发布 */
	async insertGoods() {
		await this.isAdmin();

		// 数据校验 
		let rules = {
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};


		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminGoodsService();
		let result = await service.insertGoods(input);

		this.logOther('添加了《' + input.title + '》');

		return result;

	}


	/** 获取信息用于编辑修改 */
	async getGoodsDetail() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new AdminGoodsService();
		return await service.getGoodsDetail(input.id);

	}

	/** 编辑 */
	async editGoods() {
		await this.isAdmin();

		let rules = {
			id: 'must|id',
			title: 'must|string|min:2|max:50|name=标题',
			cateId: 'must|string|name=分类',
			cateName: 'must|string|name=分类名称',
			order: 'must|int|min:0|max:9999|name=排序号',
			forms: 'array|name=表单',
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminGoodsService();
		let result = service.editGoods(input);

		this.logOther('修改了《' + input.title + '》');

		return result;
	}

	/** 删除 */
	async delGoods() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let title = await GoodsModel.getOneField(input.id, 'GOODS_TITLE');

		let service = new AdminGoodsService();
		await service.delGoods(input.id);

		if (title)
			this.logOther('删除了《' + title + '》');

	}

	/** 更新图片信息 */
	async updateGoodsForms() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			hasImageForms: 'array'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminGoodsService();
		return await service.updateGoodsForms(input);
	}

	//########################### ORDER */
	async statusOrder() {
		await this.isAdmin();

		// 数据校验
		let rules = {
			id: 'must|id',
			status: 'must|int'
		};

		// 取得数据
		let input = this.validateData(rules);

		// 内容审核
		await contentCheck.checkTextMultiAdmin(input);

		let service = new AdminGoodsService();
		return await service.statusOrder(input.id, input.status);
	}


	async getAdminOrderList() {
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

		let service = new AdminGoodsService();
		let result = await service.getAdminOrdersList(input);

		// 数据格式化
		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			list[k].ORDER_ADD_TIME = timeUtil.timestamp2Time(list[k].ORDER_ADD_TIME, 'Y-M-D h:m:s');
		}
		result.list = list;

		return result;

	}

}

module.exports = AdminGoodsController;