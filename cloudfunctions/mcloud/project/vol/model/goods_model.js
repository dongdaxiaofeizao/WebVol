/**
 * Notes:  商品实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-05 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class GoodsModel extends BaseProjectModel {

}

// 集合名
GoodsModel.CL = BaseProjectModel.C('goods');

GoodsModel.DB_STRUCTURE = {
	_pid: 'string|true',
	GOODS_ID: 'string|true',

	GOODS_TITLE: 'string|true|comment=标题',
	GOODS_STATUS: 'int|true|default=1|comment=状态 0=未启用,1=使用中',

	GOODS_SALE_CNT: 'int|true|default=0|comment=已购买数量',
	GOODS_OVER_CNT: 'int|true|default=0|comment=已完成数量',

	GOODS_CATE_ID: 'string|true|default=0|comment=分类',
	GOODS_CATE_NAME: 'string|false|comment=分类名冗余',

	GOODS_ORDER: 'int|true|default=9999',
	GOODS_VOUCH: 'int|true|default=0',

	GOODS_FORMS: 'array|true|default=[]',
	GOODS_OBJ: 'object|true|default={}',

	GOODS_QR: 'string|false',
	GOODS_VIEW_CNT: 'int|true|default=0',

	GOODS_ADD_TIME: 'int|true',
	GOODS_EDIT_TIME: 'int|true',
	GOODS_ADD_IP: 'string|false',
	GOODS_EDIT_IP: 'string|false',
};

// 字段前缀
GoodsModel.FIELD_PREFIX = "GOODS_";

/**
 * 状态 0=未启用,1=使用中 
 */
GoodsModel.STATUS = {
	UNUSE: 0,
	COMM: 1
};



module.exports = GoodsModel;