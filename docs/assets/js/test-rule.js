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

describe("RULE", function() {
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
});
 