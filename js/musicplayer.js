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
			$("#coverart").animate({ bottom: -258 });
			$(this).removeClass("active");
		}
		else {
			$("#coverart").animate({ bottom: 60 });
			$(this).addClass("active");
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
	
	$(".button#volumeon").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-on"
		}
	}).click(function(){
		$("#volumebar").slider("value", 0);
	});
	$(".button#volumeoff").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-off"
		}
	}).click(function(){
		$("#volumebar").slider("value", 100);
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
});
