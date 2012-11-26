(function(exports) {
	var isArray = _.isArray,
		each = _.each,
		isFunction = _.isFunction,
		getFunctionName = function(fn) {
            return typeof fn.name === 'string' ? fn.name: /function\s+([^\{\(\s]+)/.test(fn.toString()) ? RegExp['$1'] : '[Unknown]';
        };
    var V = exports.V = {},
    	R = V.rule = {},
    	_undefinedRule = function() {
    		return [false,"规则不存在"]
    	};
    /**
     * 校验规则：必填项
     * @param value {String} 
     * @param arg {}
     * @param info {String} 验证失败时返回的提示信息，默认值:'亲，不能为空。'
     * @return {Array} [issuccess,info]
     */
    R.required = function(value, info, arg) {
        info = info || '亲，不能为空。';
        if (value === '') {
        	return [false, info];
        }
        return [true];
    }

    /**
	 *校验规则：姓名 
	 */
    R.name = function(value, info, arg) {
        info = info || '姓名只能由中文或英文字母组成，请检查是否存在其它字符。';
        if (value === '') 
        	return [true];
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
    R.length = function(value, info, arg) {
        if (value.length === 0) {
        	return [true];
        }
        if (arg[0] && value.length < arg[0]) {
        	return [false, info || '亲，长度至少需要' + arg[0]];
        }
        if (arg[1] && value.length > arg[1]) {
        	return [false, info || '亲，长度最多不能超过' + arg[1]];
        }
        return [true];
    }
    /**
     * 校验规则：邮件
	 * @param {Object} value
	 * @param {Object} arg
	 * @param {Object} info
    */
    R.email = function(value, info, arg) {
        info = info || '亲，请输入正确的email格式。';
        if (value === '') {
        	return [true];
        }
        if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            return [true];
        }
        return [false, info];
    }
    /**
	 * 只能输入英文
	 * @param {Object} value
	 * @param {Object} arg
	 * @param {Object} info
	 */
    R.english = function(value, info, arg) {
        info = info || '亲，这里只能输入英文字母。';
        if (!/^[A-Za-z]*$/.test(value)) {
            return [false, info];
        }
        return [true];
    }
    /**
      * 
	 * @param {Object} value
	 * @param {Object} arg
	 * @param {Object} info
      */
    R.cellphone = function(value, info, arg) {
        var NUM = 12,
        len = value.length;
        if (value === "") {
            return [true];
        } else if (! (/^\d*$/).test(value)) {
            return [false, info || "手机号码为11位数字，您输入的号码包含非数字字符，请仔细查看并修改"];

        } else if (len != 11) {

            return [false, info || "手机号码为11位数字，您输入的号码为" + len + "位，请仔细查看并修改"];
        } else if (! (/^(1(3|4|8)\d{9})|(15[0-35-9]\d{8})$/.test(value))) {
            return [false, info || "您输入的号码不存在，请仔细查看并修改"];
        } else {
            return [true];
        }
    }
    /**
     * 区间
	 * @param {Object} value
	 * @param {Object} range
	 * @param {Object} info
     */
	R.range = function(value, info, arg) { 
	    var min = arg[0],
	    	max = arg[1];
	    info = info || '亲，只能在' + min + '至' + max + '之间。';
	    if (min && (value < min) || max && (value > max)) {
	        return [false, info];
	    }
	    return [true];
	}
    /**
     *数字 
	 * @param {Object} value
	 * @param {Object} arg
	 * @param {Object} info
     */
    R.number = function(value, info, arg) {
        info = info || '亲，只能输入数字。';
        if (!/^\d*$/.test(value)) {
        	return [false, info];;
        }
        return [true];
    }
    /**
       * YYYY-MM-DD
	   * @param {Object} value
	   * @param {Object} info
	   * @param {Object} arg
       */
    R.date = function(value, info, arg) {
        info = info || '请填写正确的日期格式：YYYY-MM-DD';
        if (!/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/.test(value)) {
            return [false, info];
        }
        return [true];
    }
    
    /**
     * @private
	 * @param {String} name 待验证的域的名称
	 * @param {Array} rules 待验证规则
	 * @param {} value 验证传入值
     */
    var validate = function(name, rules, value) {
    	var result = {
	    		"field" : name,
	    		"success" : true,
	    		"info": "验证通过",
	    		"failed":"",
	    		"results" : []
    		},
    		results={},
    		len=rules.length,
    		rule,
    		rname,
    		rarg,
    		rinfo,
    		rfunc,
    		rsuccess,
    		rmsg,
    		rresult={};
    	 for (var i = 0; i < len ; i++){
    	 	rule = rules[i];
    	 	if(isArray(rule)) {
    	 		rname = rule[0];
    	 		rinfo = rule[1];
    	 		rarg = rule[2];
    	 		rfunc = R[rname];
    	 		
    	 	} else if(isFunction(rule)) {
    	 		rname = getFunctionName(rule);
    	 		rfunc = rule;
    	 	} else {
    	 		rname = rule;
    	 		rfunc = R[rname];
    	 	}
    	 	rfunc = rfunc || _undefinedRule;
    	 	rresult = rfunc(value, rinfo, rarg);
    	 	rsuccess = rresult[0];
    	 	rmsg = rresult[1];
    	 	results[rname] = {
    	 		"success" : rsuccess,
    	 		"message" : rmsg
    	 	};
    	 	if(!rsuccess){
    	 		result.success = false;
    	 		result.info = rmsg;
    	 		result.failed = rname;
    	 		break;
    	 	}
    	 }
    	result.results = results;
    	return result;
    }
    V.validate = validate;
    /**
     * 
 	 * @param {Object} fields
 	 * fields 格式：{
 	 * 		fieldName1:[rule1,rule2,...,rulen],
 	 * 		fieldName2:[rule1,rule2,...,rulen]
 	 * 	}
     */
    var validateFields = function(fields) {
    	var result = {
	    		success : true,
	    		failed : "",
	    		results :{}
	    	},
	    	results,
	    	field,
	    	fvalue;
	    console
    	each(fields, function(name, rules, list) {
    		fvalue = "123456";
    		field = validate(name, rules, fvalue);
    		results[name] = field;
    	});
    	
    	return result;
    };
    V.validateFields = validateFields;
    return V;
})(this);