<?php

define("MAXLIMIT", 50);
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
	// sorting methods
	/**
	 * @return Array of sorting methods.
	 */
	public function getSortingMethods();
	
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
/*
class ServiceRoutine extends Services {
	public function getServices() {
		return parent::getServices();
	}
	public function getItems($start, $length) {
	}
}
*/
/**
 * Please ensure arrays are returned in following format:
 * title: string,
 * output: string,
 * service: string
 */

class Reddit extends Services {
	protected $subreddits = array("listentothis");
	private $sortingMethods = array(
								"hot" => array("type" => "checkbox"), 
								"new" => array("type" => "checkbox"), 
								"controversial" => array("type" => "checkbox"), 
								"top" => array("type" => "checkbox"),
								"subreddits" => array("type" => "select", "options" => array("listentothis", "music"))
							  );
	protected $items = array();
	private $sortMethod;
	
	public function __construct($sortMethod = "hot", $page = 0) {
		if( !array_key_exists($sortMethod, $this->sortingMethods) )
			die("Sorting method not available.");
		parent::addService(array("Reddit" => $this->sortingMethods));
		$this->sortMethod = $sortMethod;
	}
	public function addSubReddit($subReddit) {
		$this->subreddits[] = $subReddit;
	}
	public function getSortingMethods() {
		return $this->sortingMethods;
	}
	public function getItems($start = 0, $length = LIMIT) {
		foreach( $this->subreddits AS $i ) {
			$nest = json_decode(file_get_contents("http://reddit.com/r/$i/" . $this->sortMethod . ".json?limit=" . MAXLIMIT), true);
			$this->items[$i] = $nest["data"]["children"];
		}
		
		// TODO: caching
		
		$ret = array();
		foreach( $this->items AS $k => $v ) {
			$nest = array_slice($v, $start, $length);
			foreach( $nest AS $j => $i ) {
				$arr = array();
				$arr["title"] = $i["data"]["title"];
				$arr["provider"] = $i["data"]["domain"];
				
				// if( $arr["provider"] == "self.Music" ) break;
				
				$arr["image"] = $i["data"]["media"]["oembed"]["thumbnail_url"];
				if( $arr["image"] != "" )
					$arr["output"] = '<div class="thumb"><img src="' . $arr["image"] . '" /></div><div class="desc"><h2>' . $arr["title"] . '</h2></div>';
				else
					$arr["output"] = '<div class="desc2"><h2>' . $arr["title"] . '</h2></div>';
				
				$str = trim(preg_replace("/(\(.*\)|\[.*\])/", "", $i["data"]["title"]));
				preg_match("/(.*) \- (.*)/", $str, $matches);
				
				$arr["artist"] = !empty($matches[1]) ? $matches[1] : "";
				$arr["song"] = !empty($matches[2]) ? $matches[2] : "";
				
				if( $arr["provider"] == "youtube.com" || $arr["provider"] == "youtu.be" )
					$arr["url"] = YTvid($i["data"]["url"]);
				else
					$arr["url"] = $i["data"]["url"];
				$ret[] = $arr;
			}
		}
		return $ret;
	}
}

class SoundCloud extends Services {
	private $sortingMethods = array(
								"created_at" => array("type" => "checkbox"), 
								"hotness" => array("type" => "checkbox")
							  );
	protected $items = array();
	protected $page;
	protected $method;
	private $clientId = "c6dc5b166e3d58345cc4751665f9ce08";
	
	public function __construct($method = "tracks", $sortMethod = "hotness", $q = "") {
		parent::addService(array("SoundCloud" => $this->sortingMethods));
		$this->method = $method;
	}
	public function getName() {
		return "SoundCloud";
	}
	public function getSortingMethods() {
		return $this->sortingMethods;
	}
	public function getItems($start = 0, $length = LIMIT) {
		switch( $this->method ) {
			case "tracks":
				$this->items = json_decode(file_get_contents("http://api.soundcloud.com/tracks.json?q=$q&order=$sortMethod&client_id=$clientId"), true);
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

$a = isset($_GET["a"]) ? $_GET["a"] : "";

new Reddit();
new SoundCloud();
$S = new Services();
if( $a == "getFilters" ) 
	echo json_encode($S->getServices());


// beatport
// lastfm
// 8tracks
// jamendo

?>
