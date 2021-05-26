///////////////////////////////////////////////
// 블로그 주소에서 아래 두개 아이디 가져와서 수정
///////////////////////////////////////////////
var comming_id = 330; //kazuma 420
var group_id = 38; //kazuma 145


// 로딩 중지 (// 제외 하고 입력) 
// 안 멈추고 무한으로 돈다 싶을 때도 정지 가능 retry...마이너스 값이 되면 중지 시켜야 함
// clearInterval(timerId);

// 중단된 결과까지 html 출력 (// 제외 하고 입력)
// genHtml();

// 중간에 끊어진 경우 재시작 (// 제외 하고 입력)
// (한번에 100개씩 읽어오기 때문에, 보통 total 숫자가 00 으로 끝났을 때 덜 가져왔을 확률이 높음, 서버가 느려서 15초 안에 가져 오지 못하는 경우도 끊어짐)
// run()


/////////////////////
// DO NOT MODIFY
////////////////////
var rows = 100; // 100개씩
var timeout = 5000; //5초
var offset = 0;
var base_url = "https://m.tribe-m.jp/diary/get_list?app_version=1&table_type=1&popup_movie_play_flg=true&sort=DESC&list_type=timeline";
var total = 0;
var posts = [];
var flag = true;
var timerId = 0;

function get_post_url(id) {
	var post_base_url = "https://m.tribe-m.jp/diary/detail?id=" + id + "&table_type=1&comng_id=" + comming_id + "&group_id=" + group_id
	
	return post_base_url;
}

var diary_list;
var request;
function onLoadListener() {
	//console.log(request.status);
	console.log("[loaded] offset=" + offset + ", rows=" + rows + ", total=" + total);
	
	if (request.status != 200) {//request failed
		flag = false;		
		clearInterval(timerId);
	}
	
	if (request.responseText.length == 0) {
		console.log("done");
		clearInterval(timerId);
	}
	
	obj = JSON.parse(request.responseText);
	diary_list = obj.diary_list;
	total += diary_list.length;

	if (request.responseText.length > 0)
	{
		offset = total;
	}

	for (var i = 0 ; i < diary_list.length; i++ ) {
		posts.push({"title": diary_list[i].title, "time": diary_list[i].open_time, "id": diary_list[i].id, "body": diary_list[i].body});
	}
	
	flag = true;
}

function get_posts() {
	var args = "group_id=" + group_id + "&comng_id=" + comming_id + "&rows=" + rows + "&offset=" + offset;
	flag = false;
	
	request =  new XMLHttpRequest();
	request.open('GET', base_url+args);

	request.addEventListener("load", onLoadListener);
	request.send();
}

function run() {
	console.log("Please Wait, Loading...");
	retry = 3;
	timerId = setInterval(() => {
		if (retry == 0) {
			clearInterval(timerId);
			console.log("done !!!");
		}
		
		if (flag) {
			retry = 3;
			get_posts();
		} else {
			console.log("retry..." + retry);
			retry--;
		}
	}, timeout);
}
