/**
 * Notes: 业务基类 
 * Date: 2021-03-15 04:00:00 
 */

const dbUtil = require('../../../framework/database/db_util.js');
const util = require('../../../framework/utils/util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const AdminModel = require('../../../framework/platform/model/admin_model.js');
const NewsModel = require('../model/news_model.js');
const GoodsModel = require('../model/goods_model.js');
const ActivityModel = require('../model/activity_model.js');
const BaseService = require('../../../framework/platform/service/base_service.js');

class BaseProjectService extends BaseService {
	getProjectId() {
		return util.getProjectId();
	}

	async initSetup() {

		let F = (c) => 'bx_' + c;
		const INSTALL_CL = 'setup_vol';
		const COLLECTIONS = ['setup', 'admin', 'log', 'news', 'activity', 'activity_join', 'fav', 'user', 'score', 'month', 'goods', 'order'];
		const CONST_PIC = '/images/cover.gif';



		const NEWS_CATE = '1=组织动态,2=团队介绍,3=活动回顾';
		const ACTIVITY_CATE = '1=品牌项目,2=公益活动,3=培训活动';
		const GOODS_CATE = '1=日用品,2=服饰鞋帽,3=粮油食品,4=纪念品,5=其他';


		if (await dbUtil.isExistCollection(F(INSTALL_CL))) {
			return;
		}

		console.log('### initSetup...');

		let arr = COLLECTIONS;
		for (let k = 0; k < arr.length; k++) {
			if (!await dbUtil.isExistCollection(F(arr[k]))) {
				await dbUtil.createCollection(F(arr[k]));
			}
		}

		if (await dbUtil.isExistCollection(F('admin'))) {
			let adminCnt = await AdminModel.count({});
			if (adminCnt == 0) {
				let data = {};
				data.ADMIN_NAME = 'admin';
				data.ADMIN_PASSWORD = 'e10adc3949ba59abbe56e057f20f883e';
				data.ADMIN_DESC = '超管';
				data.ADMIN_TYPE = 1;
				await AdminModel.insert(data);
			}
		}


		if (await dbUtil.isExistCollection(F('news'))) {
			let newsCnt = await NewsModel.count({});
			if (newsCnt == 0) {
				let newsArr = NEWS_CATE.split(',');
				for (let j in newsArr) {
					let title = newsArr[j].split('=')[1];
					let cateId = newsArr[j].split('=')[0];

					let data = {};
					data.NEWS_TITLE = title + '标题1';
					data.NEWS_DESC = title + '简介1';
					data.NEWS_CATE_ID = cateId;
					data.NEWS_CATE_NAME = title;
					data.NEWS_CONTENT = [{ type: 'text', val: title + '内容1' }];
					data.NEWS_PIC = [CONST_PIC];

					await NewsModel.insert(data);
				}
			}
		}

		if (await dbUtil.isExistCollection(F('activity'))) {
			let activityCnt = await ActivityModel.count({});
			if (activityCnt == 0) {
				let activityArr = ACTIVITY_CATE.split(',');
				for (let j in activityArr) {
					let title = activityArr[j].split('=')[1];
					let cateId = activityArr[j].split('=')[0];

					let data = {};
					data.ACTIVITY_TITLE = title + '1';
					data.ACTIVITY_CATE_ID = cateId;
					data.ACTIVITY_CATE_NAME = title;
					data.ACTIVITY_ADDRESS = '湖南省长沙市岳麓山';
					data.ACTIVITY_START = this._timestamp;
					data.ACTIVITY_START_DAY = timeUtil.time('Y-M-D');
					data.ACTIVITY_ADD_MONTH = timeUtil.time('Y-M');
					data.ACTIVITY_STOP = this._timestamp + 86400 * 1000 * 30;
					data.ACTIVITY_BEGIN = this._timestamp;
					data.ACTIVITY_JOIN_FORMS = [
						{ type: 'text', title: '姓名', must: true },
						{ type: 'mobile', title: '手机', must: true }
					];
					data.ACTIVITY_OBJ = {
						score: 1,
						person: '吴敏',
						tel: '13252652963',
						cover: [CONST_PIC],
						desc: [{ type: 'text', val: title + '1详情介绍' }]
					};

					await ActivityModel.insert(data);
				}
			}
		}

		if (await dbUtil.isExistCollection(F('goods'))) {
			let goodsCnt = await GoodsModel.count({});
			if (goodsCnt == 0) {
				let goodsArr = GOODS_CATE.split(',');
				for (let j in goodsArr) {
					let title = goodsArr[j].split('=')[1];
					let cateId = goodsArr[j].split('=')[0];

					let data = {};
					data.GOODS_TITLE = title + '标题1';
					data.GOODS_CATE_ID = cateId;
					data.GOODS_CATE_NAME = title;
					data.GOODS_OBJ = { cover: [CONST_PIC], limit: 50, score: 10, detail: [{ type: 'text', val: title + '1商品详情' }] };
					await GoodsModel.insert(data);
				}
			}
		}


		if (!await dbUtil.isExistCollection(F(INSTALL_CL))) {
			await dbUtil.createCollection(F(INSTALL_CL));
		}
	}

}

module.exports = BaseProjectService;