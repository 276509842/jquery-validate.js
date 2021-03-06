/* =========================================================
 * jquery-Lightweight-validation.js 
 * Original Idea: (Copyright 2013 Viken)
 * Updated by 大猫 
 * version 1.1.1-beta  
 * =========================================================
 * http://vikenlove.github.io/jquery-Lweight-validate
 * http://www.oschina.net/p/jquery-lweight-validate 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
;(function($) { 
	
	/**
	 * validate.init绑定表单事件，比如焦点获取、离开时，错误提示的处理
	 * validate只做form验证
	 */
	
	$.fn.validate = function(options) {
		var globalOptions  = $.extend({}, defaults, options);
		
		return validate(this, globalOptions);
	};
	
	$.fn.bindValidation = function(options) {
		var globalOptions  = $.extend({submitButton : '[btn-type=true]'}, defaults, options);
		var $this = $(this);
		
		var isInput =  $(this).is('input') || $(this).is('select') || $(this).is('textarea');
		
		if ( !isInput ) {
			$this.find(globalOptions.submitButton).click(function(){
				validateClick($this, globalOptions);
			});
			
			if(globalOptions.formKey){
				$(document).keyup(function(event){
					switch(event.keyCode) {
					case 13:
						validateClick($this, globalOptions);
						break; 
					}
				});
			};
		}
		
		validateBlur($this, globalOptions);
		
	};
	
	/**
	 * 清除Validate产生的错误信息
	 */
	$.fn.clearValidationError = function() {
		var isInput =  $(this).is('input') || $(this).is('select') || $(this).is('textarea');
		
		if (isInput) {
			clearValidationError( $(this));
		} else {
			$(this).find("input,textarea,select").each(function() {
				clearValidationError( $(this) );
			});
		}
	};
 
	var defaults = {
        validRules : [
            {name: 'required', validate: function(value) {return ($.trim(value) == '');}, defaultMsg: '请输入内容。'},
			{name: 'unRequired', validate: function(value) {return false;}, defaultMsg: '请输入内容。'},
            {name: 'number', validate: function(value) {return (!/^[0-9]\d*$/.test($.trim(value)));}, defaultMsg: '请输入数字。'},
            {name: 'mail', validate: function(value) {return (!/^[a-zA-Z0-9]{1}([\._a-zA-Z0-9-]+)(\.[_a-zA-Z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+){1,3}$/.test($.trim(value)));}, defaultMsg: '请输入邮箱地址。'},
            {name: 'char', validate: function(value) {return (!/^[a-z\_\-A-Z]*$/.test($.trim(value)));}, defaultMsg: '请输入英文字符。'},
            {name: 'chinese', validate: function(value) {return (!/^[\u4e00-\u9fff]+$/.test($.trim(value)));}, defaultMsg: '请输入汉字。'},
			{name: 'mobile', validate: function(value) {return (!/^(13|15|18)[0-9]{9}$/.test($.trim(value)));}, defaultMsg: '请输入正确手机号码。'},
			{name: 'tell', validate: function(value) {return (!/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test($.trim(value)));}, defaultMsg: '请输入正确电话号码格式:区号-号码。'},
			{name: 'passWord', validate: function(value) {return checkPwd($.trim(value));}, defaultMsg: '密码长度必须在6~20之间。'},
			{name: 'confirmPwd', validate: function(value) {return confirmPwd($.trim(value));}, defaultMsg: '两次密码不一致'},
			{name: 'dateYmd', validate: function(value) {return checkDate($.trim(value));}, defaultMsg: '请输入YYYY--MM--DD格式'},
			{name: 'idCard', validate: function(value) {return checkIdCard($.trim(value));}, defaultMsg: '请输入正确的身份证号码'},
			//{name: 'dateCompare', validate: function(value) {return dateCompare();}, defaultMsg: '起始日期不能大于结束日期'}
        ],
		city : [
			{11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",
			23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",
			41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",
			52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",
			65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}		
		]
    };
	
	var validateClick = function(obj,globalOptions){
		if(validate(obj, globalOptions)){
			if(globalOptions.formCall != undefined){
				globalOptions.formCall();
			}	
		}	
	};
	
	var validateBlur = function(obj,globalOptions) {
		var isInput =  $(obj).is('input') || $(obj).is('select') || $(obj).is('textarea');
		
		if ( isInput ) {
			initDomValidateAction($(obj), globalOptions);
		} else {
			$(obj).find("input,textarea,select").each(function() {
				initDomValidateAction($(this), globalOptions);
			});
		}
	};
	
	var initDomValidateAction = function (obj, globalOptions) {
		var el = $(obj);
		var valid = ( el.attr('validate-type')==undefined ) ? null : $.trim(el.attr('validate-type'));
			
		if(valid !== null && valid.length > 0){
		
			el.focus(function(){
				var curTextDiv=el.parent(), curErrorEl = curTextDiv.children('.validate-error');
				
				if(curErrorEl.hasClass('validate-error')){
					curErrorEl.remove();
				} else if (curTextDiv.parent().children('.validate-error').hasClass('validate-error')){
					curTextDiv.parent().children('.validate-error').remove();
				}	
			});
			
			el.blur(function() { 
                validateField(el, globalOptions);
            });
		}	
	};
	

	var clearValidationError = function (obj) {
		var el = $(obj);
		var valid = ( el.attr('validate-type')==undefined ) ? null : $.trim(el.attr('validate-type'));
			console.log(valid + " | " + el.attr('validate-type'));
		if(valid !== null && valid.length > 0){
			var curTextDiv=el.parent(), curErrorEl = curTextDiv.children('.validate-error');
			
			if(curErrorEl.hasClass('validate-error')){
				curErrorEl.remove();
			} else if (curTextDiv.parent().children('.validate-error').hasClass('validate-error')){
				curTextDiv.parent().children('.validate-error').remove();
			}
			
			el.removeClass('error').removeClass('right');
		}
	};
	
	var validate = function(obj, globalOptions){
		
		var validationError = false;
		
		var isInput =  $(obj).is('input') || $(obj).is('select') || $(obj).is('textarea');
		
		if (isInput) {
			if( !validateField(obj, globalOptions) ) {
				validationError = true;
			}
		} else {
			$(obj).find("input:visible,textarea:visible,select:visible").each(function(){
				
				if ($(this).attr('disabled') == undefined || $(this).attr('disabled') == null || $(this).attr('disabled') == false) {
					if( !validateField($(this), globalOptions) ) {
						validationError = true;
					}
					
					if(globalOptions.isAlert){
						if(validationError){
							return false;
						}				
					}
				}
			});
		}
		
		return !validationError;
	};
	
	var validateField = function(field, globalOptions) {
		var el = $(field), error = false, isNonFlag = false, errorMsg = '', pwdStatus = 0, 
			elLength = el.val().length;
		var valid = (el.attr('validate-type') == undefined) ? null : $.trim(el.attr('validate-type'));
		
		var isNon = (el.attr('validate-non-required') == undefined || el.attr('validate-non-required') == 'false') ? false : true;
		
		if(valid == null || valid.length == 0) {
			return true;
		}
		
		var rules = globalOptions.validRules;
		for ( var i = 0, j = rules.length; i < j; i++) {
			var rule = rules[i];
		
			if (valid == rule.name) {
				var ruleVal = rule.validate(el.val());
				if (isNon) {
					if ($.trim(el.val()).length > 0) {
						if (ruleVal == true || ruleVal == -1) {
							error = true;
							errorMsg = (el.attr('validate-required-message') == undefined) ? rule.defaultMsg
									: el.attr('validate-required-message');
							break;
						} else {
							isNonFlag = true;
						}
					}
				} else if (ruleVal == true || ruleVal == -1) {
					error = true;
					errorMsg = (el.attr('required-message') == undefined) ? rule.defaultMsg
							: el.attr('required-message');
					break;
				}
			}
			
			if (error) {
				break;
			}
		}

		if (!error) {

			if (el.val().length > 0) {
				// 验证字符串长度范围，大小范围
				var minMax = (el.attr('validate-min-max') == undefined) ? null : $.trim(el
						.attr('validate-min-max'));
				
				var _callBack = (el.attr('data-callback') == undefined) ? null
						: $.trim(el.attr('data-callback'));

				if (minMax !== null && minMax.length > 0) {
					var isValue =  minMax.charAt(0) == 'V';
					minMax = (minMax.charAt(0) == 'V' || minMax.charAt(0) == 'L') ? minMax.substring(1) : minMax;
					minMax = minMax.indexOf() == -1 ? minMax + '-' : minMax;
					var min = minMax.split('-')[0], 
						max = minMax.split('-')[1];
					
					if (isValue) {
						if (max != undefined && max != '' && el.val() < Number(min)) {
							error = true;
							errorMsg = (el.attr('validate-min-message') == undefined) ? "数值不能小于" + min : el.attr('validate-min-message');
						} else if (max != undefined && max != '' && el.val() > Number(max)) {
							error = true;
							errorMsg = (el.attr('validate-max-message') == undefined) ? "数值不能大于" + max : el.attr('validate-max-message');
						} else {
							isNonFlag = true;
						}
					} else {
						if (elLength < Number(min)) {
							error = true;
							errorMsg = (el.attr('validate-min-message') == undefined) ? "文本长度不能小于" + min + "个字符" : el.attr('validate-min-message');
						} else if (max != undefined) {
							if (elLength > Number(max)) {
								error = true;
								errorMsg = (el.attr('validate-max-message') == undefined) ? "文本长度不能大于" + max + "个字符" : el.attr('validate-max-message');
							}
						} else {
							isNonFlag = true;
						}
					}
				}
				
				// 校验时间大小比较
				var dataGt = (el.attr('validate-date-gt') == undefined) ? null : $.trim(el
						.attr('validate-date-gt'));
				var dataGtEq = (el.attr('validate-date-gteq') == undefined) ? null : $.trim(el
						.attr('validate-date-gteq'));
				
				// 比较时间
				if (dataGtEq !== null && dataGtEq.length > 0) {
					error = dateCompare($(dataGtEq).val(), el.val(), 'gteq');
					errorMsg =  (el.attr('validate-date-compare-message') == undefined) ? "起始日期不能大于结束日期" : el.attr('validate-date-compare-message');
				} else if  (dataGt !== null && dataGt.length > 0) {
					error = dateCompare($(dataGt).val(), el.val(), 'gt');
				}
				
				
				if (!error) {
					if (_callBack !== null && _callBack.length > 0) {
						var _ajaxCallBack = el.attr('data-callback');
						error = eval(_ajaxCallBack);
						if (error) {
							errorMsg = (el.attr('validate-call-message') == undefined) ? "校验无法通过，请重新输入" : el.attr('validate-call-message');
						}
					}
				}
			}
		}

		var curTextDiv = el.parent(), curErrorEl = curTextDiv
				.children('.validate-error'), uniformDiv = curTextDiv.attr("id");

		if (error) {
			if (globalOptions.isAlert) {
				if (globalOptions.alterCall != undefined) {
					globalOptions.alterCall(errorMsg);
				} else {
					alert(errorMsg);
				}
			} else {
				var overHelp = curErrorEl.text();
				if (uniformDiv != undefined
						&& uniformDiv.indexOf('uniform-') > -1) {
					if (curTextDiv.parent().children('.validate-error').hasClass(
							'validate-error')) {
						curTextDiv.parent().data('validate-error', overHelp);
					} else {
						curTextDiv.parent().append(
								'<span class="validate-error error">' + errorMsg
										+ '</span>');
					}
				} else {
					if (curErrorEl.hasClass('validate-error')) {
						curTextDiv.data('validate-error', overHelp);
					} else {
						curTextDiv.append('<span class="validate-error error">'
								+ errorMsg + '</span>');
					}
				}
				el.removeClass('right').addClass('error');
			}
		} else if (ruleVal > 0) {

			var pwdStrong = passWordStatus(ruleVal);
			var classpic = classStatus(ruleVal);
			if (curErrorEl.hasClass('validate-error')) {
				curTextDiv.data('validate-error', pwdStrong);
			} else {
				curTextDiv.append('<span class="validate-error ' + classpic + '">'
						+ pwdStrong + '</span>');
			}
			el.removeClass('error').addClass('right');

		} else {
			if (!globalOptions.isAlert) {
				curErrorEl.remove();
				isNonFlag == true ? el.removeClass('error').addClass('right')
						: el.removeClass('error').removeClass('right');
			}
		}

		return !error;
	};
			
	var checkIdCard = function(value) {
		var iSum = 0, birthday;
		if (!/^\d{17}(\d|x)$/i.test(value)) {
			return true;
		}
		value = value.replace(/x$/i, "a");
		if (defaults.city[0][parseInt(value.substr(0, 2))] == null) {
			return true;
		}
		birthday = value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-"
				+ Number(value.substr(12, 2));
		var d = new Date(birthday.replace(/-/g, "/"));
		if (birthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d
				.getDate())) {
			return true;
		}
		for ( var i = 17; i >= 0; i--) {
			iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
		}
		if (iSum % 11 != 1) {
			return true;
		}
		return false;
	};

	var dateCompare = function(startDate, endDate, option) {
		var flag = false;

		if (startDate != null && endDate != null && startDate.length > 0 && endDate.length > 0) {
			var startDate = Number(startDate.replace(/-/g, ''));
			var endDate = Number(endDate.replace(/-/g, ''));
			if (option == 'gteq') {
				flag = !(endDate >= startDate);
			} else {
				flag = !(endDate > startDate);
			}
		}
		return flag;
	};

	var checkDate = function(value) {
		var r = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
		if (r == null)
			return true;
		var d = new Date(r[1], r[3] - 1, r[4]);
		return !(d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d
				.getDate() == r[4]);
	};

	var confirmPwd = function(value) {
		var inputObj = $("input[type='password']");
		var pwd1 = "", pwd2 = "";
		if (inputObj.size() == 3) {
			pwd1 = $.trim(inputObj.eq(1).val());
			pwd2 = $.trim(inputObj.eq(2).val());
		} else {
			pwd1 = $.trim(inputObj.eq(0).val());
			pwd2 = $.trim(inputObj.eq(1).val());
		}
		return (pwd2.length > 0 ? (pwd1 == pwd2 ? false : true) : true);
	};

	var checkPwd = function(value) {
		if (value.length >= 6 && value.length <= 20) {
			if (/[a-zA-Z]+/.test(value) && /[0-9]+/.test(value)
					&& /\W+\D+/.test(value)) {
				return 1;
			} else if (/[a-zA-Z]+/.test(value) || /[0-9]+/.test(value)
					|| /\W+\D+/.test(value)) {
				if (/[a-zA-Z]+/.test(value) && /[0-9]+/.test(value)) {
					return 2;
				} else if (/\[a-zA-Z]+/.test(value) && /\W+\D+/.test(value)) {
					return 2;
				} else if (/[0-9]+/.test(value) && /\W+\D+/.test(value)) {
					return 2;
				} else {
					return 3;
				}
			}
		} else {
			return true;
		}
	};

	var classStatus = function(i) {
		var status = '';
		switch (i) {
		case 1:
			status = "passWord3";
			break;
		case 2:
			status = "passWord2";
			break;
		case 3:
			status = "passWord1";
			break;
		}
		return status;
	};

	var passWordStatus = function(i) {
		var status = '';
		switch (i) {
		case 1:
			status = "强";
			break;
		case 2:
			status = "中";
			break;
		case 3:
			status = "弱";
			break;
		}
		return status;
	};
     
})(jQuery);   
