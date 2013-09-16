## 综述

verify,灵活的垂直表单验证组件。

表单验证的配置非常灵活，既可以选择内置的规则，也可以自己指定校验方法。

由于所依赖的业务方原因，组件提供的默认样式更适用于垂直化的表单验证。



## 快速使用

### 初始化组件

     S.use('gallery/verify/1.0/index', function (S, verify) {
             var verify = new verify({
                 fields:{
                     name: [
                         ['required', '请填写联系人姓名。'],
                         ['length', 0, 30, '联系人姓名不要超过30个字']
                     ],
                     tel: [
                         ['required', '请填写联系人手机号码。'],
                         'mobile'
                     ],
                     phone: [
                         ['mobile', '备选号码必须为数字']
                     ],
                     email: [
                         ['required', '请填写联系人邮箱。'],
                         ['email', '请检查电子邮箱的格式是否正确。']
                     ]
                 }
             });

## confing 参数

* fields [object] 待验证域，对应属性值格式可以为数组、字符串、函数
	* 函数 此时可以自己定义验证方法，回调参数为验证时的value值。返回格式为[isSuceess{boolean},info{string}]
	* 数组 此时第一个数组项为规则名称，最后一个为错误提示文案，中间的为其他参数
	* 字符串 此时字符串既为规则名称
	
	组件为大家提供了一些基本的校验规则(info为错误提示文案)：
	* required(info) 必填项。 为空时报错（info默认值：'亲，不能为空。'）
	* name (info) 名字校验。 名字中有中英文之外的字符时报错（info默认值：''姓名只能由中文或英文字母组成，请检查是否存在其它字符'）。
	* length(min,max,]info) 长度校验 。先校验最小长度 （info默认值：'亲，长度至少需要min'）,再校验最大长度（info默认值：'亲，长度最多不能超过max'）。
	* email(info) 邮件格式验证 （info默认值：'亲，请输入正确的email格式。'）
	* english(info) 英文字母校验 （info默认值：'亲，这里只能输入英文字母。'）
	* mobile(info) 简单的手机号码校验，只有是纯数字和-的组合即可。（info默认值：'手机号码必须为数字。'）
	* range(min,max,info)min 最小值。max 最大值。（info默认值：'亲，只能在{min}至{max}之间。'）
	* number(info)数字校验。非纯数字时报错（info默认值：'亲，只能输入数字。'）
	* date(info) 日期格式校验。不满足YYYY-MM-DD时报错（info默认值：'请填写正确的日期格式：YYYY-MM-DD。'）
	* pattern(reg,info) reg 正则表达式 。不匹配正则时报错（info默认值：'亲，输入格式有误。'）
* nodeFn [function] 出错时错误节点，默认为input节点 
* valueFn [function] 验证时的value值获取,默认获取input的值 
* disabled 被禁用的域 。 默认为空
* autoValidate 是否在input节点的change事件发生时，自动触发校验。默认 true



## API说明

* validate（field）field[string]要校验的域。不传时校验所有的域。返回数据格式：   {succeed:boolean,results:[{succeed:boolean,info:'errMsg' },firstError]}
* add（field,value） 添加校验域。field[string] 域名 ;value 规则
* remove(field) 移除校验域。field[string] 域名 ;
* modify(field ,value) 修改某个域的校验规则。field[string] 域名 ;value 规则
* disable(field,isable) 禁用/启用某个域。 field[string] 域名 ;isable[boolean]是否可用 true可以，false 不可以
* reset(field)重置状态。field要重置的域，不传时为所有域
* destroy 注销
* error 显示错误信息并标注错误状态

## 提供事件

verify 校验结束之后，参数：field 域 info 信息 succeed 是否成功
fail 校验失败之后 参数： field 域 info 信息


