var SITE_BOOKING = function(){
	var $booking_wrap, $booking_content_wrap, $booking_view_calendar, $day_booking_wrap, $prod_image_list, $prod_image_list_rolling, $cuurent_day_obj, $prod_detail_wish_count, $prod_detail_content;
	var data;
	var target_month, select_day, start_day, end_day;
	var start_time, end_time;
	var unselected_end_day = false;
	var restore_end_day = false;
	var idx = 0;
	var current_content_tab = '';

	var person_num;
	var init_list = function(d){
		data = d;
		$booking_wrap = $('#'+data.code+' ._booking_wrap');
		$booking_view_calendar = $('#'+data.code+' ._booking_view_calendar');
		runMobileCalendar($booking_wrap);
	};

	var init_view = function(no,d,st,s,e){
		idx = no;
		data = d;
		start_day = s;
		start_time = parseInt(st);
		end_day = e;
		end_time = 2;
		$booking_content_wrap = $('#'+data.code+' ._booking_content_wrap');
		$booking_view_calendar = $('#'+data.code+' ._booking_view_calendar');
		$day_booking_wrap = $('#'+data.code+' ._day_booking_wrap');
		$prod_detail_wish_count = $('#'+data.code+' #prod_detail_wish_count');
		$prod_detail_content = $('#'+data.code+' #prod_detail_content');
		$prod_image_list = $("#prod_image_list");
		$prod_image_list_rolling = $prod_image_list.find("._detail_image");
		runViewCalendar($booking_view_calendar);
		startProdImageRolling();
		current_content_tab = 'detail';
		$booking_content_wrap.find('a._' + current_content_tab).addClass('on');
	};

	var runViewCalendar = function($obj){
		$booking_view_calendar.find('._day_item').off('click').on('click',function(){
			clickViewCalendar($(this));
		});
		$booking_view_calendar.find('._check_out_item').off('click').on('click',function(){
			clickCheckOutViewCalendar($(this));
		});

	};

	var clickCheckOutViewCalendar = function($day_obj){
		end_time = $day_obj.data('stamp');
		if(start_time <end_time){
			if(start_day != '' && end_day ==''){ //종료일을 선택
				unselected_end_day = false;
				end_day = $day_obj.data('date');
				end_time = $day_obj.data('stamp');
				restore_end_day = false;
				getViewBookingDetail($day_obj);
			}
		}
	};

	var clickViewCalendar = function($day_obj){
		end_time = $day_obj.data('stamp');
		if(start_time <end_time){
			if(start_day != '' && end_day ==''){ //종료일을 선택
				unselected_end_day = false;
				end_day = $day_obj.data('date');
				end_time = $day_obj.data('stamp');
				restore_end_day = false;
			}else if(start_day != '' && end_day != ''){ //다시 조정
				unselected_end_day = true;
				start_day = $day_obj.data('date');
				start_time = $day_obj.data('stamp');
				restore_end_day = true;
				end_day = '';
				$booking_view_calendar.find('._day_item').removeClass('on').removeClass('keep').removeClass('off');
				$booking_view_calendar.find('._check_out_item').removeClass('on').removeClass('keep').removeClass('off');
				$day_obj.addClass('on');
			}
		}else{
			unselected_end_day = true;
			start_day = $day_obj.data('date');
			start_time = $day_obj.data('stamp');
			restore_end_day = true;
			end_day = '';
			end_time = '';
			$booking_view_calendar.find('._day_item').removeClass('on').removeClass('keep').removeClass('off');
			$booking_view_calendar.find('._check_out_item').removeClass('on').removeClass('keep').removeClass('off');
			$day_obj.addClass('on');
		}
		getViewBookingDetail($day_obj);
	};

	var getViewBookingDetail = function($day_obj){
		console.log('getViewBookingDetail', $day_obj);
		$cuurent_day_obj = $day_obj;

		var $booking_f = $('#booking_f');
		var f_data = $booking_f.serializeObject();
		var data = {'idx':idx,'start_day' : start_day, 'end_day':end_day, 'person':person_num};
		data = $.extend(f_data,data);
		$.ajax({
			type : 'POST',
			data : data,
			url : ('/booking/html_day_booking.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					var $html = $(res.html);
					if(!restore_end_day){
						getViewMonth(target_month);
					}
					$day_booking_wrap.html($html);
				}else{
					restore_end_day = true;
					end_day = 'error';
					end_time = '';
					clickViewCalendar($day_obj);

				}
			}
		});
	};

	var getListMonth = function(ym){
		$.ajax({
			type : 'POST',
			data : {'target_month' : ym, 'select_day':select_day},
			url : ('/booking/html_list.cm'),
			dataType : 'html',
			success : function(html){
				var $html = $(html);
				$booking_wrap.html($html);
				runMobileCalendar($html);
			}
		});
	};
	var getViewMonth = function(ym){
		$.ajax({
			type : 'POST',
			data : {'idx':idx,'target_month' : ym, 'start_day':start_day,'end_day':end_day},
			url : ('/booking/html_detail_calendar.cm'),
			dataType : 'html',
			success : function(html){
				var $html = $(html);
				target_month = ym;
				$booking_view_calendar.html($html);
				runViewCalendar($booking_view_calendar);
			}
		});
	};

	var runMobileCalendar = function($obj){
		$obj.find("._booking_day_slide").owlCarousel({
			mouseDraggable:false,
			singleItem:true,
			items : 7
		});
		$obj.find('._booking_date').on('click',function(){
			$obj.find('._booking_date').removeClass('on');
			$(this).addClass('on');
			select_day = $(this).data('day');
			$.ajax({
				type : 'POST',
				data : {'select_day':select_day},
				url : ('/booking/html_day_detail.cm'),
				cache : false,
				dataType : 'html',
				success : function(html){
					var $html = $(html);
					$booking_wrap.find('._booking_day_detail').html($html);
				}
			});
		});
	};

	var changePerson = function(num){
		person_num = num;
		getViewBookingDetail($cuurent_day_obj);
	};

	var changeOption = function(){
		getViewBookingDetail($cuurent_day_obj);

	};


	/**
	 * 상품 이미지 롤링 시작
	 */
	var startProdImageRolling = function(){
		$prod_image_list_rolling.owlCarousel({
			navigation : true,
			slideSpeed : 300,
			paginationSpeed : 400,
			singleItem : true,
			animateOut : 'fadeOut',
			items : 1,
			onChanged : function(){
				var owl = $prod_image_list_rolling.data('owlCarousel');
				var current = 0;
				if(typeof owl !== "undefined") current = owl._current;
				var li_list = $prod_image_list.find('li.owl-dot');
				li_list.find('a').removeClass('active');
				li_list.eq(current).find('a').addClass('active');
			}
		});
	};

	/**
	 * 상품 이미지 롤링 특정 위치 이동
	 * @param no
	 */
	function changeProdImageRolling(no){
		var owl = $prod_image_list_rolling.data('owlCarousel');
		if(typeof owl !== "undefined"){
			owl.to(no);
		}
	}
	
	var toggleMobileBooking = function(){
		if($booking_content_wrap.hasClass('on')){
			$booking_content_wrap.removeClass('on');
		}else{
			$booking_content_wrap.addClass('on');
		}
	};
	
	/**
	 * 바로 주문하기 추가
	 */
	var addBooking = function(callback){
		var $booking_f = $('#booking_f');
		var data = $booking_f.serializeObject();
		data = $.extend(data, {'unselected_end_day' : unselected_end_day});
		if(unselected_end_day){
			data = $.extend(data, {'start_timestamp' : start_time});
		}
		$.ajax({
			'type' : 'POST',
			'data' : data,
			'url' : ('/booking/add_order.cm'),
			'dataType' : 'json',
			'cache' : false,
			success : function(result){
				if(result.msg == 'SUCCESS'){
					callback(result);
				}else{
					alert(result.msg);
				}
			}
		});
	};

	/**
	 * 특정상품 위시리스트 추가 처리
	 * @param prod_code
	 */
	var addProdWish = function(prod_code){
		$.ajax({
			type : 'POST',
			data : {'prod_code' : prod_code},
			url : ('/booking/add_prod_wish.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					if(res.res == 'add'){
						//FB_PIXEL.AddToWishlist();
						MOBON.AddToWish();
						$prod_detail_wish_count.parent().addClass('active');
					}else if(res.res == 'delete'){
						$prod_detail_wish_count.parent().removeClass('active');
					}
					$prod_detail_wish_count.text(res.wish_cnt);
				}else
					alert(res.msg);
			}
		});
	};

	/**
	 * 상세정보 탭 변경 처리
	 * @param type
	 */
	var changeContentTab = function(type){
		if(current_content_tab != ''){
			$booking_content_wrap.find('a._' + current_content_tab).removeClass('on');
		}
		current_content_tab = type;
		$booking_content_wrap.find('a._' + type).addClass('on');
		if(type == 'detail'){
			$.ajax({
				type : 'POST',
				data : {'prod_idx' : idx},
				url : ('/booking/prod_detail.cm'),
				dataType : 'json',
				cache : false,
				success : function(result){
					if(result.msg == 'SUCCESS'){
						if(result.content == ''){
							$prod_detail_content.html('<div style="text-align: center; padding: 50px 0;"><div class="body_font_color_40" style="font-size: 18px; margin:30px"></div></div>');
						}else{
							$prod_detail_content.html(result.content);
						}
					}else{
						alert(result.msg);
					}
				}
			});
		}else if(type == 'review'){
			$.ajax({
				type : 'POST',
				data : {'prod_idx' : idx},
				url : ('/booking/prod_review.cm'),
				dataType : 'html',
				cache : false,
				success : function(result){
					$prod_detail_content.html(result);
				}
			});
		}else if(type == 'qna'){
			$.ajax({
				type : 'POST',
				data : {'prod_idx' : idx},
				url : ('/booking/prod_qna.cm'),
				dataType : 'html',
				cache : false,
				success : function(result){
					$prod_detail_content.html(result);
				}
			});
		}
	};

	return{
		'init_list' : function(data){
			init_list(data);
		},
		'init_view' : function(idx,data,st,s,e){
			init_view(idx,data,st,s,e);
		},
		'getListMonth' : function(ym){
			getListMonth(ym);
		},
		'getViewMonth' : function(ym){
			getViewMonth(ym);
		},
		'changePerson' : function(num){
			changePerson(num);
		},
		'changeOption' : function(){
			changeOption();
		},
		'changeProdImageRolling' : function(no){
			changeProdImageRolling(no);
		},
		'toggleMobileBooking' : function(){
			toggleMobileBooking();
		},
		'addBooking' : function(){
			addBooking(function(result){
				FB_PIXEL.InitiateCheckout();
				window.location.href = "/shop_payment/?order_code=" + encodeURIComponent(result.order_code);
			});
		},
		addProdWish : function(prod_code){
			addProdWish(prod_code);
		},
		'changeContentTab' : function(type){
			changeContentTab(type);
		},
	}
}();

