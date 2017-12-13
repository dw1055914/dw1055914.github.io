var HEADER_FIXED_MENU = function(){
	var $body = $('body');
	var $html = $('html');
	var fixed_class = 'new_fixed_header_active';
	var fixed_diable_class = 'new_fixed_header_disable';
	var fixed_menu_cutoff;
	var banner_height;
	var $doz_header_wrap;
	var $new_org_header;

	var init = function(){
		$body = $('body');
		$html = $('html');
		$doz_header_wrap = $('#doz_header_wrap');
		$new_org_header = $('#doz_header_wrap').find('._new_org_header');
		fixed_menu_cutoff = $new_org_header.height();

		setTimeout(function(){
			if($body.hasClass(fixed_diable_class))
				return;
			if($html.scrollTop() >= fixed_menu_cutoff && !$("nav.top[data-no-scroll]").length){
				if(!$body.hasClass(fixed_class)){
					$body.addClass(fixed_class)
				}
			}
		},40);



		$(window).scroll(function(e){
			if($body.hasClass(fixed_diable_class))
				return;
			//if($("nav.top[data-no-scroll]").length)return;
			banner_height = 0;
			fixed_menu_cutoff = $new_org_header.height();
			if($body.find('.banner-container').length > 0){
				$.each($body.find('.banner-container'),function(){
					banner_height += $(this).height();
				});
				if(fixed_menu_cutoff+banner_height > fixed_menu_cutoff && banner_height != 0){
					fixed_menu_cutoff += banner_height
				}
			}
			if(this.pageYOffset >= fixed_menu_cutoff && !$body.hasClass(fixed_class)){
				$body.addClass(fixed_class)
			}else if(this.pageYOffset < fixed_menu_cutoff && $body.hasClass(fixed_class)){
				$body.removeClass(fixed_class)
			}
		});
	};


	return{
		'init' : function(){
			init();
		}
	}
}();