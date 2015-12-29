var fuckinghardocdedURL = "https://aidskrebs.net/";

var pass = function(){}
var getlast = function(coll){
	return coll[coll.length-1]
}

var find = function(coll, f){
	for(var i = 0; i < coll.length; i++){
		if( f(coll[i])) return coll[i]
	}
	return false;
}

var sharedbefore = function (){
		$("body").css('overflow', 'hidden')
		classie.addClass( aidskrebs.Gallery, 'blurry' );
}

var sharedafter = function (){
		$("body").css('overflow', 'scroll')
		classie.removeClass( aidskrebs.Gallery, 'blurry' );
		history.pushState({}, 'A I D S K R E B S', '/');
}




aidskrebs = {
	Gallery: null,
	Masonry: null,
	Images: [],
	Specific: function(){
		if (urlObject().parameters["img"] != undefined){
			var targetid = urlObject().parameters["img"]
			$.ajax({
				type: 'GET',
				url: fuckinghardocdedURL + '/api/' + targetid + '/1',
				dataType: 'json',
				timeout: 2000,
				context: $('body'),
				success: function(data){
					var item = data.images[0]
					if(item.img.endsWith(".webm")){
						var videoviewer = new akvideoviewer($(".container"))
						videoviewer.before = sharedbefore
						videoviewer.after = sharedafter
						videoviewer.open("images/"+item.img)
					} else {
						var viewer = new akviewer($(".container"))
						viewer.before = sharedbefore
						viewer.after = sharedafter
						viewer.open("images/"+item.img)
					}
				}
			})
		}
	},
	Prefetch: function(elem){
		aidskrebs.Gallery = $(elem)[0]
		$.ajaxSettings.crossDomain = true
		$.ajax({
			type: 'GET',
			url: fuckinghardocdedURL + '/api/newest/100',
			dataType: 'json',
			timeout: 2000,
			context: $('body'),
			success: function(data){
				aidskrebs.Images = data.images;
				for(var i = 0; i < data.images.length; i++){
					src = fuckinghardocdedURL + "images/"+data.images[i].thumb
					var info = ''
					info += '<span>'+data.images[i].channel+'</span>'
					info += '<span>'+data.images[i].user+'</span>'
					info += '<span>'+aidsdate(data.images[i].date)+'</span>'
					$("#grid").append('<li class="shown"><a class="imglink" id=elem'+data.images[i].id+' href="#"><img src="'+src+'"><p>'+info+'</p></a></li>');
					clicker("#elem"+data.images[i].id,data.images[i])
				}
				imagesLoaded(aidskrebs.Gallery, function(){
					classie.add( aidskrebs.Gallery, 'loaded' );
					aidskrebs.Masonry = new Masonry( aidskrebs.Gallery, {
					itemSelector : 'li',
					isFitWidth : true,
					transitionDuration : 0
					} );
					aidskrebs.Masonry.layout();
					aidskrebs.Poller = setInterval(aidskrebs.LazyLoad, 250);
				})
				aidskrebs.Specific();
			}
		})
	},
	LazyLoad: function(){
		var last = getlast($('li'))
		if( elementVisible(last)){
			clearInterval(aidskrebs.Poller)
			window.onscroll = pass
			$.ajaxSettings.crossDomain = true
			$.ajax({
				type: 'GET',
				url: fuckinghardocdedURL + '/api/' + getlast(aidskrebs.Images).id + '/20',
				dataType: 'json',
				timeout: 2000,
				context: $('body'),
				success: function(data){
					for(var i = 1; i < data.images.length; i++){
						aidskrebs.Images.push(data.images[i])
						src = fuckinghardocdedURL + "images/"+data.images[i].thumb
						var info = ''
						info += '<span>'+data.images[i].channel+'</span>'
						info += '<span>'+data.images[i].user+'</span>'
						info += '<span>'+aidsdate(data.images[i].date)+'</span>'
						var item = $('<li class="shown"><a class="imglink" id=elem'+data.images[i].id+' href="#"><img src="'+src+'"><p>'+info+'</p></a></li>')
						$("#grid").append(item);
						aidskrebs.Masonry.appended(item);
						clicker("#elem"+data.images[i].id,data.images[i]);
					}
					imagesLoaded(aidskrebs.Gallery, function(){
						aidskrebs.Masonry.layout()
						aidskrebs.Poller = setInterval(aidskrebs.LazyLoad, 330);
					})

				}
			})
		}
	}
}

