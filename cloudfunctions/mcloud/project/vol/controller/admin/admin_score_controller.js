/**
 * Notes: 积分模块后台管理-控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 10:20:00 
 */

const BaseProjectAdminController = require('./base_project_admin_controller.js');
const ScoreService = require('../../service/score_service.js');

const timeUtil = require('../../../../framework/utils/time_util.js');
const contentCheck = require('../../../../framework/validate/content_check.js');

class AdminScoreController extends BaseProjectAdminController {


	async changeScore() {
		await this.isAdmin();

		let rules = {
			userId: 'must',
			score: 'must|int',
			type: 'must|string',
			desc: 'must'
		};

		// 取得数据
		let input = this.validateData(rules);

		let service = new ScoreService();

		if (input.type === '减少') input.score = -Math.abs(input.score);
		console.log(input)
		await service.changeScore(this._admin, input);
	}

}

module.exports = AdminScoreController;