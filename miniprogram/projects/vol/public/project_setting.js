

module.exports = { //vol 
	PROJECT_COLOR: '#00B1C2',
	NAV_COLOR: '#ffffff',
	NAV_BG: '#00B1C2',


	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' },
		{ title: '用户使用协议', key: 'SETUP_YS' },
		{ title: '志愿者注册协议', key: 'SETUP_R' }
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
		{ mark: 'sex', title: '性别', type: 'select', selectOptions: ['男', '女'], must: true },
		{ mark: 'birth', title: '生日', type: 'date', must: true },
		{ mark: 'city', title: '城市', type: 'area', ext: {}, must: true },
		{ mark: 'address', title: '地址', type: 'text', must: true },
		{ mark: 'work', title: '职业类型', type: 'select', selectOptions: ['国家公务员', '专业技术人员', '职员', '企业管理人员', '工人', '农民', '学生', '教师', '现役军人', '自由职业者', '个体经营者', '无业人员', '离退休人员', '其他'], must: true },
		{ mark: 'edu', title: '最高学历', type: 'select', selectOptions: ['博士研究生', '硕士研究生', '大学本科', '大学专科', '中等专科', '普通高中', '职业高中', '中小学生', '其他'], must: true }, 
		{ mark: 'skill', title: '特长技能', type: 'textarea', must: true },
	],
	USER_CHECK_FORM: {
		name: 'formName|must|string|min:1|max:30|name=姓名',
		mobile: 'formMobile|must|mobile|name=手机',
		forms: 'formForms|array'
	},


	NEWS_NAME: '公告通知',
	NEWS_CATE: [
		{ id: 1, title: '组织动态' },
		{ id: 2, title: '团队介绍' },
		{ id: 3, title: '活动回顾' },

	],
	NEWS_FIELDS: [
	],

	ACTIVITY_NAME: '活动',
	ACTIVITY_CATE: [
		{ id: 1, title: '品牌项目' }, 
		{ id: 2, title: '公益活动' },
		{ id: 3, title: '培训活动' },
	],
	ACTIVITY_FIELDS: [
		{ mark: 'score', title: '获取积分', type: 'int', must: true },
		{ mark: 'person', title: '联系人', type: 'text', must: true },
		{ mark: 'tel', title: '联系电话', type: 'text', must: true },
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'desc', title: '活动介绍', type: 'content', must: true },
		{ mark: 'album', title: '现场图集', type: 'content', must: false },

	],
	ACTIVITY_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, max: 30, edit: false },
		{ mark: 'phone', type: 'mobile', title: '手机', must: true, edit: false }
	],


	GOODS_NAME: '兑换商品',
	GOODS_CATE: [
		{ id: 1, title: '日用品' },
		{ id: 2, title: '服饰鞋帽' },
		{ id: 3, title: '粮油食品' },
		{ id: 4, title: '纪念品' },
		{ id: 5, title: '其他' },
	],
	GOODS_FIELDS: [
		{ mark: 'limit', title: '商品总数', type: 'int', must: true },
		{ mark: 'score', title: '所需积分', type: 'int', must: true },
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'detail', title: '详细介绍', type: 'content', must: false },
	],

}