var SITE_VIDEO = function () {
	var code;
	var data = {};
	var $iframe;
	var $video;
	var $cover_layer;
	var video_list = {
		'youtube' : '//www.youtube.com/embed/{id}?mode=opaque&autoplay=1&loop=1&rel=0&playlist={id}&showinfo={is_hide_title}',
		'vimeo' : '//player.vimeo.com/video/{id}?autoplay=1&api=1&loop={is_auto_play}',
		'dailymotion' : '//www.dailymotion.com/embed/video/x5a5gll?wmode=opaque&autoplay=1&api=postMessage',
		'vk' : ''
	};

	var init = function(c,d){
		code = c;
		data = d;
		$video = $('#video_' + code);
		$iframe = $('#video_i_' + code);
		$iframe.attr('src','');
		$cover_layer = $video.find('._cover_layer');
	};
	var play = function () {
		if(typeof data.video_id == 'undefined')
			return;
		if(typeof data.video_type == 'undefined')
			data.video_type = 'youtube';
		if(data.video_type == '')
			data.video_type = 'youtube';
		if(data.video_id == '')
			return;
		$cover_layer.hide();
		var tmp = {
			'id' : data.video_id,
			'is_auto_play' : data.loop=='Y'?1:0,
			'is_hide_title' : data.hide_title=='Y'?0:1
		};
		var src = getTemplateConvert(video_list[data.video_type],tmp);
		$iframe.attr('src', src);
	};
	
	return {
		'play': function () {
			play();
		},
		'init': function (c, d) {
			init(c, d);
		}
	}
};