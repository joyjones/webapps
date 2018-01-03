var questions = [
	{
		q: '美国有大约多少的购书者已经尝试过电子书订阅服务？',
		a: [
			'4%',
			'8%',
			'12%'
		],
		s: 0
	},{
		q: '2013年国际化进程推进最快的十个国家都在新兴市场，它们中的大多数都位于哪个大洲？',
		a: [
			'非洲',
			'拉丁美洲和加勒比海地区',
			'亚洲',
		],
		s: 1
	},{
		q: '在现今各类众筹项目中规模称雄的“星际公民”是一款什么产品？',
		a: [
			'汽车',
			'星际旅游',
			'游戏',
		],
		s: 2
	},{
		q: '现在拥有联网能力的汽车数量占全球汽车总量的多少？',
		a: [
			'2%',
			'8%',
			'18%',
		],
		s: 1
	},{
		q: '哪家公司准备建造一个“超级电池工厂”，且该工厂计划在2020年前生产出等同于全世界今年一年用量的锂电池？',
		a: [
			'特斯拉和松下',
			'本田和索尼',
			'宝马',
		],
		s: 0
	},{
		q: '根据调研公司Dealogic的数据，美国科技行业2014年的并购总值高达多少美元？',
		a: [
			'1240亿美元',
			'1840亿美元',
			'1940亿美元',
		],
		s: 1
	},{
		q: '2014年全球实际工资受金融危机影响均比各自在2008/2009年度的记录有所降低，下列哪两个国家除外？',
		a: [
			'加拿大和法国',
			'美国和英国',
			'德国和日本',
		],
		s: 0
	},{
		q: '根据联合国数字，畜牧业约占用世界无冰陆地面积的多少？',
		a: [
			'10%',
			'20%',
			'30%',
		],
		s: 2
	},{
		q: '研发和设计一套新的商务舱躺椅或睡舱，并且配备顶级设备后需要花费多少？',
		a: [
			'5万美元',
			'20万美元',
			'35万美元',
		],
		s: 2
	},{
		q: '下列三种产品中，中国的净进口量哪一个最多？',
		a: [
			'铜',
			'煤炭',
			'肉和奶制品',
		],
		s: 0
	}
];

var resultTexts = [
	{
		score: 0,
		title: '非常抱歉',
		desc: [
			'您的分数在60%以下',
			'请下载《经济学人·全球商业评论》App',
			'培养全球视野，再来挑战一次！',
			'点击下方按钮即刻下载'
		]
	},
	{
		score: 0.6,
		title: '恭喜您已具备领先的全球视野！',
		desc: [
			'您是第{RANK}个答对超过60%问题的人，成功进入《经济学人·全球商业评论》排行榜，获得抽奖候选人资格！订阅《经济学人·全球商业评论》App，即可获赠一个月免费访问权限，进一步提升您的商业头脑！'
		]
	}
];