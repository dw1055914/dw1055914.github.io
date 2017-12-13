var SITE = function(){
	var openPolicy = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/policy.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_policy', custom_popup: $html});
			}
		});
	};
	var openPrivacy = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/privacy.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_privacy', custom_popup: $html});
			}
		});
	};
	var openDomestic = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/tour_policy_domestic.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_domestic', custom_popup: $html});
			}
		});
	};
	var openOverseas = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/tour_policy_overseas.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_overseas', custom_popup: $html});
			}
		});
	};
	var openDomesticOverseas = function(){
		$.cocoaDialog.close();
		$.ajax({
			type: 'POST',
			data: {},
			url: ('/dialog/tour_policy.cm'),
			dataType: 'html',
			async: true,
			cache: false,
			success: function(html){
				var $html = $(html);
				$.cocoaDialog.open({type: 'site_domesticoverseas', custom_popup: $html});
			}
		});
	};

	var changeAlarmCheckbox = function(obj, is_mobile){
		if(is_mobile == 'Y'){
			$('#alarm_popup').find("input:checkbox").prop("checked", false);
			var $alarm_popup = $('#alarm_popup_mobile');
		}else{
			$('#alarm_popup_mobile').find("input:checkbox").prop("checked", false);
			var $alarm_popup = $('#alarm_popup');
		}

		if($(obj).hasClass("_all")){
			$alarm_popup.find("input:checkbox").prop("checked", obj.checked);
			toggleAlarmActive(is_mobile);
		}else{
			var count_total = $alarm_popup.find("._alarm_list li").length;
			var count_check = $alarm_popup.find("input:checkbox:checked").length;
			if($alarm_popup.find("._all").prop("checked")){
				count_check = count_check - 1;
			}
			if(count_total == count_check && (count_check != 0 && count_total != 0)){
				$alarm_popup.find("._all").prop("checked", true);
			}else{
				$alarm_popup.find("._all").prop("checked", false);
			}
			toggleAlarmActive(is_mobile);
		}
	};

	var toggleAlarmPopup = function(is_mobile){
		if(is_mobile == 'Y'){
			var $alarm_popup = $('#alarm_popup_mobile');
			var $dLabel = $('#dLabel_mobile');
			var $id = 'alarm_popup_mobile';
			var $clos_id = 'alarm_popup';
			var $layer = '_alarm_layer_mobile';
		}else{
			var $alarm_popup = $('#alarm_popup');
			var $dLabel = $('#dLabel');
			var $id = 'alarm_popup';
			var $clos_id = 'alarm_popup_mobile';
			var $layer = '_alarm_layer';
		}
		$alarm_popup.toggleClass('open');
		if($alarm_popup.hasClass('open')){
			$(window).off('mousedown.'+$clos_id);
			$(window).on('mousedown.'+$id,function(event){
				if($(event.target).closest('.'+$layer).length == 0){
					$alarm_popup.removeClass('open');
					$(window).off('mousedown.'+$id);
				}
			});
		}
	};

	var toggleAlarmActive = function(is_mobile){
		if(is_mobile == 'Y'){
			var $alarm_popup = $('#alarm_popup_mobile');
			var $dLabel = $('#dLabel_mobile');
		}else{
			var $alarm_popup = $('#alarm_popup');
			var $dLabel = $('#dLabel');
		}
		var count_check = $alarm_popup.find("li input:checkbox:checked").length; 
		if(count_check == 0){ 
			$dLabel.removeClass('active'); 
		}else{ 
			$dLabel.addClass('active'); 
		}
	};
	var androidUpdateAlert = function (package) {
		$.ajax({
			type : 'POST',
			data: {'package':package},
			url : ('dialog/android_update_form.cm'),
			dataType : 'html',
			async : false,
			cache : false,
			success : function(html){
				$.cocoaDialog.open({type : 'site_alert', custom_popup : $(html)});
			}
		});
	};

	var firstScrollFixed = function(id){
		var stop_fixed = {};
		clearInterval(stop_fixed);
		var setCss = function(id){
			var top = $(window).scrollTop();
			clearInterval(stop_fixed);
			if(top >0){
				$('#'+id).toggleClass('first_scroll_fixed',false);
				$('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed2').toggleClass('scroll-to-fixed-fixed',true).toggleClass('scroll-to-fixed-fixed2',false);
				$('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed2').toggleClass('scroll-to-fixed-fixed',true).toggleClass('scroll-to-fixed-fixed2',false);
			}else{
				$('#'+id).toggleClass('first_scroll_fixed',true);
				stop_fixed = setInterval(function(){
					var $fixed = $('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed');
					var $fixed2 = $('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed');
					if($fixed.length > 0 || $fixed2.length >0){
						clearInterval(stop_fixed);
						$('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed', false).toggleClass('scroll-to-fixed-fixed2', true);
						$('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed', false).toggleClass('scroll-to-fixed-fixed2', true);
					}
				},100);
				$('#' + id).find('div[data-type="section-wrap"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed',false).toggleClass('scroll-to-fixed-fixed2',true);
				$('#' + id).find('div[data-type="carousel_menu"].scroll-to-fixed-fixed').toggleClass('scroll-to-fixed-fixed',false).toggleClass('scroll-to-fixed-fixed2',true);
			}
		};
		$(window).bind('scroll.firstScrollFixed',function(){
			setCss(id);
		});

		$(window).bind('resize.firstScrollFixed',function(){
			setCss(id);
		});

		setCss(id);
	};

	return {
		'openPolicy' : function(){
			openPolicy();
		},
		'openPrivacy' : function(){
			openPrivacy();
		},
		'openDomestic' : function(){
			openDomestic();
		},
		'openOverseas' : function(){
			openOverseas();
		},
		'openDomesticOverseas' : function(){
			openDomesticOverseas();
		},
		'changeAlarmCheckbox' : function(obj, is_mobile){
			changeAlarmCheckbox(obj,is_mobile);
		},
		'toggleAlarmPopup' : function(is_mobile){
			toggleAlarmPopup(is_mobile);
		},
		'androidUpdateAlert' : function (package) {
			androidUpdateAlert(package);
		},
		'firstScrollFixed' : function(id){
			firstScrollFixed(id);
		}
	}

}();


