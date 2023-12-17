/**
 * Notes: 测试模块控制器
 * Date: 2021-03-15 19:20:00 
 */

const BaseController = require('../../controller/base_project_controller.js');
const fakerLib = require('../../../../framework/lib/faker_lib.js'); 
const dataUtil = require('../../../../framework/utils/data_util.js');

const UserModel = require('../../model/user_model.js');
const ActivityModel = require('../../model/activity_model.js');
const ActivityJoinModel = require('../../model/activity_join_model.js');
const ActivityService = require('../../service/activity_service.js');

class TestController extends BaseController {

	async test() {
		console.log('TEST>>>>>>>');
		global.PID = 'vol';

		//	this.mockUser( );
		this.mockActivityJoin()
	}



	async mockUser() {
		console.log('mockUser >>>>>>> Begin....');

		console.log('>>>>delete');
		let delCnt = await UserModel.del({});
		console.log('>>>>delete=' + delCnt);

		for (let k = 1; k <= 50; k++) {
			console.log('>>>>insert >' + k);

			let user = {};
			user.USER_MINI_OPENID = global.PID + '_' + k;
			user.USER_NAME = fakerLib.getName();
			user.USER_MOBILE = fakerLib.getMobile();
			user.USER_STATUS = fakerLib.getIntBetween(0, 1);
			user.USER_ADD_MONTH = fakerLib.getRdArr(['2023-11', '2023-12', '2023-10']);
			user.USER_CHECK_MONTH = fakerLib.getRdArr(['2023-11', '2023-12', '2023-10']);
			user.USER_SCORE_TOTAL = fakerLib.getIntBetween(10, 500);
			await UserModel.insert(user);

		}

		console.log('mockUse <<<< END');
	}

	async mockActivityJoin() {
		console.log('mockActivityJoin >>>>>>> Begin....');

		let delCnt = await ActivityJoinModel.del({});
		console.log('>>>>delete mockActivityJoin =' + delCnt);

		let activityService = new ActivityService();

		let list = await ActivityModel.getAll({});
		for (let k in list) {
			let node = list[k];
			console.log('title=' + list[k].ACTIVITY_TITLE);

			let step = fakerLib.getIntBetween(5, 15);
			for (let j = 0; j < step; j++) {
				console.log('>>>>insert >' + j);

				let data = {};
				data.ACTIVITY_JOIN_ACTIVITY_ID = node._id;
				data.ACTIVITY_JOIN_USER_ID = global.PID + '_' + fakerLib.getIntBetween(1, 48);
				data.ACTIVITY_JOIN_CODE = fakerLib.getIntStr(10);

				data.ACTIVITY_JOIN_FORMS = [
					{ mark: 'name', title: '姓名', type: 'text', val: fakerLib.getName() },
					{ mark: 'phone', title: '手机', type: 'mobile', val: fakerLib.getMobile() }
				];
				data.ACTIVITY_JOIN_OBJ = dataUtil.dbForms2Obj(data.ACTIVITY_JOIN_FORMS);

				await ActivityJoinModel.insert(data);
			}

			// 统计
			await activityService.statActivityJoin(node._id);

		}

		console.log('mockActivityJoin >>>>>>> END');
	}

}

module.exports = TestController;