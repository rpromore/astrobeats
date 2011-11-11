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
	
	$("button#resources, button#genres").button({
		icons: {
			secondary: "ui-icon-triangle-1-s"
		}
	}).click(function(){
		$(this).next().toggle();
	});
	$("button#play").button({
		icons: {
			primary: "ui-icon-play"
		}
	});
	
	$(document).bind("ajaxStart.main", function(){
		$("#loading").show();
		$("#loadhere").hide();
	}).bind("ajaxStop.main", function(){
		$("#loading").hide();
		$("#loadhere").show();
	});
	
	
	function display(page) {
		$container = $("#loadhere");
		$container.masonry({ items: ".item" });
		switch(page) {
			case "/explore":
				$.getJSON("display.php", function(data){
					var items = [];
					$.each(data, function(k, v) {
						image = v["image"] ? '<div class="thumb"><img src="'+v["image"]+'" /></div>' : "";
						desc = image == "" ? "desc2" : "desc";
						// item = image ? '<div class="item">'+image+'<div class="desc"><h2>'+v["name"]+'</h2></div></div>' : '<div class="item reddit"><h2>'+v["name"]+'</h2></div>';
						item = '<div class="item">'+image+'<div class="'+desc+'"><h2>'+v["name"]+'</h2></div></div>';
						items.push(item);
					});
					items.shuffle();
					$items = $(items.join('')).css("opacity", "0");
					$items.imagesLoaded(function(){
						$("#loadhere")
							.html($items)
							.find(".item")
							.live(
								{ 
									mouseenter: function(){ $(this).children(".desc").stop().animate({ left: "0px" }, {duration: 700, easing: "easeOutExpo"}); }, 
									mouseleave: function(){ $(this).children(".desc").stop().animate({ left: "187px" }, {duration: 700, easing: "easeOutBounce"}); }
								}
							);
						$items.animate({ opacity: 1 }, 1000);
					});
				});	
		}
	}
});
