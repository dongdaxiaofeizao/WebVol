/**
 * Notes: 商品模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-07 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const GoodsService = require('../service/goods_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class GoodsController extends BaseProjectController {

	/** 列表 */
	async getGoodsList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new GoodsService();
		let result = await service.getGoodsList(input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].GOODS_ADD_TIME = timeUtil.timestamp2Time(list[k].GOODS_ADD_TIME, 'Y-M-D'); 
		}

		return result;

	}


	/** 浏览详细 */
	async viewGoods() {
		// 数据校验
		let rules = {
			id: 'must|id',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new GoodsService();
		let goods = await service.viewGoods(input.id);

		if (goods) {
			goods.GOODS_ADD_TIME = timeUtil.timestamp2Time(goods.GOODS_ADD_TIME, 'Y-M-D');
			goods.leave = goods.GOODS_OBJ.limit - goods.GOODS_SALE_CNT;
			if (!goods.leave) goods.leave = 0;
		}

		return goods;
	}

	/** 浏览详细 */
	async orderGoods() {
		// 数据校验
		let rules = {
			goodsId: 'must|id'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new GoodsService();
		return await service.orderGoods(this._userId, input);
	}

	//################## ORDER
	/** 列表 */
	async getMyOrderList() {

		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			page: 'must|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new GoodsService();
		let result = await service.getMyOrdersList(this._userId, input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].ORDER_ADD_TIME = timeUtil.timestamp2Time(list[k].ORDER_ADD_TIME ); 
		}

		return result;

	}

	async delMyOrder() {

		// 数据校验
		let rules = {  
			id: 'id|must', 
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new GoodsService();
		return await service.delMyOrder(this._userId, input.id); 
	}
}

module.exports = GoodsController;