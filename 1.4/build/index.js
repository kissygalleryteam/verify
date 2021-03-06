/*
combined files : 

gallery/verify/1.4/index

*/
KISSY.add('gallery/verify/1.4/index',function (S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @class verify
     * @constructor
     * @extends Base
     */
    function Verify(el,cfg) {
        Verify.superclass.constructor.call(this, cfg);
        this.init(el);
    }

    var RULES = {
        required: function (value, arg, info) {
            if (value === '') return [false, info ? info : '亲，此项目为必填项。'];
            return [true];
        },
        name: function (value, arg, info) {
            if (value === '') return [true];
            if (/^[\/\u4E00-\u9FA5A-Za-z]+$/.test(value)) {
                return [true];
            }
            return [false, info ? info : '姓名只能由中文或英文字母组成，请检查是否存在其它字符。'];
        },
        length: function (value, arg, info) {
            if (value === '') return [true];
            if (value.length === 0) return [true];
            if (arg[0] && value.length < arg[0]) return [false, info ? info : '亲，长度至少需要' + arg[0]+'。'];
            if (arg[1] && value.length > arg[1]) return [false, info ? info : '亲，长度最多不能超过' + arg[1]+'。'];
            return [true];
        },
        email: function (value, arg, info) {
            if (value === '') return [true];
            if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
                return [true];
            }
            return [false, info ? info : '亲，请输入正确的email格式。'];
        },
        english: function (value, arg, info) {
            if (value === '') return [true];
            if (/^[A-Za-z]+$/.test(value)) {
                return [true];
            }
            return [false, info ? info : '亲，这里只能输入英文字母。'];
        },
        mobile: function (value, arg, info) {
            if (value === '') return [true];
            if (/^[0-9\-]*$/.test(value)) {
                return [true];
            }
            return [false, info ? info : '手机号码必须为数字。'];
        },
        range: function (value, range, info) {
            if (value === '') return [true];
            var min = range[0], max = range[1];
            var errInfo = info ? info : '亲，只能在{min}至{max}之间。';

            if (min && value < min || max && value > max) {
                return [false, S.substitute(errInfo, {min: min, max: max})];
            }
            return [true];
        },
        number: function (value, arg, info) {
            if (value === '') return [true];
            if (/^\d+$/.test(value)) return [true];
            return [false, info ? info : '亲，只能输入数字。'];
        },
        date: function (value, arg, info) {
            if (value === '') return [true];
            if (/^(\d{4})(-|\/)(\d{2})\2(\d{2})$/.test(value)) return [true];
            return [false, info ? info : '请填写正确的日期格式：YYYY-MM-DD。'];
        },
        pattern: function (value, arg, info) {
            if (value === '') return [true];
            if (new RegExp(arg[0]).test(value)) return [true];
            return [false, info ? info : '亲，输入格式有误。'];
        }
    };

    S.extend(Verify, Base, /** @lends verify.prototype*/{
        init: function (el) {
            var self = this;
            self.container = S.one(el);
            self.publish('verify');
            self.publish('fail');
            var fields = self.get('fields');
            S.each(fields,function(rule,field){
                  self.add(field,rule);
            });
            self._bindEvent();

        },
        _bindUI:function(field){
            var self = this;
            var autoVerify = self.get('autoVerify');
            var nodeFn = self.get('nodeFn');
            if(autoVerify ){
                var node =  nodeFn.call(self,field);
                if(!node) return;
                node.on('change',function(e){
                    self.verify(field);
                });
                node.on('blur',function(e){
                    if(node.val()==''){
                        self.verify(field);
                    }
                });
            }
        },
        _detachUI:function(field){
            var self = this;
            var nodeFn = self.get('nodeFn');
            var node =  nodeFn.call(self,field);
            if(!node) return;
            node.detach('change');
            node.detach('blur');
        },
        _bindEvent:function(){
            var self = this;

            self.on('verify',function (fieldResult) {
                var field = fieldResult.field;
                var succeed = fieldResult.succeed;
                var info = fieldResult.info;
                self._afterVerify(field, succeed,info);
            });
            self.on('fail',function(fieldResult){
                var field = fieldResult.field;
                var info = fieldResult.info;
                self.error(field,info);
            });
        },
        _afterVerify: function (field,succeed,info) {
            var self = this;
            if (!succeed) {
                self.fire('fail', {
                    field: field,
                    info:info
                });
            } else {
                self.reset(field);
            }
        },
        _getFunctionName: function (fn) {
            return typeof fn.name === 'string' ? fn.name : /function\s+([^\{\(\s]+)/.test(fn.toString()) ? RegExp['$1'] : '[Unknown]';
        },
        /**
         * 校验某个域或全部域
         * @param field
         * @returns {{succeed: boolean, results: Array, firstError: null}}
         */
        verify: function (field) {
            var self = this;
            var fields = self.get('fields');
            var firstError = null;
            var totalResults = {succeed: true, results: [] ,firstError:null};
            var toVerifyFields = {};
            if (typeof field == 'undefined') {
                toVerifyFields = fields;
            } else if (S.isString(field)) {
                var newfield = fields[field];
                if(newfield) {
                    toVerifyFields[field] = newfield;
                }else{
                    return totalResults;
                }
            } else if (S.isArray(field)) {
                S.each(field, function (value, index) {
                    toVerifyFields[value] = fields[value];
                });
            }
            S.each(toVerifyFields, function (rules, fieldName) {
                var fieldResult = self._verify(fieldName, rules);
                if (!fieldResult.succeed) {
                    totalResults.succeed = false;
                }
                if (!fieldResult.succeed && !firstError) {
                    firstError = fieldResult;
                }
                totalResults.results.push(fieldResult);
            });
            if (firstError) {
                totalResults.firstError = firstError;
            }
            return totalResults;
        },
        _verify: function (field, rules) {
            var self = this;
            var valueFn = self.get('valueFn');
            var disabled = self.get('disabled');
            var value = valueFn.call(this,field);
            var fieldResult = {field: field, succeed: true, results: []};
            var ruleResult = [];
            var results = fieldResult.results;
            var rule = null;
            var ruleName = '';
            var info = null;

            if (disabled[field]) {
                return fieldResult;
            }
            for (var i = 0, len = rules.length; i < len; i++) {
                var rule = rules[i];
                if (S.isArray(rule)) {
                    ruleName = rule[0];
                    info = rule[rule.length - 1];
                    if(info == ruleName) {info = '';} ;
                    ruleResult = RULES[ruleName ](value, rule.slice(1, rule.length), info);
                }
                else if (S.isFunction(rule)) {
                    ruleName = self._getFunctionName(rule);
                    ruleResult = rule(value);
                }
                else {
                    ruleName = rule;

                    ruleResult = RULES[rule] &&  RULES[rule](value) || [true];
                }
                function array_hash(arr1, arr2) {
                    var val = {} ;
                    S.each(arr1, function (_item, i) {
                        val[_item] = arr2[i];
                    });
                    return val;
                }

                ruleResult = array_hash(['rule', 'value', 'succeed', 'info'], [ruleName, value].concat(ruleResult));
                results.push(ruleResult);
                fieldResult.info = ruleResult.info;
                fieldResult.succeed = ruleResult.succeed;

                if (!ruleResult.succeed) {
                    break;
                }
            }
            self.fire('verify', fieldResult);
            return fieldResult;
        },
        /**
         * 添加某个校验域 。如果该域已经存在，会直接覆盖
         * @param field
         * @param val
         */
        add: function (field, val) {
            var self = this;
            var fields = self.get('fields');
            if(!fields[field]){
                fields[field] = val;
            }
            if(!fields[field]._bindedUI){
                fields[field]._bindedUI = true;
                self._bindUI(field);
            }
        },
        /**
         * 移除某个校验域
         * @param field
         */
        remove: function (field) {
            var self = this;
            var fields = self.get('fields');
            if(fields[field]){
                self._detachUI(field);
                self.reset(field);
                fields[field]._bindedUI = false;
                delete fields[field];
            }
        },
        /**
         * 修改某个域的校验规则
         * @param field
         * @param rule
         */
        modify: function (field, rule) {
            var self = this;
            self.remove(field);
            self.add(field, rule);
        },
        /**
         * 禁用/开启某个域
         * @param field
         * @param isable
         */
        disable: function (field, isable) {
            var self = this;
            var disabled = self.get('disabled');
            disabled[field] = isable;
        },
        /**
         * 显示错误信息并标注错误状态
         * @param field
         * @param info
         */
        error: function (field, info) {
            var self = this;
            var nodeFn = self.get('nodeFn');
            var dom = nodeFn.call(self,field);
            var state = self.get('state');
            var fieldState = state[field];
            var container = self.container;
            if (!fieldState) {
                fieldState = state[field] = {
                    name: field ,
                    node:dom
                };
            }
            fieldState.info = info;
            var errorWraper;
            if (!fieldState.errorWraper) {
                if(self.get('errorWraper')){
                    errorWraper = container.one(self.get('errorWraper'));
                }else{
                    errorWraper = dom.parent('.verify-wrap');
                    if(!errorWraper){
                        S.DOM.wrap(dom, S.DOM.create('<span class="verify-wrap"/>'));
                        errorWraper = dom.parent('.verify-wrap');
                    }
                }
                fieldState.errorWraper = errorWraper;
            }
            dom.addClass('verifyError').removeClass('verifyNormal');
            self._showTip(fieldState);
            if (dom.prop('type') === 'text') {
                function _hideOtherTips(){
                    if(dom.hasClass('verifyError')) {
                        self._hideOtherTips(fieldState);
                    }
                }
                if (!fieldState.event) {
                    fieldState.event = dom.on('focus', _hideOtherTips);
                }
            }
        },
        /**
         * 重置显示状态
         * @param field
         */
        reset: function (field) {
            var self = this;
            var fields = self.get('fields');
            if (typeof field == 'undefined') {
                S.each(fields, function (rule, fieldnow) {
                    self._reset(fieldnow);
                });
            } else {
                self._reset(field);
            }
            return this;

        },
        _reset: function (field) {
            var self = this;
            var nodeFn = self.get('nodeFn');
            var state = self.get('state');
            var dom = nodeFn.call(self,field);
            if (!dom) {
                return;
            }
            var fieldState = state[field];
            dom.removeClass('verifyError').addClass('verifyNormal');
            if(fieldState){
                self._hideTips(fieldState);
                self._hideIcon(fieldState);
                fieldState = null;
            }
        },
        _hideTips: function (fieldState) {
            var self = this;
            var state = self.get('state');
            if (typeof fieldState == 'undefined') {
                S.each(state, function (field) {
                    self._hideTip(field);
                });
            } else {
                self._hideTip(fieldState);
            }
        },
        _hideTip: function (fieldState) {
            var self = this;
            self._showIcon(fieldState);
            if(fieldState.errorTip){
                fieldState.errorTip.addClass('hidden');
            }
        },
        _showTip: function (fieldState) {
            var self = this;
            var container = self.container;
            if(!fieldState.errorTip){
                var tpl = self.get('errorTipTpl');
                var errorTip = S.DOM.create(tpl);

                fieldState.errorWraper.append(errorTip);
                fieldState.errorTip = container.one(errorTip);
                fieldState.infoWraper =  fieldState.errorTip.one('.J_InfoContainer') || fieldState.errorTip ;
                var node = fieldState.node;
                var width = node.outerWidth();
                fieldState.errorTip.css({
                    left:width
                });
            }
            fieldState.infoWraper.html(fieldState.info);
            fieldState.errorTip.removeClass('hidden');
            self._hideIcon(fieldState);
        },
        _hideIcon: function (fieldState) {
            var self = this;
            var errorClass = self.get('errorClass');
            if (fieldState && fieldState.errorWraper) {
                fieldState.errorWraper.removeClass(errorClass);
            }
        },
        _showIcon: function (fieldState) {
            var self = this;
            var errorClass = self.get('errorClass');
            if (fieldState && fieldState.errorWraper && fieldState.errorWraper.one('.verifyError')) {
                fieldState.errorWraper.addClass(errorClass);
            }

        },
        _hideOtherTips: function (field) {
            var self = this;
            var state = self.get('state');
            S.later(function () {
                S.each(state, function (fieldState) {
                    if (fieldState.name === field.name) {
                        self._showTip(fieldState);
                    } else{
                        self._hideTips(fieldState);
                    }
                });

            }, 50, false, this);
        },
        _destroy:function(){
            var that = this;
            that.set('state',null);
            that.set('fields',null);
        }

    }, {ATTRS: /** @lends verify*/{
            fields: {
                value: {}
            },
            container:{
                value:null
            },
            nodeFn: {
                value: function (field) {
                    return this.container.one('#' + field);
                }
            },
            valueFn: {
                value: function (field) {
                    var nodeFn = this.get('nodeFn');
                    var n = nodeFn.call(this,field);
                    var v = n && n.val();
                    if (!v) {
                        return '';
                    }
                    return v;
                }
            },
            disabled: {
                value: {}
            },
            state: {
                value: {}
            },
            errorClass: {
                value: 'verify-wrap-error'
            },
            autoVerify :{
                value:true
            },
            errorTipTpl:{
                value:'<div class="verify-errortip hidden verify-errortip-left"><em class=" tooltip-arrow tooltip-arrow-left tooltip-arrow-horizontal-left" style="top: 6.8px;"></em><span class="tooltip-close"></span><span class="tooltip-confirm"></span><div class="content-box J_InfoContainer"></div></div>'
            },
            errorWraper:{
                value:null
            }
        }
    });
    return Verify;
}, {requires: ['node', 'base','./index.css']});




