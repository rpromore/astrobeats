<?php				

/**
 * Implode an array with the key and value pair giving
 * a glue, a separator between pairs and the array
 * to implode.
 * @param string $glue The glue between key and value
 * @param string $separator Separator between pairs
 * @param array $array The array to implode
 * @return string The imploded array
 */
function array_implode( $glue, $separator, $array ) {
    if ( !is_array( $array ) ) return $array;
    $string = array();
    foreach ( $array as $key => $val ) {
        if ( is_array( $val ) )
            $val = implode( ',', $val );
        $string[] = "{$key}{$glue}{$val}";
        
    }
    return implode( $separator, $string );
    
}

// [name].[format]?limit=[maxlimit]&genres=[{genres}]&
// lastfm.json?limit=25&genres=

abstract class Aggregators {
	protected $name;
	/**
	 * Build the feed path to fetch from.
	 * @return feed path
	 */
	abstract protected function feedPath();
	/**
	 * Fetch items.
	 * @return json-encoded items
	 */
	abstract public function fetchItems();
}

class LastFM extends Aggregators {
	protected $name = "LastFM";
	protected $api = "b25b959554ed76058ac220b7b2e0a026";
	protected $method = "";
	protected $params = array();
	public function LastFM($method = "chart.gethypedtracks", $params = array()) {
		$this->method = $method;
		$this->params = $params;
	}
	protected function feedPath() {
		return "http://ws.audioscrobbler.com/2.0/?method=" . $this->method . "&api_key=" . $this->api . "&format=json" . "&" . array_implode('=', '&', $this->params);
	}
	public function fetchItems() {
		$url = $this->feedPath();
		$o = json_decode(file_get_contents($url));
		return $o;
	}
}

$lastfm = new LastFM("chart.gethypedtracks", array("genre" => "rock"));
header('Content-type: application/json');
echo json_encode($lastfm->fetchItems());
/*
function lastfm() {
	$items = array();
	$cacheFile = "cache/lastfm.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$lastfm = json_decode(file_get_contents($cacheFile));
	else {
		$lastfm = file_get_contents("http://ws.audioscrobbler.com/2.0/?method=chart.gethypedtracks&api_key=b25b959554ed76058ac220b7b2e0a026&format=json");
		$f = fopen($cacheFile, "w+");
		fwrite($f, $lastfm);
		$lastfm = json_decode($lastfm);
	}
	foreach( $lastfm->tracks->track AS $i )
		$items[] = array("name" => $i->name, "image" => !empty($i->image) ? $i->image[3]->{'#text'} : "", "from" => "lastfm", "artist" => $i->artist->name);
	return $items;
}
function reddit() {
	$items = array();
	$cacheFile = "cache/reddit.json";
	$cacheTime = 120*60;
	if( file_exists($cacheFile) && (time() - $cacheTime < filemtime($cacheFile)) )
		$reddit = json_decode(file_get_contents($cacheFile));
	else {
		$reddit = file_get_contents("http://reddit.com/r/listentothis.json");
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
$items = array_merge($items, reddit());
$items = array_merge($items, soundcloud());

header('Content-type: application/json');
echo json_encode($items);
*/
?>