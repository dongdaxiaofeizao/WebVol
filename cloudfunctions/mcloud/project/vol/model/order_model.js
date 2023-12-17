/**
 * Notes:  商品实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-05 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');

class OrderModel extends BaseProjectModel {

}

// 集合名
OrderModel.CL = BaseProjectModel.C('order');

OrderModel.DB_STRUCTURE = {
	_pid: 'string|true',
	ORDER_ID: 'string|true',
	ORDER_USER_ID: 'string|true',

	ORDER_GOODS_ID: 'string|true|comment=商品ID',
	ORDER_GOODS_TITLE: 'string|false|comment=商品标题',
	ORDER_GOODS_CNT: 'int|true|default=1|comment=商品数量',

	ORDER_SCORE: 'int|true|default=0|comment=花费积分',

	ORDER_STATUS: 'int|true|default=1|comment=状态 0=取消,1=待领取,9=完成',

	ORDER_ADD_TIME: 'int|true',
	ORDER_EDIT_TIME: 'int|true',
	ORDER_ADD_IP: 'string|false',
	ORDER_EDIT_IP: 'string|false',
};

// 字段前缀
OrderModel.FIELD_PREFIX = "ORDER_";

/**
 * 状态 0=未启用,1=使用中 
 */
OrderModel.STATUS = {
	CANCEL: 0,
	WAIT: 1,
	OVER: 9
};



module.exports = OrderModel;