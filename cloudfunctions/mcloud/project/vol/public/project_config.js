module.exports = {
	// ## 缓存相关  
	CACHE_CALENDAR_TIME: 60 * 30, //日历缓存     
 

	// ### 会员购买相关 
	MEMBER_RULES: [
		{ money: 120 * 100, day: 365, label: '普通会员', type: 2 },
		{ money: 80 * 100, day: 365, label: '学生会员', type: 1 },

	],

}