/**
 * Notes: 统计业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-12-09 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const MonthModel = require('../model/month_model.js'); 
const UserModel = require('../model/user_model.js');
const ActivityModel = require('../model/activity_model.js');
const ActivityJoinModel = require('../model/activity_join_model.js');

class StatService extends BaseProjectService {
	_getYearByMonth(month) {
		return String(month.split('-')[0]);
	}
	
	_getNextMonth() {
		let nextMonth = timeUtil.getMonthLastTimestamp(timeUtil.time()) + 86400 * 1000;
		nextMonth = timeUtil.timestamp2Time(nextMonth, 'Y-M');
		return nextMonth;
	} 
 
	// 注册志愿者数量，审核志愿者数
	async statRegMonth(month = '') {
		let start = timeUtil.time();
		if (!month) month = timeUtil.time('Y-M');

		let whereReg = {
			USER_ADD_MONTH: month
		}
		let cntReg = await UserModel.count(whereReg);

		let whereCheck = {
			USER_CHECK_MONTH: month,
			USER_STATUS: UserModel.STATUS.COMM
		}
		let cntCheck = await UserModel.count(whereCheck);


		let data = {
			MONTH_YEAR: this._getYearByMonth(month),
			MONTH_USER_REG_CNT: cntReg,
			MONTH_USER_CHECK_CNT: cntCheck
		}
		await MonthModel.insertOrUpdate({ MONTH_TITLE: month }, data);

		let duration = timeUtil.time() - start;
		console.log('[statRegMonth]stat=' + month, ',reg cnt=' + cntReg, ',check cnt=' + cntCheck, 'duration=' + duration + 'ms');
	}

	// 活动发起数  
	async statActivityMonth(month = '') {
		let start = timeUtil.time();
		if (!month) month = timeUtil.time('Y-M');

		let where = {
			ACTIVITY_ADD_MONTH: month
		}
		let cnt = await ActivityModel.count(where);

		let data = {
			MONTH_YEAR: this._getYearByMonth(month),
			MONTH_ACTIVITY_CNT: cnt
		}
		await MonthModel.insertOrUpdate({ MONTH_TITLE: month }, data);

		let duration = timeUtil.time() - start;
		console.log('[statActivityMonth]stat=' + month, ',activity cnt=' + cnt, 'duration=' + duration + 'ms');
	}

	// 活动报名数 
	async statJoinMonth(month = '') {
		let start = timeUtil.time();
		if (!month) month = timeUtil.time('Y-M');

		let whereJoin = {
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC,
			ACTIVITY_JOIN_ADD_MONTH: month
		}
		let cntJoin = await ActivityJoinModel.count(whereJoin);

		let whereCheck = {
			ACTIVITY_JOIN_IS_CHECKIN: 1,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC,
			ACTIVITY_JOIN_ADD_MONTH: month
		}
		let cntCheck = await ActivityJoinModel.count(whereCheck);

		let data = {
			MONTH_YEAR: this._getYearByMonth(month),
			MONTH_ACTIVITY_CHECK_CNT: cntCheck,
			MONTH_ACTIVITY_JOIN_CNT: cntJoin
		}
		await MonthModel.insertOrUpdate({ MONTH_TITLE: month }, data);

		let duration = timeUtil.time() - start;
		console.log('[statJoinMonth]stat=' + month, ',join cnt=' + cntJoin, ',check cnt=' + cntCheck, 'duration=' + duration + 'ms');
	}

}

module.exports = StatService;