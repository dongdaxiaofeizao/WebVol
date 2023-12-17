/**
 * Notes: 积分变动记录实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-03-08 19:20:00 
 */


const BaseProjectModel = require('./base_project_model.js');
class ScoreModel extends BaseProjectModel { }

// 集合名
ScoreModel.CL = BaseProjectModel.C('score');

ScoreModel.DB_STRUCTURE = {
	_pid: 'string|true',
	SCORE_ID: 'string|true',

	SCORE_TYPE: 'int|true|default=1|comment=类型 0=减少，1=增加',
	SCORE_USER_ID: 'string|true|comment=用户ID',
	SCORE_CNT: 'int|true|default=0|comment=当变动值(可正负)',
	SCORE_DESC: 'string|false|comment=备注',

	SCORE_EDIT_METHOD: 'int|true|default=0|comment=操作者0=系统，1=管理员',
	SCORE_EDIT_ADMIN_ID: 'string|false|comment=最近修改的管理员ID',
	SCORE_EDIT_ADMIN_NAME: 'string|false|comment=最近修改的管理员名',

	SCORE_OID: 'string|false',

	SCORE_ADD_TIME: 'int|true',
	SCORE_ADD_IP: 'string|false',

	SCORE_EDIT_TIME: 'int|true',
	SCORE_EDIT_IP: 'string|false',
}

// 字段前缀
ScoreModel.FIELD_PREFIX = "SCORE_";

module.exports = ScoreModel;