var SITE_BOOKING_PAYMENT = function(){
	var $form;
	var $use_point;
	var $use_point_text;
	var $total_price_text;
	var $orderer_call;
	var $orderer_email;
	var $deliv_call;
	var current_order_code;
	var $order_form_wrap;
	var $item_wrap;
	var $pay_type;
	var $pg_status;
	
	var initPayment = function(order_code){
		var payment_type = $("._payment_type");
		$form = $('#order_payment');
		$order_form_wrap = $('#order_form_wrap');
		$use_point = $form.find('input._use_point');
		$use_point_text = $form.find('._use_point_text');
		$total_price_text = $form.find('._total_price_text');
		$orderer_call = $form.find('._orderer_call');
		$orderer_call.check_callnum();
		$orderer_email = $form.find('._orderer_email');
		$deliv_call = $form.find('._deliv_call');
		$pay_type = $('#pay_type');
		$pg_status = $('#pg_status');
		$deliv_call.check_callnum();
		$use_point.number(true);
		var cash_idx = $('#cash_idx');
		current_order_code = order_code;
		var cash_idx_size = cash_idx.find('option').size();
		$pay_type.change(function(){
			$('#current_pay_type').text($(this).find('option:selected').text());
			if(cash_idx_size > 1 && this.value == "cash"){
				cash_idx.show();
				payment_type.addClass("on");
				return;
			}
			payment_type.removeClass("on");
			cash_idx.hide();
		});
		if(cash_idx_size > 1 && this.value == "cash"){
			cash_idx.show();
			payment_type.addClass("on");
			return;
		}
		$('#current_pay_type').text($pay_type.find('option:selected').text());
	};

	/**
	 *
	 * @param type - 배송옵션(택배,퀵배달,방문수령) - lsy
	 */
	var itemMakeList = function(){
		$.ajax({
			type : 'POST',
			data : {'order_code' : current_order_code},
			url : ('/booking/html_payment_item_list.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					$item_wrap = $order_form_wrap.find('._item_wrap').html($(res.html));
				}else
					alert(res.msg);
			}
		});
	};
	var startPayment = function(){
		if($form.find('._privacy_no_member_agree').length > 0 && $form.find('._privacy_no_member_agree').prop('checked') != true){		// 비회원 개인정보 수집 및 이용 동의 요소가 존재 하고 수집 동의에 체크가 안 되어 있을 경우
			alert(LOCALIZE.설명_개인정보처리방침에동의하여주시기바랍니다());
			return false;
		}

		if($pg_status.val() == 'test' && $pay_type.val()  != "cash")
			alert(LOCALIZE.설명_테스트결제메시지());
		$form.submit();
	};
	
	return {
		initPayment : function(order_code){
			initPayment(order_code);
		},
		startPayment : function(){
			startPayment();
		},
		checkPointUsable : function(val){
			checkPointUsable(val);
		},
		'setDelivInfoWithOrderer' : function(){
			setDelivInfoWithOrderer();
		},
		'itemMakeList' : function(){
			itemMakeList();
		},
		'delivOptionChange' : function(type,deliv_option_ck,deliv_default_option_ck){
			delivOptionChange(type,deliv_option_ck,deliv_default_option_ck);
		},
		'digitalFileDownload' : function(target_code,order_idx){
			digitalFileDownload(target_code,order_idx);
		}
	}
}();

