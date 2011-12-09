<?php
error_reporting(E_ALL ^ E_NOTICE);
define("MAXLIMIT", 100);
define("LIMIT", 10);

/**
* Works on URLs like:
* http://www.youtube.com/watch?v=0bt9xBuGWgw
* http://youtu.be/0bt9xBuGWgw
*
* outputs just the video id
**/
// source: http://forrst.com/posts/Simple_Youtube_video_ID_parser-Ykw
function YTvid($videourl) {
    $longurl = preg_match("#(?<=v=)[a-zA-Z0-9-]+(?=&)|(?<=[0-9]\/)[^&\n]+|(?<=v=)[^&\n]+#", $videourl, $ytid );

    if( !$longurl ) {
        $ytpath = parse_url($videourl);
        if( $ytpath['host'] == 'youtu.be' )
            $ytid = ltrim( $ytpath['path'],'/');
    }
    return $longurl ? $ytid[0] : $ytid;
}

interface Service {	
	/**
	 * @return Array
	 */
	public function getItems($start, $length);
}

class Services implements Service {
	protected static $services = array();
	
	public function getServices() {
		return Services::$services;
	}
	public function addService($arr) {
		Services::$services = array_merge(Services::$services, $arr);
	}
	public function getSortingMethods(){
		
	}
	public function getItems($start, $length) {
		
	}
}

class Reddit extends Services {
	protected $subreddits = array("listentothis");
	
	public function __construct($page = 0) {
		parent::addService(array("Reddit" => array()));
	}
	public function loadItemFromId($id) {
		
	}
	public function loadItemFromArray($i) {
		$allowed_providers = array("youtube.com", "youtu.be", "soundcloud.com");
		$arr["provider"] = $i["data"]["domain"];
		if( in_array($arr["provider"], $allowed_providers) ) {
			$arr["title"] = $i["data"]["title"];
			$arr["service"] = "reddit";
			
			$arr["image"] = $i["data"]["media"]["oembed"]["thumbnail_url"];
			if( $arr["image"] != "" )
				$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
			else
				$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
			
			$str = trim(preg_replace("/(\(.*\)|\[.*\])/", "", $i["data"]["title"]));
			preg_match("/(.*) \- (.*)/", $str, $matches);
			
			$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
			$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
			$arr["playable"] = true;
			$arr["uid"] = $i["data"]["id"];
			
			if( $arr["provider"] == "youtube.com" || $arr["provider"] == "youtu.be" )
				$arr["url"] = YTvid($i["data"]["url"]);
			else
				$arr["url"] = $i["data"]["url"];
				
			$arr["info"]["output"] = <<<EOT
			
EOT;
			return $arr;
		}
		else
			return false;
	}
	public function getItems($start = 0, $length = LIMIT) {
		$subreddits = implode("+", $this->subreddits);
		// caching here
		$items = json_decode(file_get_contents("http://reddit.com/r/$subreddits.json?limit=" . MAXLIMIT), true);
		$items = $items["data"]["children"];
		$ret = array();
		// foreach( $items AS $k => $i ) {
		for( $y = $start; $y < $start+$length; $y++ ) {
			$i = $items[$y];
			$r = $this->loadItemFromArray($i);
			if( !empty($r) )
				$ret[] = $r;
		}
		return $ret;
	}
}

class SoundCloud extends Services {
	protected $items = array();
	protected $page;
	protected $method;
	private $clientId = "c6dc5b166e3d58345cc4751665f9ce08";
	private $q = "";
	
	public function __construct($method = "tracks", $q = "") {
		parent::addService(array("SoundCloud" => array()));
		$this->method = $method;
		$this->q = $q;
	}
	public function getName() {
		return "SoundCloud";
	}
	public function getItems($start = 0, $length = LIMIT) {
		$weekago = date("Y-m-d+00:00:00", strtotime("1 week ago"));
		switch( $this->method ) {
			case "tracks":
				$this->items = json_decode(file_get_contents("http://api.soundcloud.com/tracks.json?q={$this->q}&client_id={$this->clientId}&created_at[from]=$weekago"), true);
				break;
			case "users":
				break;
			case "playlists":
				break;
			case "resolve":
				break;
		}
		$ret = array();
		$this->items = array_slice($this->items, $start, $length);
		foreach( $this->items AS $k => $i ) {
			$arr = array();
			$arr["title"] = $i["title"];
			$arr["service"] = "soundcloud";
			$arr["provider"] = "soundcloud.com";
			$arr["image"] = !empty($i["artwork_url"]) ? $i["artwork_url"] : $i["user"]["avatar_url"];
			$arr["image"] = str_replace("large.jpg", "t300x300.jpg", $arr["image"]);
			preg_match("/(.*) \- (.*)/", $i["title"], $matches);
			
			$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
			$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
			$arr["url"] = $i["permalink_url"];
			
			$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
			$ret[] = $arr;
		}
		return $ret;
	}
}