function clicker(elemid, i){
	$(elemid).on('click', function(id) {
		if(i.img.endsWith(".webm")){
			var videoviewer = new akvideoviewer($(".container"))
			videoviewer.before = function(){
				sharedbefore()
				history.pushState({}, 'A I D S K R E B S', fuckinghardocdedURL + '/?img='+i.id);
			}
			videoviewer.after = sharedafter
			videoviewer.open(fuckinghardocdedURL + "images/"+i.img)
		} else {
			var viewer = new akviewer($(".container"))
			viewer.before = function(){
				sharedbefore()
				history.pushState({}, 'A I D S K R E B S', fuckinghardocdedURL + '/?img='+i.id);
			}
			viewer.after = sharedafter
			viewer.open(fuckinghardocdedURL = "images/"+i.img)
		}
		return false
	})
}

function elementVisible(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }
  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

function abs(i){
	if( i < 0){
		return i * -1
	} else {
		return i
	}
}

function aidsdate(unixtime) {
	// multiplied by 1000 so that the argument is in milliseconds, not seconds
	var date = new Date(unixtime*1000);
	var hours = date.getHours();
	if (hours < 10) hours = '0' + hours;
	var minutes = date.getMinutes();
	if (minutes <10) minutes = '0' + minutes;
	var day = date.getDate();
	if (date.getDate() < 10) day = '0' + day;
	var month = (date.getMonth() + 1)
	if (date.getMonth() + 1 < 10) month = '0' + month;
	var year = date.getFullYear();
	return year + "-" + month + "-"+ day + ' ' + hours + ':' + minutes;
}

function urlObject(options) {
    "use strict";
    /*global window, document*/

    var url_search_arr,
        option_key,
        i,
        urlObj,
        get_param,
        key,
        val,
        url_query,
        url_get_params = {},
        a = document.createElement('a'),
        default_options = {
            'url': window.location.href,
            'unescape': true,
            'convert_num': true
        };

    if (typeof options !== "object") {
        options = default_options;
    } else {
        for (option_key in default_options) {
            if (default_options.hasOwnProperty(option_key)) {
                if (options[option_key] === undefined) {
                    options[option_key] = default_options[option_key];
                }
            }
        }
    }

    a.href = options.url;
    url_query = a.search.substring(1);
    url_search_arr = url_query.split('&');

    if (url_search_arr[0].length > 1) {
        for (i = 0; i < url_search_arr.length; i += 1) {
            get_param = url_search_arr[i].split("=");

            if (options.unescape) {
                key = decodeURI(get_param[0]);
                val = decodeURI(get_param[1]);
            } else {
                key = get_param[0];
                val = get_param[1];
            }

            if (options.convert_num) {
                if (val.match(/^\d+$/)) {
                    val = parseInt(val, 10);
                } else if (val.match(/^\d+\.\d+$/)) {
                    val = parseFloat(val);
                }
            }

            if (url_get_params[key] === undefined) {
                url_get_params[key] = val;
            } else if (typeof url_get_params[key] === "string") {
                url_get_params[key] = [url_get_params[key], val];
            } else {
                url_get_params[key].push(val);
            }

            get_param = [];
        }
    }

    urlObj = {
        protocol: a.protocol,
        hostname: a.hostname,
        host: a.host,
        port: a.port,
        hash: a.hash.substr(1),
        pathname: a.pathname,
        search: a.search,
        parameters: url_get_params
    };

    return urlObj;
}
