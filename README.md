改编自以下开源插件：
jquery-Lweight-validate
作者：大猫
http://vikenlove.github.io/jquery-Lweight-validate

轻量级校验框架。之所以这么称呼它。
原因很简单，与其他校验框架相比，次框架没有太多的JS代码在你的HTML中，
仅仅一行，其他所有的校验属性，均通 过框架中自定义的HTML属性标签进行校验配置。
知识用来分享，所以将其开源。希望对能为大家带来帮助，也希望更多的人能够将自己的作品开源出来。

=========================================================================================
改编：
<ul>
<li>
·将属性命名空间，统一修改为validate-
</li>
<li>
原有处理修改为$.fn.bindValidation，主要实现form表单的fouce、blur事件，验证的处理,
如果想对提交按钮加入validtae支持，也可以使用options.submitButton配置，默认'[btn-type=true]'；
</li>
<li>
  原有formCall回调函数，可实现验证后的处理
采用bindValidation设置提交按钮触发validate时间时，需使用options中的回调函数formCall。
</li>
<li>
考虑验证的灵活性，加入$.fn.validate，只做验证，返回boolean
</li>
<li>
加入$.fn.clearValidationError，清除Validate产生的错误信息，便于form初始化
</li>
<li>
修改Date开始时间、结束时间大小比较方式。
只需要在结束日期上，加入validate-date-gteq/ validate-date-gt、validate-date-compare-message 属性。<br />
&lt;input type="text" id="endDate" placeholder="请输入结束时间" 
	validate-type="dateYmd" validate-date-gteq="#startDate" validate-date-compare-message="结束时间不能晚于起始时间"&gt;
</li>
</ul>

支持div、form、input、select、textarea的validate，如果是表单资源，只设置focus、blur事件
如果是容器元素，则会选择设置提交按钮。
=========================================================================================


如何使用:
<code>
$('#form').validate(options)
</code>
<pre>
例:
   	$('#form').bindValidation( {
		formCall:function(){formCallFunction();},
		isAlert:false,
		formKey:false,
		alterCall:function(msg){callbackFunction(msg);}
	});	

</pre>

注:options 同校验属性-other config,所有要校验的属性都需要在form标签内，
表单提交按钮：默认btn-type="true"， 或者使用options.submitButton

校验属性-validate-type规则：
<pre>
   required:非空校验
   unRequired:非必填项属性
   number：校验数字
   mail：校验Email
   char：英文字符校验
   chinese：中文字符校验
   mobile：手机号码校验
   tell：电话号码-格式支持：+（国家代码）-（区号）-号码-（分机号）
   passWord：密码强度校验-默认长度大小6~20
   confirmPwd：密码确认
   dateYmd：日期格式-例：yyyy-MM-dd
   idCard：身份证号码
   dateCompare：前后日起大小-例：起始日期-结束日期 之间比较
</pre>
校验属性-other config：

<pre>
validate-non-required: validate-type规则下 非填写情况下不校验配置
validate-required-message：自定义提示信息
validate-min-max："1-10","L1-10","V1-10", L代表长度验证（默认），V代表值验证
	文本长度校验，或者值类型最大最小值校验-
	例：validate-min-max="L1-10" 最小长度为1，最大长度10
	validate-min-max="V1-10" 最小值为1，最大值10
validate-min-message：最小长度提示信息
validate-max-message：最大长度提示信息
data-callback：文本异步校验回调函数
validate-call-message：异步回调自定义信息
options：
        formCall:表单提交函数(*必配选项*)
        isAlert：是否开启alert弹出方式，true/false 不配置，则等于为false(非必配选项)
        formKey: 是否开启回车键监听,true/false 不配置，则等于为false(非必配选项)
        alterCall:alert 弹出方式自定义回调函数，此方法用于自定义的
                  alert效果 function(msg){callbackFunction(msg);}	（非必配选项）
</pre>

==============
HMTL DEMO:
<pre>
&lt;form id="form"&gt;
	//当文本输入值后，校验其类型，不填则不进行校验
	&lt;div class="control-group"&gt;
		&lt;label class="control-label" for="inputtext"&gt;数字&lt;/label&gt;
		  &lt;div class="controls"&gt;
			&lt;input type="text" id="inputtext" validate-type="number" validate-non-required='true'&gt;
							
	        &lt;/div&gt;
	&lt;/div&gt;
        //文本异步调用校验配置
	&lt;div class="control-group"&gt;
	   &lt;label class="control-label" for="inputName"&gt;用户名&lt;/label&gt;
		&lt;div class="controls"&gt;
			&lt;input type="text" id="inputName" validate-type="required" 
			data-callback="mycallback()" validate-call-message="用户名名已存在" 
			validate-required-message="用户名不能为空"&gt;
		&lt;/div>
	&lt;/div>
	//非特定规则校验下，当输入后校验，不输入不进行校验配置
	&lt;div class="control-group"&gt;
		&lt;label class="control-label" for="inputtext"&gt;文本&lt;/label&gt;
		 &lt;div class="controls"&gt;
			&lt;input type="text" id="inputtext" validate-type="unRequired"
					validate-min-max="3-5" validate-min-message="字符长度不得小于3个字符" 
					validate-max-message="字符长度不得超过5个字符"  
					validate-required-message="文本不能为空！"  &gt;
						
		&lt;/div&gt;
	&lt;/div&gt;			
&lt;/form&gt;
</pre>


