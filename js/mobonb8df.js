	var is_ssl = false;
var MOBON = function(){
	var init = function(ssl_switch){
		is_ssl = ssl_switch;
	};
	var mobRfShop = function(code, name, img, price){ /* 상품 상세 페이지 */
		var sh = new EN();
		sh.setData("pcode",code);
		sh.setData("pnm",name);
		sh.setData("img",img);
		sh.setData("price",price);
		if(is_ssl){
			sh.setSSL(true);
		}
		sh.sendRfShop();
	};
	var AddToCart = function(){ /* 장바구니 담기 */
		var sh = new EN();
		if(is_ssl){
			sh.setSSL(true);
		}
		sh.sendCart();
	};
	var AddToWish = function(){ /* 위시 리스트 담기 */
		var sh = new EN();
		if(is_ssl){
			sh.setSSL(true);
		}
		sh.sendWish();
	};
	var mobConv = function(order_code, prod_code, count, price, name){ /* 결제 및 구매 완료 */
		var cn = new EN();
		cn.setData("ordcode", order_code);
		cn.setData("prcode", prod_code);
		cn.setData("qty" , count);
		cn.setData("price" , price);
		cn.setData("pnm" , name);
		cn.setData();
		if(is_ssl){
			cn.setSSL(true);
		}
		cn.sendConv();
	};
	return {
		"init" : function(ssl_switch){
			init(ssl_switch);
		},
		"mobRfShop" : function(code, name, img, price){
			mobRfShop(code, name, img, price);
		},
		"AddToCart" : function(){
			AddToCart();
		},
		"mobConv" : function(order_code, prod_code, count, price, name){
			mobConv(order_code, prod_code, count, price, name);
		},
		"AddToWish" : function(){
			AddToWish();
		}
	}
}();