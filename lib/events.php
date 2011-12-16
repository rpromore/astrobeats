<?php

include_once("services.php");
$pagenumber = !empty($_GET["pagenumber"]) ? $_GET["pagenumber"] : 0;
$page = !empty($_GET["page"]) ? $_GET["page"] : "";
$lastfm = new LastFM();
$S = new Services();

if( $page == "search" ) {
	
}
else if( $page == "getItem" ) {
	$uid = $_GET["uid"];
	// since we're using last.fm all we really need is the event id
	$lastfm = new LastFM("event.getInfo");
	$lastfm->getItems($start, $length, array("event" => $uid));
}
else if( $page == "getFilters" ) {
	echo <<<EOT
<input type="radio" name="location" id="aroundme" /><label for="aroundme">Around me</label>
<input type="radio" name="location" id="city" checked="checked" /><label for="city">City</label><br />
<ul id="forcity">
	<center><input type="text" value="Des Moines" name="cityvalue" id="cityvalue" /></center>
</ul>
<input type="checkbox" name="radius" id="radius" checked="checked" /><label for="radius">Within</label><br />
<ul>
	<input type="text" value="50" style="width: 100px" name="radius" id="radiusvalue" /> miles
</ul>

<script type="text/javascript">
$("#filters-events").show().siblings().hide();
if( !navigator.location )
	$("#aroundme").hide();
$("#aroundme").button({
	icons: {
		primary: "ui-icon-close"
	}
}).change(function(){
	if( this.checked ) {
		$(this).button("option", "icons", { primary: "ui-icon-check" });
		$("#city").button("option", "icons", { primary: "ui-icon-close" });
		$("#city").siblings("ul#forcity").hide();
		
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			$("div#loadhere div#events").html("");
			var d = $("#radius").val();
			Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", lat: lat, long: long, distance: d });
		});
	}
	else {
		$(this).button("option", "icons", { primary: "ui-icon-close" });
		$("#city").button("option", "icons", { primary: "ui-icon-check" });
		$("#city").siblings("ul#forcity").show();
		$("#cityvalue").trigger("change");
	}
});
$("#city").button({
	icons: {
		primary: "ui-icon-check"
	}
}).change(function(){
	if( this.checked ) {
		$(this).button("option", "icons", { primary: "ui-icon-check" });
		$(this).siblings("ul#forcity").show();
		$("#cityvalue").trigger("change");
		$("#aroundme").button("option", "icons", { primary: "ui-icon-close" });
	}
	else {
		$(this).button("option", "icons", { primary: "ui-icon-close" });
		$(this).siblings("ul#forcity").hide();
		$("#aroundme").button("option", "icons", { primary: "ui-icon-check" });
	}
});
$("#radius").button({
	icons: {
		primary: "ui-icon-check"
	}
});
$("#cityvalue").change(function(){
	var v = $(this).val();
	var d = $("#radius").val();
	$("div#loadhere div#events").html("");
	Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", location: v, distance: d });
});
$("#radiusvalue").change(function(){
	$("div#loadhere div#events").html("");
	var d = $(this).val();
	var v = $("#cityvalue").val();
	if( $("ul#forcity").is(":visible") )
		Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", location: v, distance: d });
	else {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var long = position.coords.longitude;
			Astrobeats.items.loadItems($("div#loadhere div#events"), { cat: "events", lat: lat, long: long, distance: d });
		});
	}
});

</script>
</script>
EOT;
}
else {
	header("Content-type: application/json");
	$n = $pagenumber * LIMIT;
	
	$lat = $_GET["latitude"];
	$long = $_GET["longitude"];
	$location = urlencode($_GET["location"]);
	if( $location == null )
		$location = "Des+Moines";
	$distance = $_GET["distance"];
	
	$params = array("lattitude" => $lat, "longitude" => $long, "location" => $location, "distance" => $distance);
	
	$items = array_merge($lastfm->getItems($n, LIMIT, $params));
	// shuffle($items);
	echo json_encode($items);
}
?>
