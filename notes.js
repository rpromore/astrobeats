Array.prototype.shuffle = function() {
	var s = [];
	while (this.length) s.push(this.splice(Math.random() * this.length, 1));
	while (s.length) this.push(s.pop());
	return this;
}

$(document).ready(function(){	
	$(document).scroll(function(){ console.log("scrolling"); });
	
	if( $.address.value() == '/concrrt/' )
		$.address.value("explore");
	$.address.change(function(event) {
		console.log(event.value.replace("/concrrt/#", ""));
		display(event.value.replace("/concrrt/#", ""));
	});
	$.address.history(true);
	
	var lastItemWidth = 182;
	
	$("#displaystyle-wall").button({
		text: "Wall",
		icons: {
			primary: "ui-display-wall"
		}
	})
	.click(function(){
		$("#loadhere").attr("class", "wall").find(".item").css({ width: lastItemWidth, height: lastItemWidth });
	});
	$("#displaystyle-list").button({
		text: "List",
		icons: {
			primary: "ui-display-list"
		}
	})
	.click(function(){
		lastItemWidth = $("#loadhere").find(".item").eq(0).css("width");
		$("#loadhere").attr("class", "list").find(".item").css("width", "100%");
	});
	$("#display-style").buttonset();
	
	$("button#resources, button#genres").button({
		icons: {
			secondary: "ui-icon-triangle-1-s"
		}
	}).click(function(){
		$(this).next().toggle();
	});
	$("button#play").button({
		text: false,
		icons: {
			primary: "ui-icon-play"
		}
	}).click(function(){
		$(this).hide();
		$("button#pause").show();
	});
	$("button#pause").button({
		text: false,
		icons: {
			primary: "ui-icon-pause"
		}
	}).click(function(){
		$(this).hide();
		$("button#play").show();
	});
	$("button#prev").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-prev"
		}
	});
	$("button#next").button({
		text: false,
		icons: {
			primary: "ui-icon-seek-next"
		}
	});
	$("button#heart").button({
		text: false,
		icons: {
			primary: "ui-icon-heart"
		}
	});
	$("button#download").button({
		text: false,
		icons: {
			primary: "ui-icon-arrowthickstop-1-s"
		}
	});
	var lastVolume = 100;
	$("button#volumeon").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-on"
		}
	}).click(function(){
		$(this).hide();
		$("button#volumeoff").show();
		lastVolume = $("#volumebar").children(".bar").css("width").replace("px", "");
		$("#volumebar").children(".bar").css("width", "0px");
	});
	$("button#volumeoff").button({
		text: false,
		icons: {
			primary: "ui-icon-volume-off"
		}
	}).click(function(){
		$(this).hide();
		$("button#volumeon").show();
		$("#volumebar").children(".bar").css("width", lastVolume);
	});
	$("#thumbnail-size").slider({
		min: 126,
		max: 182,
		change: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ height: v });
		},
		slide: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ height: v });
		}
	}).slider("value", 182);
	
	$(document).bind("ajaxStart.main", function(){
		$("#loading").show();
		$("#loadhere").hide();
	}).bind("ajaxStop.main", function(){
		$("#loading").hide();
		$("#loadhere").show();
	});
	
	$(document).scroll(function(){
		$("#loadhere").trigger("scroll");
	});
	
	$("#volumebar").mousedown(function(e){
		$(this).mousemove(function(e){
			$(this).children(".bar").css("width", e.offsetX);
		});
		$(this).children(".bar").css("width", e.offsetX);
	});
	$("#volumebar").mouseup(function(){
		$(this).unbind("mousemove");
	});
	
	function display(page) {
		$container = $("#loadhere");
		switch(page) {
			case "/explore":
				$.getJSON("display.php", function(data){
					var items = [];
					$.each(data, function(k, v) {
						image = v["image"] ? '<div class="thumb"><img src="'+v["image"]+'" /></div>' : "";
						desc = image == "" ? "desc2" : "desc";
						artist = v["artist"] == "" || v["artist"] == "undefined" ? "" : 'by <a href="">'+v["artist"]+'</a>';
						// item = image ? '<div class="item">'+image+'<div class="desc"><h2>'+v["name"]+'</h2></div></div>' : '<div class="item reddit"><h2>'+v["name"]+'</h2></div>';
						item = '<div class="item">'+image+'<div class="'+desc+'"><h2>'+v["name"]+'</h2>'+artist+'</div></div>';
						items.push(item);
					});
					items.shuffle();
					$items = $(items.join('')).css("opacity", "0");
					$items.imagesLoaded(function(){
						$("#loadhere")
							.html($items)
						;
						$("#loadhere.wall")
							.find(".item")
							.live(
								{ 
									mouseenter: function(){ $(this).children(".desc").stop().animate({ left: "0px" }, {duration: 400, easing: "easeOutExpo"}); }, 
									mouseleave: function(){ $(this).children(".desc").stop().animate({ left: "187px" }, {duration: 700, easing: "easeOutBounce"}); }
								}
							);
						$items.animate({ opacity: 1 }, 1000);
					});
				});	
		}
	}
});
