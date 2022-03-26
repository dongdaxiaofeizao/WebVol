module.exports = {
	PID: 'A00', // 景区
	NAV_COLOR: '#ffffff',
	NAV_BG: '#2674FD',

	MEET_NAME: '预约',

	MENU_ITEM: ['首页', '预约日历', '我的'], // 第1,4,5菜单

	NEWS_CATE: '1=景区动态|leftbig,2=景点攻略|leftbig,3=美食特产|leftbig,4=服务指南|leftbig',
	MEET_TYPE: '1=景点预约|leftbig3,2=停车预约|leftbig2',

	DEFAULT_FORMS: [{
			type: 'line',
			title: '姓名',
			desc: '请填写您的姓名',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		},
		{
			type: 'line',
			title: '手机',
			desc: '请填写您的手机号码',
			must: true,
			len: 50,
			onlySet: {
				mode: 'all',
				cnt: -1
			},
			selectOptions: ['', ''],
			mobileTruth: true,
			checkBoxLimit: 2,
		}
	]
}