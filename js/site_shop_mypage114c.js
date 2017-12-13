var SITE_SHOP_MYPAGE = function(){
	var $order_list;
	var $order_list_empty;
	var $order_list_more_button;
	var currentPage = 1;
	var getOrderListProgress = false;

	var $point_list;
	var $point_list_table;
	var $point_list_empty;
	var $point_list_more_button;
	var get_point_list_progress = false;

	var $order_cancel_form;
	var auto_cancel_enable = 'N';	/* 자동취소 지원 Y/N */
	var cancel_order_code = '';	/* 취소처리중인 주문코드 */

	var initOrderList = function(){
		$order_list = $('#shop_mypage_orderlist');
		$order_list_empty = $('#shop_mypage_orderlist_empty');
		$order_list_more_button = $('#shop_mypage_orderlist_more');
	};
	var initPointList = function(){
		$point_list = $('#shop_mypage_pointlist');
		$point_list_table = $('#shop_mypage_pointlist_table');
		$point_list_empty = $('#shop_mypage_pointlist_empty');
		$point_list_more_button = $('#shop_mypage_pointlist_more');
	};
	/**
	 * 위시리스트 제거
	 * @param prod_code
	 */
	var deleteProdWish = function(prod_code){
		$.ajax({
			type : 'POST',
			data : {'type' : 'delete', 'prod_code' : prod_code},
			url : ('/shop/add_prod_wish.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					window.location.reload();
				}else
					alert(res.msg);
			}
		});
	};

	var getOrderList = function(type){
		if(getOrderListProgress) return;
		getOrderListProgress = true;
		$.ajax({
			type : 'POST',
			data : {'page' : currentPage, 'type':type},
			url : ('/shop/mypage_order_list.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				getOrderListProgress = false;
				if(result.msg == 'SUCCESS'){
					if(result.count > 0){
						$order_list_empty.hide();
						$order_list.show().html(result.html);
					}else{
						$order_list.hide();
						$order_list_empty.show();
					}
					currentPage++;
					if(parseInt(currentPage) > parseInt(result.pageCount)) $order_list_more_button.hide();
				}else{
					alert(result.msg);
				}
			}
		});
	};

	var getPointList = function(){
		if(get_point_list_progress) return;
		get_point_list_progress = true;
		$.ajax({
			type : 'POST',
			data : {'page' : currentPage},
			url : ('/shop/mypage_point_list.cm'),
			dataType : 'json',
			cache : false,
			success : function(result){
				get_point_list_progress = false;
				if(result.msg == 'SUCCESS'){
					if(result.count > 0){
						$point_list_table.show();
						$point_list_empty.hide();
						$point_list.append(result.html);
					}else{
						$point_list_table.hide();
						$point_list_empty.show();
					}
					currentPage++;
					if(parseInt(currentPage) > parseInt(result.pageCount)) $point_list_more_button.hide();
				}else{
					alert(result.msg);
				}
			}
		});
	};

	var trackingParcel = function(code, no){
		if(isBlank(code) || isBlank(no)){
			alert(LOCALIZE.설명_택배사또는송장번호가입력되지않았습니다());
			return;
		}
		$.ajax({
			type : 'POST',
			data : {'code':code, 'invoice':no},
			url : ('/admin/ajax/shop/get_parcel_info.cm'),
			dataType : 'html',
			success : function(html){
				$.cocoaDialog.open({type : 'admin', custom_popup : html, width : 550});
			}
		});
	};

	/**
	 * 취소요청 페이지 초기화
	 * @param auto_cancel 자동취소지원유무 (Y/N)
	 */
	var initCancelOrder = function(order_code, auto_cancel){
		$order_cancel_form = $('#order_cancel_form');
		auto_cancel_enable = auto_cancel;
		cancel_order_code = order_code;
		cancelOrderSelectProdOrder();
	};

	/* 취소요청 페이지 품목주문 전체 선택 */
	var cancelOrderSelectAllProdOrder = function(chk){
		$order_cancel_form.find("input._prodOrderCheck").prop("checked", chk);
		cancelOrderLoadRefundPriceData();
	};

	/* 취소요청 페이지 품목주문 선택 */
	var cancelOrderSelectProdOrder = function(){
		if ($order_cancel_form.find("input._prodOrderCheck:not(:checked)").length==0 && auto_cancel_enable=='Y'){	/* 전체 취소, 자동 취소 가능 */
			$('#refund_data_wrap').hide();
		}else{	/* 부분취소 */
			$('#refund_data_wrap').show();
		}
		cancelOrderLoadRefundPriceData();
	};

	/* 취소요청 페이지에서 환불 금액 정보를 로드함 */
	var cancelOrderLoadRefundPriceData = function(){
		var prod_order_code_list = [];
		$order_cancel_form.find("input._prodOrderCheck:checked").each(function(){
			prod_order_code_list.push($(this).val());
		});
		$.ajax({
			type : 'POST',
			data : {"prod_order_code_list": prod_order_code_list, "order_code": cancel_order_code},
			url : ('/shop/order_cancel_refund_price_data.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					$('#refund_price_data_wrap').html(res.result_html);
				}
			}
		});
	};

	/**
	 * 취소요청 페이지 취소버튼 누를떄 처리
  	 * @param type shop/booking
	 */
	var cancelOrder = function(type){
		$order_cancel_form = $('#order_cancel_form');
		if (type=='shop'){
			if(!confirm("주문 취소를 진행하시겠습니까?")) return;
		}else if (type=='booking'){
			if(!confirm("예약 취소를 진행하시겠습니까?")) return;
		}
		var data = $order_cancel_form.serializeObject();
		data.type=type;
		$.ajax({
			type : 'POST',
			data : data,
			url : ('/shop/order_cancel.cm'),
			dataType : 'json',
			success : function(res){
				if(res.msg == 'SUCCESS'){
					alert(res.result_msg);
					window.location.href='./?m2=order';
				}else{
					alert(res.msg);
				}
			}
		});
	};

	var openMobileOrder = function(idx){
		$.ajax({
			type : 'POST',
			data : {'idx' : idx},
			url : ('/dialog/order_history.cm'),
			dataType : 'html',
			success : function(html){
				$.cocoaDialog.open({type : 'admin_order_history', custom_popup : html});
			}
		});
	};

	return {
		initPointList : function(){
			initPointList();
		},
		initOrderList : function(){
			initOrderList();
		},
		getOrderList : function(type){
			getOrderList(type);
		},
		getPointList : function(){
			getPointList();
		},
		deleteProdWish : function(prod_code){
			deleteProdWish(prod_code);
		},
		'trackingParcel' : function(code, no){
			trackingParcel(code, no);
		},
		'openMobileOrder' : function(no){
			openMobileOrder(no);
		},
		'initCancelOrder': function(order_code, auto_cancel_enable){
			initCancelOrder(order_code, auto_cancel_enable);
		},
		'cancelOrder': function(type){
			cancelOrder(type);
		},
		'cancelOrderSelectAllProdOrder': function(chk){
			cancelOrderSelectAllProdOrder(chk);
		},
		'cancelOrderSelectProdOrder': function(){
			cancelOrderSelectProdOrder();
		}
	}
}();