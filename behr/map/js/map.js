
var env = {
	map: null,
	vars: {
		scrsize: ko.observable({w: 0, h: 0}),
		activeShopIdx: ko.observable(0),
	},
	shops: [
		{id: 0, marker: new BMap.Marker(new BMap.Point(116.4948820000, 39.8954080000)), name: '北京东四环店', addr: '北京市朝阳区东四环红星美凯龙世博建材中心三层C-6314', phone: '010-87951860'},
		{id: 1, marker: new BMap.Marker(new BMap.Point(116.2794360000, 39.8889170000)), name: '北京西四环店', addr: '北京市丰台区西四环中路红星美凯龙一层B8199', phone: '010-63865782'},
		{id: 2, marker: new BMap.Marker(new BMap.Point(117.1595870000, 39.1589040000)), name: '天津红桥店', addr: '天津市红桥区红旗路1号红星美凯龙二层B8136', phone: '022-27328861'},
		{id: 3, marker: new BMap.Marker(new BMap.Point(117.2416340000, 39.0774680000)), name: '天津环渤海店', addr: '天津市河西区解放南路473号环渤海五金涂料大厦2F6-1', phone: '022-88240455'},
		{id: 4, marker: new BMap.Marker(new BMap.Point(117.2658280000, 39.1263740000)), name: '天津河东店', addr: '天津市河东区津滨大道160号红星美凯龙二层B8257', phone: '022-84318861'},
		{id: 5, marker: new BMap.Marker(new BMap.Point(108.9307180000, 34.2408460000)), name: '西安太白店', addr: '西安市碑林区太白北路1号红星美凯龙南门1-5-001A', phone: '029-62991870'},
		{id: 6, marker: new BMap.Marker(new BMap.Point(120.2071020000, 30.2717750000)), name: '杭州佳好佳店', addr: '杭州市江干区秋涛北路118号佳好佳居饰商城西区C107', phone: '0571-56280902, 0571-88317371'},
		{id: 9, marker: new BMap.Marker(new BMap.Point(114.3567860000, 30.5184790000)), name: '南国大武汉家装江南店', addr: '洪山区珞狮南路425号南国大武汉家装江南店负一层DF1-27号', phone: '027-87571022'},
		{id: 10, marker: new BMap.Marker(new BMap.Point(123.3667710000, 41.8057260000)), name: '沈阳帮众店', addr: '沈阳市铁西区齐贤北街29号', phone: '024-25422201'},
		{id: 10, marker: new BMap.Marker(new BMap.Point(121.5865010000, 38.9106330000)), name: '大连解放广场店', addr: '大连市沙河口区五一路96号7-8门', phone: '0411-84398146'},
		{id: 10, marker: new BMap.Marker(new BMap.Point(120.2324230000, 31.9086950000)), name: '江阴红星美凯龙店', addr: '江阴市五星路红星美凯龙生活广场2楼百色熊涂料', phone: '0510-86032336'},

		{id: 12, marker: new BMap.Marker(new BMap.Point(116.546309, 39.9212270000)), name: '家倍得北京东五环店', addr: '北京市朝阳区朝阳路高井村甲8号红星美凯龙负二楼前厅', phone: '010-85596672'},
		{id: 13, marker: new BMap.Marker(new BMap.Point(116.494832, 39.8935190000)), name: '家倍得北京东四环店', addr: '北京市朝阳区东四环中路193号红星美凯龙建材馆四楼东南角/一楼舞台背后', phone: '010-67729691'},
		{id: 14, marker: new BMap.Marker(new BMap.Point(116.2794360000, 39.8893050000)), name: '家倍得北京西四环店', addr: '北京市丰台区西四环中路113号红星美凯龙负一楼免费咨询处', phone: '010-63832340'},
		{id: 15, marker: new BMap.Marker(new BMap.Point(116.3774820000, 40.0082970000)), name: '家倍得北京北四环店', addr: '北京市朝阳区北四环健翔桥北600米（北沙滩1号东北角）红星美凯龙一楼东南角', phone: '010-64848840'},
		{id: 16, marker: new BMap.Marker(new BMap.Point(116.4449090000, 40.0295430000)), name: '家倍得北京北五环店', addr: '北京市朝阳区来广营西路59号红星美凯龙负一楼', phone: '010-64828471'},
		{id: 17, marker: new BMap.Marker(new BMap.Point(119.9889310000, 31.7925280000)), name: '家倍得常州店', addr: '常州市飞龙东路68号红星美凯龙飞龙商场装饰城三楼', phone: '0519-83381872'},
		{id: 18, marker: new BMap.Marker(new BMap.Point(118.8057160000, 31.9948140000)), name: '家倍得南京店', addr: '南京市秦淮区卡子门大街29号红星美凯龙商场南区二楼', phone: '025-86805299'},
		{id: 19, marker: new BMap.Marker(new BMap.Point(120.4046290000, 36.1304330000)), name: 'BEHR百色熊涂料产品青岛店', addr: '青岛市长沙路38号河西建材市场B区3号二楼销售中心', phone: '0532-82835777/82802787'},
		{id: 20, marker: new BMap.Marker(new BMap.Point(121.3914760000, 31.2444580000)), name: '家倍得上海真北店', addr: '上海市普陀区真北路1108号红星美凯龙真北商场南馆1号门一楼入口处', phone: '021-62376962'},
		{id: 21, marker: new BMap.Marker(new BMap.Point(121.4250240000, 31.0935380000)), name: '家倍得上海浦江店', addr: '上海市闵行区浦新公路1969号一楼南1号门', phone: '021-31371015'},
		{id: 22, marker: new BMap.Marker(new BMap.Point(121.5664780000, 31.1657440000)), name: '家倍得上海沪南店', addr: '上海市浦东新区临御路518号红星美凯龙浦东沪南商场负一楼前厅', phone: '021-68783909'},
		{id: 23, marker: new BMap.Marker(new BMap.Point(121.566131, 31.1634010000)), name: '家倍得上海金桥店', addr: '上海市浦东新区金藏路100 红星美凯龙一楼', phone: '4009661158'},
		{id: 24, marker: new BMap.Marker(new BMap.Point(120.5849560000, 31.2731740000)), name: '家倍得苏州横塘店', addr: '苏州市高新区横塘迎宾路35号红星美凯龙北厅负一楼', phone: '0512-62398028'},
		{id: 25, marker: new BMap.Marker(new BMap.Point(120.6626950000, 31.3394550000)), name: '家倍得苏州园区店', addr: '苏州市工业园区扬清路1号红星美凯龙一楼', phone: '0512-69366582'},
		{id: 26, marker: new BMap.Marker(new BMap.Point(120.6444510000, 31.3823540000)), name: '家倍得苏州蠡口店', addr: '江苏省苏州市相城区大道1160号 红星美凯龙一楼 ', phone: '0512-69366582'},
		{id: 27, marker: new BMap.Marker(new BMap.Point(117.2566680000, 39.1296670000)), name: '家倍得天津河东店', addr: '天津市河东区津滨大道164号红星美凯龙国际博览中心一楼A8507', phone: '022-84318689'},
		{id: 28, marker: new BMap.Marker(new BMap.Point(117.2374740000, 39.0852610000)), name: '家倍得天津河西店', addr: '天津市河西区黑牛城道红星美凯龙一楼后大厅', phone: '022-27721618'},
		{id: 29, marker: new BMap.Marker(new BMap.Point(117.1562240000, 39.1316270000)), name: '家倍得天津红桥店', addr: '天津市红桥区西清路与红旗路交口红星美凯龙二楼B8028	', phone: '022-27721618'},
		{id: 30, marker: new BMap.Marker(new BMap.Point(120.3985980000, 31.5843360000)), name: '家倍得无锡锡山店', addr: '无锡锡山区团结南路1号红星美凯龙锡山商场1号馆一楼/三楼', phone: '0510-88258167'},
		{id: 31, marker: new BMap.Marker(new BMap.Point(120.2359260000, 31.9070970000)), name: '家倍得无锡江阴店', addr: '江阴市西外环路五星路交接处539号红星美凯龙', phone: '0510-86031187'},
		{id: 31, marker: new BMap.Marker(new BMap.Point(123.3871400000, 41.8106880000)), name: '家倍得沈阳铁西店', addr: '铁西区北二东路35号红星美凯龙家居', phone: '024-85637411'},
	],
	evts: {
		clickShop: function(shop){
			console.log(shop.marker);
			env.map.clearOverlays();
			env.map.centerAndZoom(shop.marker.point, 13);
			env.map.addOverlay(shop.marker);
			env.vars.activeShopIdx(shop.id);
			// marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
		}
	}
};