var SITE_BOOKING_REVIEW = function(){
	var $review_wrap;
	var $form;
	var $mobile_form;
	var $rating;
	var $star;
	var $m_rating;
	var $m_star;
	var $comment_body;
	var $review_image_box;
	var $comment_area;
	var $platform;

	var init = function(t){
		switch(t){
			case 'pc':
				$platform = $('.booking_nav_tools');
				break;
			case 'mobile':
				$platform = $('.m_booking_nav_tools');
				break;
		}
		$mobile_form = $platform.find('#mobile_review_form');
		$m_rating = $mobile_form.find('#mobile_rating');
		$m_star = $mobile_form.find('._star');
		$mobile_form.find("#mobile_review_image_box").hide();

		$mobile_form.find('#mobile_review_image_upload_btn').setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$mobile_form.find("#mobile_review_image_box").show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$mobile_form.find("#mobile_review_image_box").append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
		autosize($('.textarea_block textarea'));
	};

	var changeRating = function(n){
		$m_rating.val(n + 1);
		$m_star.each(function(e){
			if(n <= 0 && e == 0){
				if(n == -1){
					$(this).removeClass('active');
				}else{
					$(this).addClass('active');
				}
			}else{
				$(this).removeClass('active');
				if(e <= n){
					$(this).addClass('active');
				}
			}
		});
	};

	var reviewFormShow = function(t){
		var sub_form = $("._sub_form_" + t);

		sub_form.data('show', 'Y');
		sub_form.show();
		var comment_add_body = sub_form.find('._comment_add_body_' + t);

		$('body').off('mouseup.sub_comment')
			.on('mouseup.sub_comment', function(e){
				var $c_target = $(e.target);
				var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
				if($s_form.length == 0){

					var text = comment_add_body.val();
					sub_form.data('show', 'N');
					if(text == ''){
						$('body').off('mouseup.sub_comment');
						reviewFormHide();
					}
				}
			});
	};

	var reviewEditShow = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.siblings().hide();

		editor_form.data('show', 'Y');
		editor_form.show();

	};

	var reviewEditHide = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.hide();
		editor_form.siblings('.block-postmeta').show();
	};

	var reviewFormHide = function(){
		$("._sub_review_form").hide();
	};

	var reviewDelete = function(t, c){
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type : 'POST',
				data : {code : t, prod_code : c, isbook:'Y'},
				url : ('/shop/delete_review.cm'),
				dataType : 'json',
				success : function(result){
					if(result.msg == 'SUCCESS'){
						createHtml(result.prod_idx);
						SITE_BOOKING.changeContentTab('review');
					}else
						alert(result.msg);
				}
			});
		}
	};

	var imageUploadInit = function(n){
		$("#sub_review_image_box_" + n).hide();
		//$("#editor_review_image_box_"+n).hide();

		$('#sub_review_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#sub_review_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#sub_review_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});

		$('#editor_review_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#editor_review_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#editor_review_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
	};

	var submit = function(t, type, i){
		switch(type){
			case 'main': // PC 형태 form Q&A
				var data = $form.serializeObject();
				break;
			case 'sub_form': //PC 형태 form Q&A 댓글
				var data = $('#sub_review_form_' + i).serializeObject();
				break;
			case 'editor': // PC 형태 form Q&A 수정
				var data = $('#sub_review_editor_form_' + i).serializeObject();
				break;
			case 'mobile': // Mobile 형태 form Q&A
				var data = $('#mobile_review_form').serializeObject();
				break;
			case 'mobile_sub_form': // Mobile 형태 form Q&A 댓글
				var data = $('#mobile_sub_review_form_' + i).serializeObject();
				break;
			case 'mobile_editor': // Mobile 형태 form Q&A 수정
				var data = $('#mobile_sub_review_editor_form_' + i).serializeObject();
				break;
		}
		if(!t.hasClass("btn-writing")){
			t.addClass("btn-writing");
		}

		$.ajax({
			type : 'POST',
			data : {data : data, type : "mobile", isbook : 'Y'},
			url : ('/shop/add_review.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				if(!t.hasClass("btn-writing")){
					t.removeClass("btn-writing");
				}
				if(result.msg == 'SUCCESS'){
					createHtml(result.prod_idx);
					// SITE_SHOP_DETAIL.changeContentTab('review');
					SITE_BOOKING.changeContentTab('review');
					$("div[id^='sub_review_image_box_']").hide();
				}else
					alert(result.msg);
			}
		});
	};

	var createHtml = function(prod_idx, review_page, qna_page){
		$review_wrap = $('._review_wrap');
		$.ajax({
			type : 'POST',
			data : {prod_idx : prod_idx, review_page : review_page, qna_page : qna_page},
			url : ('/shop/prod_review_pc_html.cm'),
			dataType : 'html',
			cache : false,
			success : function(result){
				$review_wrap.html(result);
			}
		});
	};

	return {
		init : function(t){
			init(t);
		},
		submit : function(t,type,i){
			submit(t,type,i);
		},
		changeRating : function(n){
			changeRating(n);
		},
		FormShow : function(t){
			reviewFormShow(t);
		},
		Delete : function(t, c){
			reviewDelete(t, c);
		},
		EditShow : function(t){
			reviewEditShow(t);
		},
		EditHide : function(t){
			reviewEditHide(t);
		},
		imageUploadInit : function(n){
			imageUploadInit(n);
		},
		createHtml : function(prod_idx, review_page, qna_page){
			createHtml(prod_idx, review_page, qna_page);
		}
	}
}();

