$(document).ready(function(){
	$("#seekbar").click(function(e){
		var x = e.offsetX;
		window.player.seekPercent(x);
	});
	$(".button#play").button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function(){
		window.player.play();
	});
	$(".button#pause").button({
		text: false,
		icons: {
			primary: "ui-icon-pause"
		}
	}).click(function(){
		window.player.pause();
	});
	$(".button#prev").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	}).click(function(){
		$(".item.playing").prev(".item").trigger("click");
	});
	$(".button#next").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	}).click(function(){
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
