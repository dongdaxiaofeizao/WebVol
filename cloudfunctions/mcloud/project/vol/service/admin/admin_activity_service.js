/**
 * Notes: 活动后台管理
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-23 07:48:00 
 */

const BaseProjectAdminService = require('./base_project_admin_service.js');
const ActivityService = require('../activity_service.js');
const util = require('../../../../framework/utils/util.js');
const cloudUtil = require('../../../../framework/cloud/cloud_util.js');
const cloudBase = require('../../../../framework/cloud/cloud_base.js');
const timeUtil = require('../../../../framework/utils/time_util.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const ActivityModel = require('../../model/activity_model.js');
const ActivityJoinModel = require('../../model/activity_join_model.js');
const exportUtil = require('../../../../framework/utils/export_util.js');
const StatService = require('../stat_service.js');

// 导出报名数据KEY
const EXPORT_ACTIVITY_JOIN_DATA_KEY = 'EXPORT_ACTIVITY_JOIN_DATA';

class AdminActivityService extends BaseProjectAdminService {

	/** 删除活动 */
	async delActivity(id) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**添加 */
	async insertActivity({
		title,
		cateId,
		cateName,

		maxCnt,
		start,

		begin,
		stop,

		address,
		addressGeo,

		cancelSet,

		order,
		forms,
		joinForms,
	}) {

		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**更新数据 */
	async editActivity({
		id,
		title,
		cateId, // 二级分类 
		cateName,

		maxCnt,
		start,

		begin,
		stop,

		address,
		addressGeo,

		cancelSet,

		order,
		forms,
		joinForms
	}) {

		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/**修改状态 */
	async statusActivity(id, status) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	async genDetailQr(type, id) {

		let cloud = cloudBase.getCloud();

		let page = `projects/${this.getProjectId()}/pages/${type}/detail/${type}_detail`;
		console.log('page=', page);
		let result = await cloud.openapi.wxacode.getUnlimited({
			scene: id,
			width: 280,
			check_path: false,
			//env_version: 'trial', //release,trial,develop
			page
		});

		let cloudPath = `${this.getProjectId()}/${type}/${id}/qr.png`;
		console.log('cloudPath=', cloudPath);
		let upload = await cloud.uploadFile({
			cloudPath,
			fileContent: result.buffer,
		});

		if (!upload || !upload.fileID) return;

		return upload.fileID;
	}

	// 更新forms信息
	async updateActivityForms({
		id,
		hasImageForms
	}) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/** 后台获取信息 */
	async getActivityDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}

		let activity = await ActivityModel.getOne(where, fields);
		if (!activity) return null;

		return activity;
	}

	/**取得分页列表 */
	async getAdminActivityList({
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
			'ACTIVITY_ORDER': 'asc',
			'ACTIVITY_ADD_TIME': 'desc'
		};
		let fields = 'ACTIVITY_JOIN_CNT,ACTIVITY_TITLE,ACTIVITY_CATE_ID,ACTIVITY_CATE_NAME,ACTIVITY_EDIT_TIME,ACTIVITY_ADD_TIME,ACTIVITY_ORDER,ACTIVITY_STATUS,ACTIVITY_VOUCH,ACTIVITY_MAX_CNT,ACTIVITY_START,ACTIVITY_START_DAY,ACTIVITY_BEGIN,ACTIVITY_STOP,ACTIVITY_CANCEL_SET,ACTIVITY_QR,ACTIVITY_OBJ,user.USER_NAME';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		if (util.isDefined(search) && search) {
			where.or = [{
				ACTIVITY_TITLE: ['like', search]
			},];

		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					where.and.ACTIVITY_CATE_ID = String(sortVal);
					break;
				}
				case 'status': {
					where.and.ACTIVITY_STATUS = Number(sortVal);
					break;
				}
				case 'vouch': {
					where.and.ACTIVITY_VOUCH = 1;
					break;
				}
				case 'top': {
					where.and.ACTIVITY_ORDER = 0;
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'ACTIVITY_ADD_TIME');
					break;
				}
			}
		}

		return await ActivityModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);

	}

	/**置顶与排序设定 */
	async sortActivity(id, sort) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}


	/**首页设定 */
	async vouchActivity(id, vouch) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}


	//#############################
	/**报名分页列表 */
	async getActivityJoinList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序
		activityId,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'ACTIVITY_JOIN_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {
			ACTIVITY_JOIN_ACTIVITY_ID: activityId
		};
		if (util.isDefined(search) && search) {
			where['ACTIVITY_JOIN_FORMS.val'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'status':
					// 按类型  
					where.ACTIVITY_JOIN_STATUS = Number(sortVal);
					break;
				case 'checkin':
					// 签到
					where.ACTIVITY_JOIN_STATUS = ActivityJoinModel.STATUS.SUCC;
					if (sortVal == 1) {
						where.ACTIVITY_JOIN_IS_CHECKIN = 1;
					} else {
						where.ACTIVITY_JOIN_IS_CHECKIN = 0;
					}
					break;
			}
		}

		let ret = await ActivityJoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
		if (ret) {
			ret.activity = await ActivityModel.getOne(activityId, 'ACTIVITY_STATUS');
		}
		return ret;
	}

	/**
	 * 修改报名状态  
	 */
	async statusActivityJoin(activityJoinId, status, reason = '') {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}

	/** 生成自助签到码 */
	async genActivitySelfCheckinQr(page, activityId) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	async _checkActivityJoinBase(activityJoin, score = 0) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 管理员按钮核销签到 */
	async checkinActivityJoin(activityJoinId, flag) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	/** 管理员扫码核销 */
	async scanActivityJoin(activityId, code) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');
	}

	// #####################导出报名数据
	/**获取报名数据 */
	async getActivityJoinDataURL() {
		return await exportUtil.getExportDataURL(EXPORT_ACTIVITY_JOIN_DATA_KEY);
	}

	/**删除报名数据 */
	async deleteActivityJoinDataExcel() {
		return await exportUtil.deleteDataExcel(EXPORT_ACTIVITY_JOIN_DATA_KEY);
	}

	/**导出报名数据 */
	async exportActivityJoinDataExcel({
		activityId,
		status
	}) {
		this.AppError('[志愿者]该功能暂不开放，如有需要请加作者微信：cclinux0730');

	}
}

module.exports = AdminActivityService;