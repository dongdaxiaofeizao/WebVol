/**
 * Notes: 商品模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-07 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const GoodsModel = require('../model/goods_model.js');
const OrderModel = require('../model/order_model.js');
const ScoreModel = require('../model/score_model.js');
const ScoreService = require('../service/score_service.js');

class GoodsService extends BaseProjectService {

	// 下单
	async orderGoods(userId, {
		goodsId,
		cnt = 1,
	}) {
		let where = {
			_id: goodsId,
			GOODS_STATUS: GoodsModel.STATUS.COMM
		}
		let goods = await GoodsModel.getOne(where);
		if (!goods) this.AppError('该商品不存在');

		// 库存
		let whereOrder = {
			ORDER_STATUS: ['in', [OrderModel.STATUS.WAIT, OrderModel.STATUS.OVER]],
			ORDER_GOODS_ID: goodsId
		}
		let orderCnt = await OrderModel.sum(whereOrder, 'ORDER_GOODS_CNT');
		if (goods.GOODS_OBJ.limit - cnt < orderCnt) this.AppError('库存不足，无法兑换');

		let title = goods.GOODS_TITLE;

		let oid = userId + '_' + goodsId + '_' + this._timestamp;
		console.error(111, oid)
		let score = Number(goods.GOODS_OBJ.score) * cnt;
		if (score > 0) {
			let scoreService = new ScoreService();
			await scoreService.changeScore(null, { userId, score: -score, oid, desc: '兑换《' + title + '》' }, '兑换失败');
		}

		// 订单入库
		let data = {
			ORDER_USER_ID: userId,
			ORDER_GOODS_ID: goodsId,
			ORDER_GOODS_TITLE: title,
			ORDER_GOODS_CNT: cnt,
			ORDER_SCORE: score,
			ORDER_STATUS: OrderModel.STATUS.WAIT
		};
		let orderId = await OrderModel.insert(data);

		// 更新 OID
		await ScoreModel.edit({ SCORE_OID: oid }, { SCORE_OID: orderId });

		// 商品统计
		this.statGoods(goodsId);
	}

	// 统计
	async statGoods(goodsId) {
		let whereSale = {
			ORDER_STATUS: ['in', [OrderModel.STATUS.WAIT, OrderModel.STATUS.OVER]],
			ORDER_GOODS_ID: goodsId
		}
		let cntSale = await await OrderModel.sum(whereSale, 'ORDER_GOODS_CNT');

		let whereOver = {
			ORDER_STATUS: OrderModel.STATUS.OVER,
			ORDER_GOODS_ID: goodsId
		}
		let cntOver = await await OrderModel.sum(whereOver, 'ORDER_GOODS_CNT');

		let data = {
			GOODS_SALE_CNT: cntSale,
			GOODS_OVER_CNT: cntOver
		}

		await GoodsModel.edit(goodsId, data);
	}

	/** 浏览信息 */
	async viewGoods(id) {

		let fields = '*';

		let where = {
			_id: id,
			GOODS_STATUS: GoodsModel.STATUS.COMM
		}
		let goods = await GoodsModel.getOne(where, fields);
		if (!goods) return null;

		GoodsModel.inc(id, 'GOODS_VIEW_CNT', 1);

		return goods;
	}


	/** 取得分页列表 */
	async getGoodsList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'GOODS_ORDER': 'asc',
			'GOODS_OBJ.score': 'asc'
		};
		let fields = 'GOODS_SALE_CNT,GOODS_OBJ,GOODS_VIEW_CNT,GOODS_TITLE,GOODS_CATE_ID,GOODS_ADD_TIME,GOODS_ORDER,GOODS_STATUS,GOODS_CATE_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		where.and.GOODS_STATUS = GoodsModel.STATUS.COMM; // 状态  


		if (util.isDefined(search) && search) {
			where.or = [
				{ GOODS_TITLE: ['like', search] },
			];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					if (sortVal) where.and.GOODS_CATE_ID = String(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'GOODS_ADD_TIME');
					break;
				}
			}
		}

		return await GoodsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	//########################ORDER
	async delMyOrder(userId, id) {
		let where = {
			_id: id,
			ORDER_USER_ID: userId,
			ORDER_STATUS: OrderModel.STATUS.COMM
		}
		let order = await OrderModel.getOne(where);
		if (!order) this.AppError('该订单不存在');


		let ret = await OrderModel.del(where);

		// 统计 
		this.statGoods(order.ORDER_GOODS_ID);

		// 退分
		await ScoreModel.del({ SCORE_USER_ID: userId, SCORE_OID: id });
		let scoreService = new ScoreService();
		scoreService.statUserScore(userId);

		return ret;

	}

	async getMyOrdersList(userId, {
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
			'ORDER_ADD_TIME': 'desc'
		};
		let fields = 'ORDER_GOODS_ID,ORDER_ADD_TIME,ORDER_GOODS_TITLE,ORDER_GOODS_CNT,ORDER_SCORE,ORDER_STATUS,goods.GOODS_OBJ.cover';

		let where = {};
		where.and = {
			ORDER_USER_ID: userId,
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [
				{ ORDER_GOODS_TITLE: ['like', search] },
			];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status': {
					where.and.ORDER_STATUS = Number(sortVal);
					break;
				}
			}
		}

		let joinParams = {
			from: GoodsModel.CL,
			localField: 'ORDER_GOODS_ID',
			foreignField: '_id',
			as: 'goods',
		};
		return await OrderModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

}

module.exports = GoodsService;