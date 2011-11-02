$(document).ready(function(){
    // data
    /*
     * go through each event
		if attendance-max > current-attendance-max {
			attentdance-max = this-attendance-max
		}

		v = attendance-max/4
		if attendance >= attendancemax-v 
			use extralarge
		else if attendance >= attendancemax-v*2
			use large
		else if attendance >= attendancemax-v*3
			use medium
		else
			use small
	*/
	
	$("#resources, #genres").button({
		icons: {
			secondary: "ui-icon-triangle-1-s"
		}
	}).click(function(){
		$(this).next().toggle();
	});
	
	function display(p) {
		var items = [], item;
		$container = $("#content-right #loadhere");
		$container.html('<div class="ball"></div><div class="ball1"></div>');
		switch(p) {
			case "/concerts":
				places_highlight("concerts");
				$.getJSON("http://ws.audioscrobbler.com/2.0/?method=geo.getevents&limit=50&location=united+states&api_key=b25b959554ed76058ac220b7b2e0a026&format=json")
					.success(function(data){
						items = [];
						$.each(data.events["event"], function(key, val) {
							if( val["image"][2]["#text"] != "" ) {
								v = val["image"][2]["#text"].replace("\/126\/", "\/126s\/");
								item = '<div class="item"><img src="'+v+'" /><div class="overlay"><h2>'+val["title"]+'</h2></div></div>';
								items.push(item);
							}
						});
						var $items = $(items.join(''));
						$container.masonry("destroy").html($items);
						$items.imagesLoaded(function(){
							$container.masonry({ itemSelector: '.item', columWidth: 100 }).find(".item").live({ mouseenter: function(){ $(this).children(".overlay").fadeIn("fast"); }, mouseleave: function(){ $(this).children(".overlay").fadeOut("fast"); } });
						});
					});
				break;
			case "/artists":
				places_highlight("artists");
				$.getJSON("http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=b25b959554ed76058ac220b7b2e0a026&format=json")
					.success(function(data){
						items = [];
						$.each(data.artists["artist"], function(key, val) {
							if( val["image"][2]["#text"] != "" ) {
								v = val["image"][2]["#text"].replace("\/126\/", "\/126s\/");
								item = '<div class="item"><img src="'+v+'" /><div class="overlay"><h2>'+val["name"]+'</h2></div></div>';
								items.push(item);
							}
						});
						var $items = $(items.join(''));
						$container.masonry("destroy").html($items)
						$items.imagesLoaded(function(){
							$container.masonry({ itemSelector: '.item', columWidth: 100 }).find(".item").live({ mouseenter: function(){ $(this).children(".overlay").fadeIn("fast"); }, mouseleave: function(){ $(this).children(".overlay").fadeOut("fast"); } });
						});
					});
				break;
			case "/tracks":
				places_highlight("tracks");
				$.getJSON("http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=b25b959554ed76058ac220b7b2e0a026&format=json")
					.success(function(data){
						items = [];
						$.each(data.tracks["track"], function(key, val) {
							if( val["image"][2]["#text"] != "" ) {
								v = val["image"][2]["#text"].replace("\/126\/", "\/126s\/");
								item = '<div class="item"><img src="'+v+'" /><div class="overlay"><h2>'+val["title"]+'</h2></div></div>';
								items.push(item);
							}
						});
						var $items = $(items.join(''));
						$container.masonry("destroy").html($items);
						$items.imagesLoaded(function(){
							$container.masonry({ itemSelector: '.item', columWidth: 100 }).find(".item").live({ mouseenter: function(){ $(this).children(".overlay").fadeIn("fast"); }, mouseleave: function(){ $(this).children(".overlay").fadeOut("fast"); } });
						});
					});
				break;
			case "/explore":
				places_highlight("explore");
				
				break;
			case "/playlists":
				places_highlight("playlists");
				$container.html("playlists");
				break;
			case "/videos":
				places_highlight("videos");
				$container.html("videos");
				break;
			case "/options":
				places_highlight("options");
				$container.html("options");
				break;
		}
	}
	
	console.log($.address.value());
	if( $.address.value() == '/319/' )
		$.address.value("explore");
	$.address.change(function(event) {
		console.log(event.value.replace("/319/#", ""));
		display(event.value.replace("/319/#", ""));
	});
	$.address.history(true);
	
	function places_highlight(p) {
		$("ul#places li#"+p).addClass("active").siblings("li").removeClass("active").find("ul.multi").find("li.active").removeClass("active");
		$("div#content-right div#title").html(p);
	}
	
	$("ul#places li").click(function(){
		$(this).find("a").click();
	});
	$("ul#places a").click(function() {  
		$.address.value($(this).attr('href'));
		return false;  
	});  
    
    $("div#content-left > div#menu-title + ul > li").live("click", function(){
        $("div#content-left").find("li").removeClass("active");
        $(this).addClass("active");
    });
    $("ul#places > li:not(.break)")
        .live("click", function(){
            $(this).addClass("active").siblings("li").removeClass("active").find("ul.multi").find("li.active").removeClass("active");
        })
        .find("a")
            .click(function(){ $(this).parent("li").addClass("active").siblings("li").removeClass("active").find("ul.multi").find("li.active").removeClass("active"); })
    ;
});
