/**
 * Notes: 积分模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 04:00:00 
 */

const BaseProjectController = require('./base_project_controller.js');
const ScoreService = require('../service/score_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');

class ScoreController extends BaseProjectController {


	async getScoreRankList() {

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

		let service = new ScoreService();

		let result = await service.getScoreRankList(input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {

		}

		result.list = list;

		return result;

	}

	async getMyScoreList() {

		// 数据校验
		let rules = {
			userId: 'string',
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

		let service = new ScoreService();

		input.userId = input.userId || this._userId;
		let result = await service.getScoreList(input);

		// 数据格式化
		let list = result.list;

		for (let k = 0; k < list.length; k++) {
			list[k].SCORE_ADD_TIME = timeUtil.timestamp2Time(list[k].SCORE_ADD_TIME, 'Y-M-D h:m:s');
		}

		result.list = list;

		return result;

	}

}

module.exports = ScoreController;