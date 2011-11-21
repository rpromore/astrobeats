<?php				

error_reporting(E_ALL ^ E_NOTICE);

function lastfm() {
	$items = array();
	$cacheFile = "cache/lastfm.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$lastfm = json_decode(file_get_contents($cacheFile));
	else {
		$lastfm = file_get_contents("http://ws.audioscrobbler.com/2.0/?method=chart.gethypedtracks&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&limit=10");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $lastfm);
		$lastfm = json_decode($lastfm);
	}
	foreach( $lastfm->tracks->track AS $i ) {
		$title = $i->name;
		$artist = $i->artist->name;
		if( $i->image == null ) {
			// search lastfm to see if they have it
			$images = json_decode(file_get_contents("http://ws.audioscrobbler.com/2.0/?method=artist.getimages&format=json&artist=" . urlencode($artist) . "&limit=1&autocorrect=1&api_key=b25b959554ed76058ac220b7b2e0a026"));
			if( $images->image )
				$image = $images->image->sizes->size[5]->{"#text"};
			else
				$image = "";
		}
		else
			$image = $i->image[3]->{"#text"};
		$html = $image ? '<div class="thumb"><img src="' . $image . '" /></div>' : '';
		$html .= $image ? '<div class="desc">' : '<div class="desc2">';
		$html .= '<h2>' . $title . '</h2>by ' . $artist;
		$html .= '</div>';
		$items[] = array("title" => $title, "image" => $image, "from" => "lastfm", "artist" => $artist, "output" => $html);
	}
	return $items;
}
function reddit() {
	$items = array();
	$cacheFile = "cache/reddit.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$reddit = json_decode(file_get_contents($cacheFile));
	else {
		$reddit = file_get_contents("http://reddit.com/r/listentothis.json?limit=10");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $reddit);
		$reddit = json_decode($reddit);
	}
	foreach( $reddit->data->children AS $i )
		$items[] = array("name" => $i->data->title, "image" => !empty($i->data->media->oembed->thumbnail_url) ? $i->data->media->oembed->thumbnail_url : "", "from" => "reddit");
	return $items;
}
function soundcloud() {
	$items = array();
	$cacheFile = "cache/soundcloud.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$soundcloud = json_decode(file_get_contents($cacheFile));
	else {
		$soundcloud = file_get_contents("http://api.soundcloud.com/tracks.json?client_id=c6dc5b166e3d58345cc4751665f9ce08&order=hotness");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $soundcloud);
		$soundcloud = json_decode($soundcloud);
	}
	foreach( $soundcloud AS $i )
		$items[] = array("name" => $i->title, "image" => str_replace("large.jpg", "t300x300.jpg", $i->user->avatar_url), "from" => "soundcloud");
	return $items;
}

$items = array();

$items = array_merge($items, lastfm());
// $items = array_merge($items, reddit());
// $items = array_merge($items, soundcloud());

header('Content-type: application/json');
echo json_encode($items);

?>