var SITE_BOOKING_QNA = function(){
	var $qna_wrap;
	var $mobile_form;
	var $form;
	var $secret;
	var $m_secret;
	var $platform;

	var init = function(t){
		switch(t){
			case 'pc':
				$platform = $('.booking_nav_tools');
				break;
			case 'mobile':
				$platform = $('.m_booking_nav_tools');
				break;
		}
		$mobile_form = $platform.find('#mobile_qna_form');
		$m_secret = $mobile_form.find('._secret');
		$secret = $platform.find('._secret');
		$secret.on('click', function(){
			if($secret.hasClass('active')){
				$secret.removeClass('active');
				$platform.find('#secret').val('N');
			}else{
				$secret.addClass('active');
				$platform.find('#secret').val('Y');
			}
		});
		$mobile_form.find("#mobile_qna_image_box").hide();

		$mobile_form.find('#mobile_qna_image_upload_btn').setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$mobile_form.find("#mobile_qna_image_box").show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$mobile_form.find("#mobile_qna_image_box").append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
		autosize($('.textarea_block textarea'));
	};

	var qnaFormShow = function(t){
		var sub_form = $("._sub_form_" + t);

		sub_form.data('show', 'Y');
		sub_form.show();
		var comment_add_body = sub_form.find('._comment_add_body_' + t);

		$('body').off('mouseup.sub_comment')
			.on('mouseup.sub_comment', function(e){
				var $c_target = $(e.target);
				var $s_form = $c_target.closest('._sub_form_' + t + ', ._show_sub_form_btn_' + t);
				if($s_form.length == 0){

					var text = comment_add_body.val();
					sub_form.data('show', 'N');
					if(text == ''){
						$('body').off('mouseup.sub_comment');
						qnaFormHide();
					}
				}
			});
	};

	var qnaEditShow = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.siblings().hide();

		editor_form.data('show', 'Y');
		editor_form.show();

	};

	var qnaEditHide = function(t){
		var editor_form = $("._sub_form_editor_" + t);
		editor_form.hide();
		editor_form.siblings('.block-postmeta').show();
	};

	var qnaFormHide = function(){
		$("._sub_qna_form").hide();
	};

	var qnaDelete = function(code, prod_code, secret_pass){
		if(confirm(LOCALIZE.설명_삭제하시겠습니까())){
			$.ajax({
				type : 'POST',
				data : {code : code, prod_code : prod_code, secret_pass : secret_pass, isbook:'Y'},
				url : ('/shop/delete_qna.cm'),
				dataType : 'json',
				success : function(result){
					if(result.msg == 'SUCCESS'){
						SITE_BOOKING.changeContentTab('qna');
					}else
						alert(result.msg);
				}
			});
		}
	};

	var qnaModify = function(idx, code, secret_pass, is_book){
		$.ajax({
			type : 'POST',
			data : {idx : idx, prod_code : code, secret_pass : secret_pass, is_book : is_book},
			url : ('/shop/show_secret_qna.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					qnaEditShow(idx);
				}else
					alert(result.msg);
			}
		});
	};

	var qnaShow = function(idx, code, secret_pass, is_book){
		$.ajax({
			type : 'POST',
			data : {idx : idx, prod_code : code, secret_pass : secret_pass, is_book : is_book},
			url : ('/shop/show_secret_qna.cm'),
			dataType : 'json',
			success : function(result){
				if(result.msg == 'SUCCESS'){
					$("._comment_body_"+idx).html(result.html);
					if(result.isSubComment){
						for(var i in result.sub_comment){
							var sub_data = result.sub_comment[i];
							$("._comment_child_"+idx+"_"+sub_data.idx).html(sub_data.html);
						}
					}
				}else
					alert(result.msg);
			}
		});
	};

	var qnaConfirmShow = function (e, idx, prod_code, type,code){
		var $show_secret_password = $('#show_secret_password');
		if($show_secret_password.length == 0){
			$show_secret_password = $('<div class="remove-pop" id="show_secret_password" style="position:absolute; left:0;top:0;z-index:99999;"><p>'+LOCALIZE.설명_작성시등록하신비밀번호를입력해주세요()+'</p><div class="input_area"><input type="password" placeholder="'+LOCALIZE.설명_비밀번호()+'"><button class="btn btn-primary _confirm">'+LOCALIZE.버튼_확인닫기()+'</button></div></div>').hide();
			$('body').append($show_secret_password);
		}
		var $show_link = $(event.target);

		var top = $show_link.offset().top;
		var left = $show_link.offset().left;

		$show_secret_password.css({
			position : 'absolute',
			top : top,
			left : left
		});

		$show_secret_password.find('input').val('');
		$show_secret_password.show();
		$show_secret_password.off('click', '._confirm')
			.on('click', '._confirm', function(){
				var secret_pass = $show_secret_password.find('input').val();
				$show_secret_password.hide();
				switch(type){
					case 'show' :
						qnaShow(idx, prod_code, secret_pass, 'Y',code);
						break;
					case 'modify' :
						qnaModify(idx, prod_code, secret_pass, 'Y',code);
						break;
					case 'delete' :
						qnaDelete(code, prod_code, secret_pass);
						break;

				}
			});
		$('body').off('mousedown.show_secret')
			.on('mousedown.show_secret', function(e){
				var $tmp = $(e.target).closest('#show_secret_password');
				if($tmp.length == 0){
					$show_secret_password.hide();
					$('body').off('click.show_secret');
				}
			});
	};

	var imageUploadInit = function(n){
		$("#sub_qna_image_box_" + n).hide();

		$('#sub_qna_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#sub_qna_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#sub_qna_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});

		$('#editor_qna_image_upload_btn_' + n).setUploadImage({
			url : '/shop/upload_image.cm',
			dropZone : 'icon_img_upload_wrap',
			singleFileUploads : true,
			formData : {temp : 'Y'}
		}, function(res, data){
			$("#editor_qna_image_box_" + n).show();
			$.each(data, function(e, tmp){
				if(tmp.error == "" || tmp.error == null){
					var url = CDN_UPLOAD_URL + tmp.url;
					var html = '<span class="file-add"><input type="hidden" name="img" value="' + tmp.name + '"><img src="' + url + '"><em class="del" onclick="POST_COMMENT.removeCommentImg($(this))"></em></span>';
					$("#editor_qna_image_box_" + n).append(html);
				}else{
					alert(tmp.error);
				}
			});
		});
	};

	var submit = function(t, type, i){
		switch(type){
			case 'main': // PC 형태 form Q&A
				var data = $form.serializeObject();
				break;
			case 'sub_form': //PC 형태 form Q&A 댓글
				var data = $platform.find('#sub_qna_form_' + i).serializeObject();
				break;
			case 'editor': // PC 형태 form Q&A 수정
				var data = $platform.find('#sub_qna_editor_form_' + i).serializeObject();
				break;
			case 'mobile': // Mobile 형태 form Q&A
				var data = $platform.find('#mobile_qna_form').serializeObject();
				break;
			case 'mobile_sub_form': // Mobile 형태 form Q&A 댓글
				var data = $platform.find('#mobile_sub_qna_form_' + i).serializeObject();
				break;
			case 'mobile_editor': // Mobile 형태 form Q&A 수정
				var data = $platform.find('#mobile_sub_qna_editor_form_' + i).serializeObject();
				break;
		}
		if(!t.hasClass("btn-writing")){
			t.addClass("btn-writing");
		}

		$.ajax({
			type : 'POST',
			data : {data : data, type : type, isbook : "Y"},
			url : ('/shop/add_qna.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				if(!t.hasClass("btn-writing")){
					t.removeClass("btn-writing");
				}
				if(result.msg == 'SUCCESS'){
					SITE_BOOKING.changeContentTab('qna');
				}else
					alert(result.msg);
			}
		});
	};

	return {
		init : function(t){
			init(t);
		},
		submit : function(t,type,i){
			submit(t,type,i);
		},
		FormShow : function(t){
			qnaFormShow(t);
		},
		Delete : function(code, prod_code){
			qnaDelete(code, prod_code);
		},
		EditShow : function(t){
			qnaEditShow(t);
		},
		EditHide : function(t){
			qnaEditHide(t);
		},
		imageUploadInit : function(n){
			imageUploadInit(n);
		},
		confirmShow : function(e, idx, prod_code, type, code){
			qnaConfirmShow(e, idx, prod_code, type, code);
		}
	}
}();