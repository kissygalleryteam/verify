## 综述

verify,灵活的垂直表单验证组件。

表单验证的配置非常灵活，既可以选择内置的规则，也可以自己指定校验方法。

由于所依赖的业务方原因，组件提供的默认样式更适用于垂直化的表单验证。



## 快速使用

### 初始化组件

     S.use('gallery/verify/1.4/index', function (S, verify) {
             var verify = new verify(S.one('#J_Container1'),{
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
                         ['email', '请检查电子邮箱的格式是否正确。']
                     ]
                 }
             });

##  参数 el 容器container，所有的dom操作都限定于此
## 参数 confing

<table>
<tr>
<td>字段</td>
<td>类型</td>
<td>含义</td>
<td>说明</td>
</tr>
<tr>
<td>fields</td>
<td>object</td>
<td>要校验的域。</td>
<td>fields对应的value值是一个数值，每个数组的项表示一个校验规则集，可以是数组、函数或字符串，具体意义参见“内置规则校验”表格</td>
</tr>
<tr>
<td>nodeFn</td>
<td>function</td>
<td>要校验的表单域节点</td>
<td>默认按fields的name值对应节点id获取</td>
</tr>
<tr>
<td>valueFn</td>
<td>function </td>
<td>验证时的value值获取</td>
<td>默认获取对应input的value值（如果域节点不是input 默认返回''空字符串)</td>
</tr>
<tr>
<td>disabled</td>
<td>array</td>
<td>被禁用的域</td>
<td>默认为空数组 </td>
</tr>
<tr>
<td>autoVerify</td>
<td>boolean</td>
<td>是否自动校验 </td>
<td>默认 true</td>
</tr> 
<tr>
<td>errorTipTpl</td>
<td>html片段</td>
<td>错误提示dom结构</td>
<td>如果想重置默认的提示样式，可以传入自定义的template，但要注意的是：显示错误文案的容器需加J_InfoContainer这个JS的class钩子,否则会直接在错误容器里面写html</td>
</tr>
<tr>
<td>errorWraper</td>
<td>KISSY Selector</td>
<td>错误提示append的位置</td>
<td>可以指定错误提示显示位置，默认为null,此时在域所在节点的父元素下append。由于没有指定的样式和交互，如果选择了这个参数，可能需要自行调整交互</td>
</tr>
</table>

内置规则校验

* 函数 此时可以自己定义验证方法，回调参数为验证时的value值。返回格式为[isSuceess{boolean},info{string}]
* 数组 此时第一个数组项为规则名称，最后一个为错误提示文案，中间的为其他参数
* 字符串 此时字符串既为规则名称

<table>
<tr>
<td>规则名称</td>
<td>含义</td>
<td>参数</td>
<td>规则</td>
<td>默认错误值</td>
</tr>
<tr>
<td>required</td>
<td>必填</td>
<td>info</td>
<td>为空时不通过</td>
<td>'亲，不能为空。'</td>
</tr>
<tr>
<td>name</td>
<td>名字</td>
<td>info</td>
<td>名字中有中英文之外的字符时不通过</td>
<td>姓名只能由中文或英文字母组成，请检查是否存在其它字符</td>
</tr>
<tr>
<td>length</td>
<td>长度</td>
<td>[min,max,]info</td>
<td>先校验最小长度 ;再校验最大长度</td>
<td>亲，长度至少需要min || 亲，长度最多不能超过max</td>
</tr>
<tr>
<td>email</td>
<td>邮件格式</td>
<td>info</td>
<td> </td>
<td>亲，请输入正确的email格式。</td>
</tr>
<tr>
<td>english</td>
<td>英文字母</td>
<td>info</td>
<td>规则</td>
<td>亲，这里只能输入英文字母。</td>
</tr>
<tr>
<td>mobile</td>
<td>简单的手机号码校验</td>
<td>info</td>
<td>只要是纯数字和-的组合即可</td>
<td>手机号码必须为数字。</td>
</tr>
<tr>
<td>range</td>
<td>含义</td>
<td>min,max,info</td>
<td>数值区间</td>
<td>亲，只能在{min}至{max}之间</td>
</tr>
<tr>
<td>number</td>
<td>含义</td>
<td>info</td>
<td>规则</td>
<td>亲，只能输入数字。</td>
</tr>
<tr>
<td>pattern</td>
<td>正则表达式</td>
<td>info</td>
<td>不匹配正则时报错</td>
<td>亲，输入格式有误。</td>
</tr>
<tr>
<td>date</td>
<td>日期格式</td>
<td>info</td>
<td>不满足YYYY-MM-DD时报错</td>
<td>请填写正确的日期格式：YYYY-MM-DD。</td>
</tr>
</table>
	
	 
	 
 

## API说明
<table>
<tr>
<td>方法</td>
<td>参数</td>
<td>含义</td>
<td>返回值</td>
</tr>
<tr>
<td>verify</td>
<td>(field{string})</td>
<td>要校验的域。不传时校验所有的域</td>
<td>{succeed:boolean,results:[{succeed:boolean,info:'errMsg' },firstError]}</td>
</tr>
<tr>
<td>add</td>
<td>(field,value)<br/>field 域名 ;value 规则</td>
<td>添加校验域</td>
<td></td>
</tr>
<tr>
<td>remove</td>
<td>(field) </td>
<td>移除校验域</td>
<td> </td>
</tr>
<tr>
<td>modify</td>
<td>(field ,value)</td>
<td>修改某个域的校验规则</td>
<td> </td>
</tr>
<tr>
<td>disable </td>
<td>(field,isable)<br/>isable[boolean]是否可用 true可以，false 不可以 </td>
<td>禁用/启用某个域</td>
<td> </td>
</tr>
<tr>
<td>reset</td>
<td>(field)<br/>field要重置的域，不传时为所有域
</td>
<td>重置状态</td>
<td> </td>
</tr>
<tr>
<td>destroy </td>
<td></td>
<td>注销</td>
<td> </td>
</tr>
 
<tr>
<td>error</td>
<td></td>
<td>显示错误信息并标注错误状态</td>
<td> </td>
</tr>
</table>


## 提供事件
<table>
<tr>
<td>事件名称</td>
<td>触发条件</td>
<td>提供数据</td>
</tr>
<tr>
<td>verify</td>
<td>每一个域校验结束之后</td>
<td>field 域 info 信息 succeed 是否成功（true 成功 false 失败）</td>
</tr>
<tr>
<td>fail</td>
<td>每一个域校验失败之后</td>
<td>field 域 info 信息 </td>
</tr>
</table>

