<?php

include_once("services.php");
$page = !empty($_GET["page"]) ? $_GET["page"] : "";
$reddit = new Reddit();
$soundcloud = new SoundCloud();
$youtube = new Youtube();
// $beatport = new Beatport();
$S = new Services();

if( $page == "filters" ) {
	foreach( $S::getServices() AS $k => $v ) {
		echo "<input type=\"checkbox\" name=\"tracks-services\" value=\"$k\" id=\"$k\" /><label for=\"$k\">$k</label><br />";
	}
	echo <<<EOT
<script type="text/javascript">
$("#filters-tracks").siblings().hide().end().show().find("input").button({ icons: { primary: "ui-icon-check" } }).click(function(){
	if( this.checked ) {
		$(this).button("option", "icons", { primary: "ui-icon-close" });
		$("#loadhere").children("#tracks").find(".item."+$(this).val().toLowerCase()).hide();
	}
	else {
		$(this).button("option", "icons", { primary: "ui-icon-check" });
		$("#loadhere").children("#tracks").find(".item."+$(this).val().toLowerCase()).show();
	}
});
</script>
EOT;
}
else if( $page == "search" ) {
	header("Content-type: application/json");
	$q = urldecode($_GET["q"]);
	$pagenumber = !empty($_GET["pagenumber"]) ? $_GET["pagenumber"] : 0;
	$n = $pagenumber * LIMIT;
	$youtube->video_search($q);
	$items = $youtube->getItems($n);
	echo json_encode($items);
}
else {
	header("Content-type: application/json");
	$pagenumber = !empty($_GET["pagenumber"]) ? $_GET["pagenumber"] : 0;
	$n = $pagenumber * LIMIT;
	// $items = array_merge($reddit->getItems($n));
	// $items = array_merge($reddit->getItems($n), $soundcloud->getItems($n));
	// $items = array_merge($reddit->getItems($n), $soundcloud->getItems($n));
	// $lastfm = new LastFM("chart.getHypedTracks");
	$items = array_merge($reddit->getItems($n), $soundcloud->getItems($n));
	// $items = $reddit->getItems($n);
	shuffle($items);
	echo json_encode($items);
}
?>