class Beatport extends Services
{
	private $sortingMethods = array();
									
	public function __construct($sortMethod = "most-popular")
	{
		parent::addService(array("Beatport" => $this->sortingMethods));
	}

	public function getSortingMethods()
	{
		return $this->sortingMethods;
	}
	public function getItems($start = 0, $length = LIMIT) 
	{
		$this->items = json_decode(file_get_contents("http://api.beatport.com/catalog/3/most-popular"), true);
		//print_r($this->items);
		
		foreach($this->items["results"] AS $y => $z)
		{
			$arr["title"] = $z["artists"][0]["name"]." - ".$z["title"];
			$arr["provider"] = "beatport.com";
			$arr["service"] = "beatport";
			$arr["image"] = $z["images"]["large"]["url"];
			preg_match("/(.*) \- (.*)/", $arr["title"], $matches);

			$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
			$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
			$arr["url"] = "http://beatport.com/track/".$z["slug"]."/".$z["id"];
			$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
			$ret[] = $arr;
		}
		return $ret;
	}
}

class LastFM extends Services {
	private $method;
	public function __construct($method = "geo.getEvents") {
		parent::addService(array("Last.FM" => array()));
		$this->method = $method;
	}
	public function getItems($start = 0, $length = LIMIT, $params = array()) {
		$url = "";
		$items = array();
		switch( $this->method ) {
			case "album.getBuyLinks":
				$artist = $params["artist"];
				$album = $params["album"];
				$mbid = $params["mbid"];
				$autocorrect= $params["autocorrect"];
				$country = $params["country"];
				if(($artist == null || $album == null) && $mbid == null){
					die("fuuuuu");
				}
				$url = "http://ws.audioscrobbler.com/2.0/?method=album.getBuyLinks&api_key=b25b959554ed76058ac220b7b2e0a026&artist=$artist&album=$album&&format=json";
				
				
				
				break;
			case "album.getInfo":
				
				break;
			case "album.search":
		
				break;
			case "artist.getEvents":
				
				break;
			case "artist.getSimilar":
				
				break;
			case "artist.getTopAlbums":
				
				break;
			case "artist.getTopTracks":
				
				break;
			case "artist.search":
				
				break;
			case "chart.getHypedArtists":
				
				break;
			case "chart.getHypedTracks":
				
				break;
			case "chart.getTopArtists":
				
				break;
			case "chart.getTopTracks":
				
				break;
			case "event.getInfo":
				
				break;
			case "geo.getEvents":
				$lat = $params["latitude"];
				$long = $params["longitude"];
				$location = $params["location"];
				$distance = $params["distance"];
				if( $location != null )
					$url = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&location=$location&api_key=b25b959554ed76058ac220b7b2e0a026&format=json";
				elseif( $lat != null && $long != null )
					$url = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=b25b959554ed76058ac220b7b2e0a026&lat=$lat&long=$long&format=json";
					
				$items = json_decode(file_get_contents($url), true);
				$items = array_slice($items["events"]["event"], $start, $length);
				$ret = array();
				$arr = array();
				foreach( $items AS $k => $v ) {
					$arr["title"] = $v["title"];
					$arr["provider"] = "last.fm";
					$arr["service"] = "lastfm";
					$arr["description"] = $v["description"];
					$arr["url"] = $v["url"];
					$arr["image"] = $v["image"][3]["#text"];
					$arr["artists"] = $v["artists"];
					if( $arr["image"] != "" )
						$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					else
						$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2>' . $description . '</div>';
					$ret[] = $arr;
				}
				break;
			case "track.getBuyLinks":
				
				break;
			case "track.getInfo":
				
				break;
			case "track.getSimilar":
				
				break;
			case "track.search":
				
				break;
		}
		// return $items;
		return $ret;
	}
}



/*
$a = isset($_GET["a"]) ? $_GET["a"] : "";

$R = new Reddit();
$S = new SoundCloud();
$L = new LastFM();
// $L->getItems(0, 10, array("location" => "United+States"));
// $R->getItems();


/*
new Reddit();
new SoundCloud();
new Beatport();
$S = new Services();
if( $a == "getFilters" ) 
	echo json_encode($S->getServices());
*/

// beatport
// lastfm
// 8tracks
// jamendo

?>
