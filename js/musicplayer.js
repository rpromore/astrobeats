$(document).ready(function(){
	$("#seekbar").click(function(e){
		var x = e.offsetX;
		window.player.seekPercent(x);
	});

	$(".button#info").click(function(){
		$.address.path("artists/"+$(".item.playing").attr("data-artist").replace(/ /g, '+'));
	});
	$(".button#eye").click(function(){
		if( $(this).hasClass("active") ) {
			$("#coverart").animate({ bottom: -258 }, "easeInQuart");
			$(this).removeClass("active");
			$(this).find("img").attr("src", "img/musicplayer/eye.png");
		}
		else {
			$("#coverart").animate({ bottom: 60 }, "easeOutQuart");
			$(this).addClass("active");
			$(this).find("img").attr("src", "img/musicplayer/eye-active2.png");
		}
	});
	$(".button#play").click(function(){
		window.player.play();
	});
	$(".button#pause").click(function(){
		window.player.pause();
	});
	$(".button#prev").click(function(){
		$(".item.playing").prev(".item").trigger("click");
	});
	$(".button#next").click(function(){
		$(".item.playing").next(".item").trigger("click");
	});
	$(".button#heart").button({
		text: false,
		icons: {
			primary: "ui-icon-heart"
		}
	});
	$(".button#download").button({
		text: false,
		icons: {
			primary: "ui-icon-arrowthickstop-1-s"
		}
	});
	
	var lastVolume = 100;
	
	$(".button#volumehigh, .button#volumelow").click(function(){
		lastVolume = $("#volumebar").slider("value");
		$("#volumebar").slider("value", 0);
	});
	$(".button#muted").click(function(){
		console.log("unmuting");
		console.log(lastVolume);
		$("#volumebar").slider("value", lastVolume);
	});
	$("#volumebar").slider({
		min: 0,
		max: 100,
		value: 100,
		change: function(evt, ui){
			window.player.setVolume(ui.value);
		},
		slide: function(evt, ui){
			window.player.setVolume(ui.value);
		}
	});
	
	$(".button#shuffle").click(function(){
		if( $(this).is(".active") ) {
			$(this).removeClass("active").find("img").attr("src", "img/musicplayer/shuffle.png");
			window.player.options.shuffle = false;
		}
		else {
			$(this).addClass("active").find("img").attr("src", "img/musicplayer/shuffle-active.png");
			window.player.options.shuffle = true;
		}
	});
	
	$(".button#repeat").click(function(){
		if( $(this).is(".active") ) {
			$(this).removeClass("active").find("img").attr("src", "img/musicplayer/repeat.png");
			window.player.options.repeat = false;
		}
		else {
			$(this).addClass("active").find("img").attr("src", "img/musicplayer/repeat-active.png");
			window.player.options.repeat = true;
		}
	});
});
