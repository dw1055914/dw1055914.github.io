var FB_PIXEL = function(){
	var ViewContent = function(id,name,value,currency){	/* 컨텐츠 조회 */
		if(typeof fbq != 'undefined'){
			fbq('track', 'ViewContent', {
				content_type : 'product',
				content_ids : id,
				content_name : name,
				value : value,
				currency : currency
			});
		}
	};
	var AddToCart = function(){	/* 장바구니 추가 */
		//console.log("FB_PIXEL - AddToCart");
		if (typeof fbq != 'undefined') fbq('track', 'AddToCart');
	};
	var AddToWishlist = function(){	/* 위시리스트 추가 */
		//console.log("FB_PIXEL - AddToWishlist");
		if (typeof fbq != 'undefined') fbq('track', 'AddToWishlist');
	};
	var InitiateCheckout = function(){	/* 결제시작 */
		//console.log("FB_PIXEL - InitiateCheckout");
		if (typeof fbq != 'undefined') fbq('track', 'InitiateCheckout');
	};
	var AddPaymentInfo = function(){	/* 결제 정보 추가 */
		//console.log("FB_PIXEL - AddPaymentInfo");
		if (typeof fbq != 'undefined') fbq('track', 'AddPaymentInfo');
	};
	var Purchase = function(value,currency){	/* 결제 완료 */
		if (typeof fbq != 'undefined') fbq('track', 'Purchase',{'value' : value, 'currency' : currency});
	};
	var CompleteRegistration = function(){
		if (typeof fbq != 'undefined') fbq('track', 'CompleteRegistration');
	};
	return {
		"ViewContent" : function(id,name,value,currency){
			ViewContent(id,name,value,currency);
		},
		"AddToCart" : function(){
			AddToCart();
		},
		"AddToWishlist" : function(){
			AddToWishlist();
		},
		"InitiateCheckout" : function(){
			InitiateCheckout();
		},
		"AddPaymentInfo" : function(){
			AddPaymentInfo();
		},
		"Purchase" : function(value,currency){
			Purchase(value,currency);
		},
		"CompleteRegistration" : function(){
			CompleteRegistration();
		}
	}
}();