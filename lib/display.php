<?php				

error_reporting(E_ALL ^ E_NOTICE);
$max_limit = 50;
$limit = !empty($_GET["limit"]) ? $_GET["limit"] : 10;
$page = !empty($_GET["page"]) ? $_GET["page"] : 0;

function object_to_array($data) 
{
  if(is_array($data) || is_object($data))
  {
    $result = array(); 
    foreach($data as $key => $value)
    { 
      $result[$key] = object_to_array($value); 
    }
    return $result;
  }
  return $data;
}

function lastfm() {
	$items = array();
	$cacheFile = "cache/explore.lastfm.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$lastfm = json_decode(file_get_contents($cacheFile), true);
	else {
		$lastfm = file_get_contents("http://ws.audioscrobbler.com/2.0/?method=chart.gethypedtracks&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&limit=$max_limit");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $lastfm);
		$lastfm = json_decode($lastfm, true);
	}
	$lastfm = array_slice($lastfm["tracks"], $GLOBALS["page"]*$GLOBALS["limit"], $GLOBALS["limit"]);
	foreach( $lastfm["track"] AS $i ) {
		$title = $i["name"];
		$artist = $i["artist"]["name"];
		/*
		if( $i["image"] == null ) {
			// search lastfm to see if they have it
			$images = json_decode(file_get_contents("http://ws.audioscrobbler.com/2.0/?method=artist.getimages&format=json&artist=" . urlencode($artist) . "&limit=1&autocorrect=1&api_key=b25b959554ed76058ac220b7b2e0a026"));
			if( $images->image )
				$image = $images->image->sizes->size[5]->{"#text"};
			else
				$image = "";
		}
		else*/
			$image = $i["image"][3]["#text"];
		$html = $image ? '<div class="thumb"><img class="lazy" src="gray.gif" data-original="' . $image . '" /></div>' : '';
		$html .= $image ? '<div class="desc">' : '<div class="desc2">';
		$html .= '<h2>' . $title . '</h2>by ' . $artist;
		$html .= '</div>';
		$items[] = array("title" => $title, "image" => $image, "from" => "lastfm", "artist" => $artist, "output" => $html);
	}
	return $items;
}
function reddit() {
	$items = array();
	$cacheFile = "cache/explore.reddit.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$reddit = json_decode(file_get_contents($cacheFile), true);
	else {
		$reddit = file_get_contents("http://reddit.com/r/listentothis.json?limit=$max_limit");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $reddit);
		$reddit = json_decode($reddit, true);
	}
	$reddit = array_slice($reddit["data"], $GLOBALS["page"]*$GLOBALS["limit"], $GLOBALS["limit"]);
	foreach( $reddit["children"] AS $i ) {
		$s = $i["data"]["title"];
		$html = !empty($i["data"]["media"]["oembed"]["thumbnail_url"]) ? '<div class="thumb"><img src="' . $i["data"]["media"]["oembed"]["thumbnail_url"] . '" /></div><div class="desc">' : '<div class="desc2">';
		if( preg_match("/^(.+)\s-{1}\s(.+)/", $s, $matches) ) {
			$title = $matches[0];
			$artist = $matches[1];
			$song = $matches[2];
			$html .= '<h2>' . $song . '</h2> by ' . $artist;
		}
		else
			$html .= '<h2>' . $s . '</h2>';
		$html .= '</div>';
		$items[] = array("name" => $s, "output" => $html, "from" => "reddit");
	}
	return $items;
}
function soundcloud() {
	$items = array();
	$cacheFile = "cache/explore.soundcloud.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$soundcloud = json_decode(file_get_contents($cacheFile), true);
	else {
		$soundcloud = file_get_contents("http://api.soundcloud.com/tracks.json?client_id=c6dc5b166e3d58345cc4751665f9ce08&order=hotness");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $soundcloud);
		$soundcloud = json_decode($soundcloud, true);
	}
	$soundcloud = array_slice($soundcloud, $GLOBALS["page"]*$GLOBALS["limit"], $GLOBALS["limit"]);
	foreach( $soundcloud AS $i ) {
		$matches = ""; $o = "";
		$image = str_replace("large.jpg", "t300x300.jpg", $i["user"]["avatar_url"]);
		$s = $i["title"];
		if( preg_match("/^(.+)\s-{1}\s(.+)/", $s, $matches) ) {
			$title = $matches[0];
			$artist = $matches[1];
			$song = $matches[2];
			$o .= '<h2>' . $song . '</h2> by ' . $artist;
		}
		else
			$o .= '<h2>' . $s . '</h2>';
		$html = '<div class="thumb"><img src="' . $image . '" /></div><div class="desc">' . $o . '</div>';
		$items[] = array("name" => $s, "output" => $html, "from" => "soundcloud");
	}
	return $items;
}

$items = array();

// $items = array_merge($items, lastfm());
$items = array_merge($items, reddit());
$items = array_merge($items, soundcloud());

header('Content-type: application/json');
echo json_encode($items);

?>
