/**
 * @author chishang.lcw
 */
var NULL=null,
INFO="测试错误返回值",
EMPTY="",
BLANK=" ",
FALSE=false,
TRUE=true,
ZERO=0,
UNDEFINED=undefined,
NAN=NaN;
var FALSEARR=[NULL,EMPTY,FALSE,ZERO,UNDEFINED,NAN];

function test(arr){
	_.each(arr,function(num){
		var des=num[0],
		fun=num[1],
		arg=num[2],
		index=num[3]
		tobe=num[4];
		it(des,function(){
		  	expect(fun.apply(null,arg)[index]).toBe(tobe);
		});	
	});
}
/**
 * 规则测试用例
 */
describe("RULE", function() {
	//必填项
	describe("required", function() {
		  var info='亲，不能为空。',
		  required=V.rule.required;
		  it("当输入内容为空时，验证不通过", function() {
		  	 expect(required(EMPTY)[0]).toBe(false);
		  });
		  it("当输入内容为空格时，验证通过", function() {
		  	 expect(required(BLANK)[0]).toBe(true);
		  });
		  it("当输入内容为false时，验证通过", function() {
		  	 expect(required(FALSE)[0]).toBe(true);
		  });
		  it("当输入内容为0时，验证通过", function() {
		  	 expect(required(0)[0]).toBe(true);
		  });
		  it("当验证失败时，如果没有传入info参数，返回默认值", function() {
		  	 expect(required(EMPTY)[1]).toBe(info);
		  });
		  it("当验证失败时，如果传入info参数，返回参数值", function() {
		  	 expect(required(EMPTY,INFO)[1]).toBe(INFO);
		  });
		  it("当验证失败时，如果传入info为假值，返回默认值", function() {
		  	_.each(FALSEARR,function(num){
		  		expect(required(EMPTY,num,[])[1]).toBe(info);
		  	});
		  });
	});
	
	//长度限制
	describe("length",function(){
		var max=30,
		smax="测试长度不能超过最大测试长度不能超过最大测试长度不能超过最大",
		smin="测试长度不能超过最大"
		min=10,
		value=[smin,smax],
		info=[],
		arg=[min,max],
		length=V.rule.length;
		it("测试边界值",function(){
			_.each(value,function(num){
		  		expect(length(num,null,arg)[0]).toBe(true);
		  	});
		});
		
		it("测试小于或大于某个值",function(){
			var arr=[smin.slice(2),smax+BLANK];
			_.each(arr,function(num){
		  		expect(length(num,null,arg)[0]).toBe(false);
		  	});
		});
		
		it("测试中间值",function(){
			var arr=[smin+BLANK,smax.slice(2)];
			_.each(arr,function(num){
		  		expect(length(num,null,arg)[0]).toBe(true);
		  	});
		});
		
		it("当验证值小于min时，错误提示返回'亲，长度至少需要min'",function(){
			 expect(length(smin.slice(1),null,arg)[1]).toBe('亲，长度至少需要' + min);
		});
		it("当验证值大于max时，错误提示返回'亲，长度最多不能超过max'",function(){
			 expect(length(smax+BLANK,null,arg)[1]).toBe('亲，长度最多不能超过' + max);
		});
		
		it("当传入info参数时，如果验证失败，错误提示信息为info参数",function(){
			var arr=[smin.slice(2),smax+BLANK],
			error="长度必须在min到max之间";
			_.each(arr,function(num){
		  		expect(length(num,error,arg)[1]).toBe(error);
		  	});
		});
	});
	
	//邮箱
	describe("email",function(){
		var arr=["333","333@dd","333@ddcom","@dd.com","1@.com","1@dd."],
		rarr=["","1.2@c.l"],
		email=V.rule.email;
		it("错误邮箱格式验证",function(){
			_.each(arr,function(num){
		  		expect(email(num,null)[0]).toBe(false);
		  	});
		});
		
		it("正确邮箱格式验证",function(){
			_.each(rarr,function(num){
		  		expect(email(num,null)[0]).toBe(true);
		  	});
		});
	});
	
	//英文
	describe("english",function(){
		var arr=["afv333","erew.ll"," erew.ll","\nerew.ll"],
		rarr=["","ascxd"],
		english=V.rule.english;
		it("错误英文格式验证",function(){
			_.each(arr,function(num){
		  		expect(english(num,null)[0]).toBe(false);
		  	});
		});
		
		it("正确英文格式验证",function(){
			_.each(rarr,function(num){
		  		expect(english(num,null)[0]).toBe(true);
		  	});
		});
	});
	
	//手机号码
	describe("cellphone",function(){
		var cellphone=V.rule.cellphone;
		var arr=[["错误验证：超过11位","186001920390","手机号码为11位数字，您输入的号码为12位，请仔细查看并修改"],
			["错误验证：不足11位",'1860034343',"手机号码为11位数字，您输入的号码为10位，请仔细查看并修改"],
			["错误验证：含有空格",'186 0034 343',"手机号码为11位数字，您输入的号码包含非数字字符，请仔细查看并修改"],
			["错误验证：号码不存在",'11600343439',"您输入的号码不存在，请仔细查看并修改"],
			["错误验证：包含其他字符",'wew343',"手机号码为11位数字，您输入的号码包含非数字字符，请仔细查看并修改"]
		];
		_.each(arr,function(num){
			it(num[0],function(){
			  	expect(cellphone(num[1],null)[1]).toBe(num[2]);
			});	
		});
	});
	
	//区间
	describe("range",function(){
		var range=V.rule.range;
		var arr=[["错误验证：小于区间",range,[3,NULL,[10,20]],0,false],
				["错误验证：大于区间",range,[33,NULL,[10,20]],0,false],
				["正确验证：最小值",range,[10,NULL,[10,20]],0,true],
				["正确验证：最大值",range,[20,NULL,[10,20]],0,true],
				["正确验证：区间值",range,[13,NULL,[10,20]],0,true]
		];
		test(arr);
	});
	
});
 