KISSY.add(function (S, Verify) {
    var DOM = S.DOM,
        Event = S.Event
    //适配代码在这
    function init(frameGroup) {
        function SafeVerify(el,config) {
               this.inner = new Verify(el,cajaAFTB.untame(config));
        }
        S.each(['on','fire', 'verify',  'add', 'remove', 'disable', 'reset','error'], function(fuc) {
            SafeVerify.prototype[fuc] = function(){
                this.inner[fuc].call(this,arguments);
            }
        });
        //---- 封装的构造函数编写完成后，就需要让"第三方环境认识" 需要调用markCtor标记一下，让容器认识
        frameGroup.markCtor(SafeVerify);//frameGroup.markCor 标记构造函数

        //构造函数实例的方法，需要grantMethod ，加入白名单，没有授权的方法，不可以使用，容器不认识

        S.each(['on','fire', 'verify',  'add', 'remove', 'disable', 'reset','error'], function(fuc) {

            frameGroup.grantMethod(safeLayerAnim, fuc);
        });

        /**
         * @param context 上下文
         * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
         * @param context.frame 单个模块的沙箱
         * @return {Object} 实际的组件对象
         */
        return function (context) {

            //最终需要返回给 ISV使用的API，这是真正第三方调用的API，kissy:true意思是这是KISSY这个对象的一个属性
            return {
                Verify: SafeVerify,//暴露构造函数给caja环境
                kissy:true
            }
        }
    }
    return init;
}, {
    requires: ['gallery/verify/1.3/index']
});