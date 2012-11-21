(function(exports) {
	var V = exports.V = {};
	var R = V.rule = {};
	/**
     * 校验规则：必填项
     * @param value {String} 
     * @param arg {}
     * @param info {String} 验证失败时返回的提示信息，默认值:'亲，不能为空。'
     * @return {Array} [issuccess,info]
     */
	R.required = function(value,info,arg) {
		var info = info ? info: '亲，不能为空。';
		if (value === '') return [false, info];
		return [true];
	}

	/**
	 *校验规则：姓名 
	 */
	R.name = function(value,info,arg) {
		var info = info ? info: '姓名只能由中文或英文字母组成，请检查是否存在其它字符。';
		if (value === '') return [true];
		if (/^[\u4E00-\u9FA5A-Za-z]+$/.test(value)) {
			return [true];
		}
		return [false, info];
	}
	/**
     * 校验规则：长度
	 * @param {Object} value
	 * @param {Object} arg
	 * @param {Object} info
     */
	R.length = function(value,info,arg) {
		if (value.length === 0) return [true];
		if (arg[0] && value.length < arg[0]) return [false, info ? info: '亲，长度至少需要' + arg[0]];
		if (arg[1] && value.length > arg[1]) return [false, info ? info: '亲，长度最多不能超过' + arg[1]];
		return [true];
	}
	/**
     * 校验规则：邮件
	 * @param {Object} value
	 * @param {Object} arg
	 * @param {Object} info
    */
	R.email = function(value,info,arg) {
		var info = info ? info: '亲，请输入正确的email格式。'
		if (value === '') return [true];
		if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
			return [true];
		}
		return [false, info];
	}
	return V;
})(this);