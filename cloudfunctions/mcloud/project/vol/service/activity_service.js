/**
 * Notes: 活动模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');

const StatService = require('./stat_service.js');

const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const ActivityModel = require('../model/activity_model.js');
const UserModel = require('../model/user_model.js');
const ActivityJoinModel = require('../model/activity_join_model.js');

class ActivityService extends BaseProjectService {

	// 获取当前活动状态
	getJoinStatusDesc(activity) {
		let timestamp = this._timestamp;

		if (activity.ACTIVITY_STATUS == ActivityModel.STATUS.UNUSE)
			return '活动停止';
		else if (activity.ACTIVITY_START_DAY < timeUtil.time('Y-M-D'))
			return '活动结束';
		else if (activity.ACTIVITY_BEGIN > timestamp)
			return '报名未开始';
		else if (activity.ACTIVITY_STOP <= timestamp)
			return '报名结束';
		else if (activity.ACTIVITY_MAX_CNT > 0
			&& activity.ACTIVITY_JOIN_CNT >= activity.ACTIVITY_MAX_CNT)
			return '报名已满';
		else
			return '报名中';
	}

	/** 浏览信息 */
	async viewActivity(userId, id) {

		let fields = '*';

		let where = {
			_id: id,
			ACTIVITY_STATUS: ActivityModel.STATUS.COMM,
		}
		let activity = await ActivityModel.getOne(where, fields);
		if (!activity) return null;

		ActivityModel.inc(id, 'ACTIVITY_VIEW_CNT', 1);

		// 判断我是否有报名
		let whereJoin = {
			ACTIVITY_JOIN_USER_ID: userId,
			ACTIVITY_JOIN_ACTIVITY_ID: id,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		let activityJoin = await ActivityJoinModel.getOne(whereJoin);
		if (activityJoin) {
			activity.myActivityJoinId = activityJoin._id;
			activity.myActivityJoinTag = '已报名';
		}

		else {
			activity.myActivityJoinId = '';
			activity.myActivityJoinTag = '';
		}


		return activity;
	}

	/** 取得分页列表 */
	async getActivityList(type = 'run', {
		cateId, //分类查询条件
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
			'ACTIVITY_ORDER': 'asc',
			'ACTIVITY_START': 'asc',
			'ACTIVITY_ADD_TIME': 'desc'
		};
		let fields = 'ACTIVITY_ADDRESS,ACTIVITY_STOP,ACTIVITY_BEGIN,ACTIVITY_JOIN_CNT,ACTIVITY_OBJ,ACTIVITY_VIEW_CNT,ACTIVITY_TITLE,ACTIVITY_MAX_CNT,ACTIVITY_START_DAY,ACTIVITY_START,ACTIVITY_ORDER,ACTIVITY_STATUS,ACTIVITY_CATE_NAME,ACTIVITY_OBJ.cover,ACTIVITY_OBJ.score';

		let where = {};

		if (cateId && cateId !== '0') where.ACTIVITY_CATE_ID = cateId;

		where.ACTIVITY_STATUS = ActivityModel.STATUS.COMM; // 状态  

		// 进行状态
		let day = timeUtil.time('Y-M-D');
		if (type == 'run') {
			where.ACTIVITY_START_DAY = ['>=', day];
		}
		else {
			where.ACTIVITY_START_DAY = ['<', day];
			orderBy = {
				'ACTIVITY_ORDER': 'asc',
				'ACTIVITY_START': 'desc',
				'ACTIVITY_ADD_TIME': 'desc'
			};
		}

		if (util.isDefined(search) && search) {
			where['ACTIVITY_TITLE'] = ['like', search];

		} else if (sortType && util.isDefined(sortVal)) {

			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					if (sortVal) where.ACTIVITY_CATE_ID = String(sortVal);
					break;
				}
				case 'sort': {
					// 排序
					orderBy = this.fmtOrderBySort(sortVal, 'ACTIVITY_ADD_TIME');
					break;
				}
			}
		}

		let ret = await ActivityModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
		if (ret) ret.type = type;
		return ret;
	}


	/** 取得我的报名分页列表 */
	async getMyActivityJoinList(userId, {
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
			'ACTIVITY_JOIN_ADD_TIME': 'desc'
		};
		let fields = 'ACTIVITY_JOIN_IS_CHECKIN,ACTIVITY_JOIN_REASON,ACTIVITY_JOIN_ACTIVITY_ID,ACTIVITY_JOIN_STATUS,ACTIVITY_JOIN_ADD_TIME,activity.ACTIVITY_START,activity.ACTIVITY_TITLE';

		let where = {
			ACTIVITY_JOIN_USER_ID: userId
		};

		if (util.isDefined(search) && search) {
			where['activity.ACTIVITY_TITLE'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType) {
			// 搜索菜单
			switch (sortType) {
				case 'timedesc': { //按时间倒序
					orderBy = {
						'activity.ACTIVITY_START': 'desc',
						'ACTIVITY_JOIN_ADD_TIME': 'desc'
					};
					break;
				}
				case 'timeasc': { //按时间正序
					orderBy = {
						'activity.ACTIVITY_START': 'asc',
						'ACTIVITY_JOIN_ADD_TIME': 'asc'
					};
					break;
				}
				case 'succ': {
					where.ACTIVITY_JOIN_STATUS = ActivityJoinModel.STATUS.SUCC;
					break;
				}
				case 'cancel': {
					where.ACTIVITY_JOIN_STATUS = ActivityJoinModel.STATUS.ADMIN_CANCEL;
					break;
				}
			}
		}

		let joinParams = {
			from: ActivityModel.CL,
			localField: 'ACTIVITY_JOIN_ACTIVITY_ID',
			foreignField: '_id',
			as: 'activity',
		};

		let result = await ActivityJoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);

		return result;
	}

	/** 取得我的报名详情 */
	async getMyActivityJoinDetail(userId, activityJoinId) {

		let fields = '*';

		let where = {
			_id: activityJoinId,
			ACTIVITY_JOIN_USER_ID: userId
		};
		let activityJoin = await ActivityJoinModel.getOne(where, fields);
		if (activityJoin) {
			activityJoin.activity = await ActivityModel.getOne(activityJoin.ACTIVITY_JOIN_ACTIVITY_ID, 'ACTIVITY_TITLE,ACTIVITY_START');
		}
		return activityJoin;
	}

	//################## 报名 
	// 报名 
	async activityJoin(userId, activityId, forms) {

		// 报名是否结束
		let whereActivity = {
			_id: activityId,
			ACTIVITY_STATUS: ActivityModel.STATUS.COMM
		}
		let activity = await ActivityModel.getOne(whereActivity);
		if (!activity)
			this.AppError('该活动不存在或者已经结束');

		// 是否报名开始
		if (activity.ACTIVITY_BEGIN > this._timestamp)
			this.AppError('该活动报名报名尚未开始，请耐心等待');

		// 是否过了报名截止期
		if (activity.ACTIVITY_STOP < this._timestamp)
			this.AppError('该活动报名已经截止，请选择其他活动');


		// 人数是否满
		if (activity.ACTIVITY_MAX_CNT > 0) {
			let whereCnt = {
				ACTIVITY_JOIN_ACTIVITY_ID: activityId,
				ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
			}
			let cntJoin = await ActivityJoinModel.count(whereCnt);
			if (cntJoin >= activity.ACTIVITY_MAX_CNT)
				this.AppError('该活动报名已满，请选择其他活动');
		}

		// 自己是否已经有报名
		let whereMy = {
			ACTIVITY_JOIN_USER_ID: userId,
			ACTIVITY_JOIN_ACTIVITY_ID: activityId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		let my = await ActivityJoinModel.getOne(whereMy);
		if (my) {
			this.AppError('您已经报名成功，无须重复报名');
		}


		// 入库
		let data = {
			ACTIVITY_JOIN_ADD_MONTH: activity.ACTIVITY_ADD_MONTH,
			ACTIVITY_JOIN_USER_ID: userId,
			ACTIVITY_JOIN_ACTIVITY_ID: activityId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC,
			ACTIVITY_JOIN_FORMS: forms,
			ACTIVITY_JOIN_OBJ: dataUtil.dbForms2Obj(forms),
			ACTIVITY_JOIN_CODE: dataUtil.genRandomIntString(15),

		}

		let activityJoinId = await ActivityJoinModel.insert(data);

		// 报名统计数量
		await this.statActivityJoin(activityId);

		// 月统计 
		let statService = new StatService();
		statService.statJoinMonth(activity.ACTIVITY_ADD_MONTH);

		return { activityJoinId }

	}


	async statActivityJoin(id) {
		// 报名数
		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: id,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		let cnt = await ActivityJoinModel.count(where);


		await ActivityModel.edit(id, { ACTIVITY_JOIN_CNT: cnt });
	}

	/**  报名前获取关键信息 */
	async detailForActivityJoin(userId, activityId) {
		let fields = 'ACTIVITY_JOIN_FORMS, ACTIVITY_TITLE';

		let where = {
			_id: activityId,
			ACTIVITY_STATUS: ActivityModel.STATUS.COMM,
		}
		let activity = await ActivityModel.getOne(where, fields);
		if (!activity)
			this.AppError('该活动不存在');


		// 取出本人最近一次的填写表单

		let whereMy = {
			ACTIVITY_JOIN_USER_ID: userId,
		}
		let orderByMy = {
			ACTIVITY_JOIN_ADD_TIME: 'desc'
		}
		let joinMy = await ActivityJoinModel.getOne(whereMy, 'ACTIVITY_JOIN_FORMS', orderByMy);


		let myForms = joinMy ? joinMy.ACTIVITY_JOIN_FORMS : [];

		if (myForms.length == 0) {

			let user = await UserModel.getOne({ USER_MINI_OPENID: userId, USER_STATUS: UserModel.STATUS.COMM });
			if (!user) this.AppError('用户异常');

			// 取得我的报名信息
			myForms = [
				{ mark: 'name', type: 'text', title: '姓名', val: user.USER_NAME },
				{ mark: 'phone', type: 'mobile', title: '手机', val: user.USER_MOBILE },
			]

		}

		activity.myForms = myForms;

		return activity;
	}

	/** 取消我的报名 只有成功可以取消 取消即为删除记录 */
	async cancelMyActivityJoin(userId, activityJoinId) {
		let where = {
			ACTIVITY_JOIN_USER_ID: userId,
			_id: activityJoinId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		};
		let activityJoin = await ActivityJoinModel.getOne(where);

		if (!activityJoin) {
			this.AppError('未找到可取消的报名记录');
		}

		if (activityJoin.ACTIVITY_JOIN_IS_CHECKIN == 1)
			this.AppError('该活动已经签到，无法取消');

		let activity = await ActivityModel.getOne(activityJoin.ACTIVITY_JOIN_ACTIVITY_ID);
		if (!activity)
			this.AppError('该活动不存在');

		if (activity.ACTIVITY_STATUS == ActivityModel.STATUS.UNUSE)
			this.AppError('该活动已停止，不能取消');

		if (activity.ACTIVITY_CANCEL_SET == 0)
			this.AppError('该活动不能取消');

		if (activity.ACTIVITY_CANCEL_SET == 2 && activity.ACTIVITY_STOP < this._timestamp)
			this.AppError('该活动已经截止报名，不能取消');

		await ActivityJoinModel.del(where);

		// 报名数量统计
		await this.statActivityJoin(activityJoin.ACTIVITY_JOIN_ACTIVITY_ID);

		// 月统计 
		let statService = new StatService();
		statService.statJoinMonth(activity.ACTIVITY_ADD_MONTH);
	}


	/** 用户自助签到 */
	async myJoinSelf(userId, activityId) {
		let activity = await ActivityModel.getOne({ _id: activityId, ACTIVITY_STATUS: ActivityModel.STATUS.COMM });
		if (!activity)
			return { ret: '活动不存在或者已经关闭' };


		if (activity.ACTIVITY_START_DAY != timeUtil.time('Y-M-D'))
			return { ret: '仅在活动当天可以签到，当前签到码日期是' + activity.ACTIVITY_START_DAY };

		let whereCheckin = {
			ACTIVITY_JOIN_USER_ID: userId,
			ACTIVITY_JOIN_ACTIVITY_ID: activityId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		let activityJoin = await ActivityJoinModel.getOne(whereCheckin);

		let ret = '';
		if (!activityJoin) {
			ret = '您没有本次活动报名成功的记录，请在「个人中心 - 我的活动报名」查看详情~';
			return { ret };
		}

		if (activityJoin.ACTIVITY_JOIN_IS_CHECKIN == 1) {
			ret = '本次活动您已签到，无须重复签到，请在「个人中心 - 我的活动报名」查看详情~';
			return { ret };
		}


		let score = activity.ACTIVITY_OBJ.score;
		let where = {
			ACTIVITY_JOIN_USER_ID: userId,
			ACTIVITY_JOIN_IS_CHECKIN: 0,
			ACTIVITY_JOIN_ACTIVITY_ID: activityId,
			ACTIVITY_JOIN_STATUS: ActivityJoinModel.STATUS.SUCC
		}
		let data = {
			ACTIVITY_JOIN_SCORE: score,
			ACTIVITY_JOIN_IS_CHECKIN: 1,
			ACTIVITY_JOIN_CHECKIN_TIME: this._timestamp,
		}
		await ActivityJoinModel.edit(where, data);

		if (score > 0)
			ret = '签到成功，获取积分' + score + '分，请在「个人中心 - 我的活动报名」查看详情~';
		else
			ret = '签到成功，请在「个人中心 - 我的活动报名」查看详情~'

		// 积分
		let delay = async () => {
			const ScoreService = require('./score_service.js');
			let scoreService = new ScoreService();
			let scoreData = {
				oid: activityJoin._id,
				userId,
				score: score,
				desc: '参加活动《' + activity.ACTIVITY_TITLE + '》奖励积分'
			}
			scoreService.changeScore(null, scoreData);

			// 月统计 
			let statService = new StatService();
			statService.statJoinMonth(activity.ACTIVITY_ADD_MONTH);
		}
		delay();


		return { ret };
	}

	/** 按天获取报名项目 */
	async getActivityListByDay(day) {
		let start = timeUtil.time2Timestamp(day);
		let end = start + 86400 * 1000 - 1;
		let where = {
			ACTIVITY_STATUS: ActivityModel.STATUS.COMM,
			ACTIVITY_START: ['between', start, end],
		};

		let orderBy = {
			'ACTIVITY_ORDER': 'asc',
			'ACTIVITY_ADD_TIME': 'desc'
		};

		let fields = 'ACTIVITY_TITLE,ACTIVITY_START,ACTIVITY_OBJ.cover';

		let list = await ActivityModel.getAll(where, fields, orderBy);

		let retList = [];

		for (let k = 0; k < list.length; k++) {

			let node = {};
			node.timeDesc = timeUtil.timestamp2Time(list[k].ACTIVITY_START, 'h:m');
			node.title = list[k].ACTIVITY_TITLE;
			node.pic = list[k].ACTIVITY_OBJ.cover[0];
			node._id = list[k]._id;
			retList.push(node);

		}
		return retList;
	}

	/**
	 * 获取从某天开始可报名的日期
	 * @param {*} fromDay  日期 Y-M-D
	 */
	async getActivityHasDaysFromDay(fromDay) {
		let where = {
			ACTIVITY_START: ['>=', timeUtil.time2Timestamp(fromDay)],
		};

		let fields = 'ACTIVITY_START';
		let list = await ActivityModel.getAllBig(where, fields);

		let retList = [];
		for (let k = 0; k < list.length; k++) {
			let day = timeUtil.timestamp2Time(list[k].ACTIVITY_START, 'Y-M-D');
			if (!retList.includes(day)) retList.push(day);
		}
		return retList;
	}


}

module.exports = ActivityService;