$(function(){
	if (!app.init())
		return;

	var initId = getParameterValue('id');
	!initId && (initId = 0);

	env.vars.scrsize({w: $(window).width(), h: $(window).height()});
	ko.applyBindings(env);

	env.map = new BMap.Map("map_canvas");
	env.evts.clickShop(env.shops[initId]);

	// 添加带有定位的导航控件
	var navigationControl = new BMap.NavigationControl({
		// 靠左上角位置
		anchor: BMAP_ANCHOR_TOP_LEFT,
		// LARGE类型
		type: BMAP_NAVIGATION_CONTROL_LARGE,
		// 启用显示定位
		enableGeolocation: true
	});
	env.map.addControl(navigationControl);
	// 添加定位控件
	var geolocationControl = new BMap.GeolocationControl();
	geolocationControl.addEventListener("locationSuccess", function(e){
		// 定位成功事件
		var address = '';
		address += e.addressComponent.province;
		address += e.addressComponent.city;
		address += e.addressComponent.district;
		address += e.addressComponent.street;
		address += e.addressComponent.streetNumber;
		// alert("当前定位地址为：" + address);
	});
	geolocationControl.addEventListener("locationError",function(e){
		// 定位失败事件
		alert(e.message);
	});
	env.map.addControl(geolocationControl);
});
