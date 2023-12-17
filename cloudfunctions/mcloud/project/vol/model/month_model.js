/**
 * Notes: 月统计记录实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-08 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');
class MonthModel extends BaseProjectModel { }

// 集合名
MonthModel.CL = BaseProjectModel.C('month');

MonthModel.DB_STRUCTURE = {
	_pid: 'string|true',
	MONTH_ID: 'string|true',

	MONTH_TITLE: 'string|true',

	MONTH_YEAR: 'string|true',

	MONTH_ACTIVITY_CNT: 'int|true|default=0|comment=活动数',

	MONTH_ACTIVITY_JOIN_CNT: 'int|true|default=0|comment=活动报名数',
	MONTH_ACTIVITY_CHECK_CNT: 'int|true|default=0|comment=活动签到数',

	MONTH_USER_REG_CNT: 'int|true|default=0|comment=注册数',
	MONTH_USER_CHECK_CNT: 'int|true|default=0|comment=审核数',

	MONTH_ADD_TIME: 'int|true',
	MONTH_ADD_IP: 'string|false',

	MONTH_EDIT_TIME: 'int|true',
	MONTH_EDIT_IP: 'string|false',
}

// 字段前缀
MonthModel.FIELD_PREFIX = "MONTH_";

module.exports = MonthModel;