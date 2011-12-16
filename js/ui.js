function places_highlight(id) {
	$("ul#places").find("#"+id).addClass("active").siblings("li").removeClass("active");
}
$(document).ready(function(){
	// Top bar interaction
	places_highlight($.address.pathNames()[0]);
	
	$("ul#places > li").click(function(){
		$(this).addClass("active").siblings("li").removeClass("active");
		window.location = $(this).find("a").attr("href");
	}).find("a").click(function(e){
		e.stopPropagation();
		$(this).parent("li").addClass("active").siblings("li").removeClass("active");
		$.routes("set", $(this).attr("href"));
	});
	
	// Main content items
	$("#content-left form#search").submit(function(){
		v = $("#content-left input[type=text]").val();
		if( v != "undefined" ) {
			document.location.href = "#/search/"+v;
		}
		return false;
	});
		
	var lastItemWidth = 182;
	$("#displaystyle-wall").button({
		text: "Wall",
		icons: {
			primary: "ui-display-wall"
		}
	}).click(function(){
		$("#loadhere").attr("class", "wall").find(".item, .item > .thumb img").css({ width: lastItemWidth, height: lastItemWidth });
		lastItemWidth = $("#loadhere").find(".item").eq(0).css("width");
	});
	$("#displaystyle-list").button({
		text: "List",
		icons: {
			primary: "ui-display-list"
		}
	}).click(function(){
		lastItemWidth = $("#loadhere").find(".item").eq(0).css("width");
		$("#loadhere").attr("class", "list").find(".item").css("width", "100%").find(".desc, .desc2").width($(this).parent(".item").width() - $(this).prev().width());
	});
	$("#display-style").buttonset();
	
	// Left menu
	$("button#resources, button#genres").button({
		icons: {
			secondary: "ui-icon-triangle-1-s"
		}
	}).click(function(){
		$(this).next().toggle();
	});
	
	$("#thumbnail-size").slider({
		min: 126,
		max: 182,
		change: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ width: $(this).parent(".item").width()-$(this).prev().width(), height: v });
			lastItemWidth = v;
		},
		slide: function(){
			v = $("#thumbnail-size").slider("value");
			$("#loadhere.wall").find(".item").css({ width: v, height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.list").find(".item").css({ height: v }).find(".thumb, .thumb > img").css({ width: v, height: v });
			$("#loadhere.wall").find(".desc, .desc2").css({ width: v, height: v });
			$("#loadhere.list").find(".desc, .desc2").css({ width: $(this).parent(".item").width()-$(this).prev().width(), height: v });
			lastItemWidth = v;
		}
	}).slider("value", 182);
});
