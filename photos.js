/*global jQuery*/

var setupPhotos = (function ($) {
    function each (items, callback) {
        var i;
        for (i = 0; i < items.length; i += 1) {
            setTimeout(callback.bind(this, items[i]), 0);
        }
    }

    function flatten (items) {
        return items.reduce(function (a, b) {
            return a.concat(b);
        });
    }

    function loadPhotosByTag (tag, max, callback) {
        var photos = [];
        var callback_name = 'callback_' + Math.floor(Math.random() * 100000);
        window[callback_name] = function (data) {
            delete window[callback_name];
            var i;
            for (i = 0; i < max; i += 1) {
                photos.push(data.items[i].media.m);
            }
            callback(null, photos);
        };

        $.ajax({
            url: 'http://api.flickr.com/services/feeds/photos_public.gne',
            data: {
                tags: tag,
                lang: 'en-us',
                format: 'json',
                jsoncallback: callback_name
            },
            dataType: 'jsonp'
        });
    }
    function loadAllPhotos (tags, max, callback) {
        var results = [];
        function handleResult (err, photos) {
            if (err) {
                return callback(err);
            }

            results.push(photos);
            if (results.length === tags.length) {
                callback(null, flatten(results));
            }
        }

        each(tags, function (tag) {
            loadPhotosByTag(tag, max, handleResult);
        });
    }

    function renderPhoto (photo) {
        var img = new Image();
        srcAttr = photo.split("/");
        id = srcAttr[4].replace("_m.jpg","");
        img.src = photo;
        var favIcon = document.createElement("div");
        favIcon.className = "icon-heart-empty favIcon";
        length = session.length;
        for(var i=0; i< length; i++){
            if(session[i]==id){
                favIcon.className = "icon-heart favIcon";
            }
        }
        var wrapperSpan = document.createElement("span");
        wrapperSpan.className = "icon-wrapper";
        wrapperSpan.appendChild(favIcon);
        var elm = document.createElement('div');
        elm.className = 'photo';
        elm.id= "photo-"+id
        elm.appendChild(wrapperSpan);
        elm.appendChild(img);
        return elm;
    }

    function imageAppender (id) {
        var holder = document.getElementById(id);
        return function (img) {
            holder.appendChild(img);
        };
    }
 
    function getSessionPhotos()
    {
        $.ajax({
            dataType:'json',
            url:"http://localhost/flickr-photos/getSessionVars.php",
            success:function(response){
                session = response.session;
            },
            error:function(response){
                console.log("Ajax failed");
            }
        });
    }

    // ----------------
    var max_per_tag = 4;
    var session;
    return function setup (tags, callback) {
        getSessionPhotos();
        loadAllPhotos(tags, max_per_tag, function (err, items) {
            if (err) {
                return callback(err);
            }
            each(items.map(renderPhoto), imageAppender('photos'));
            callback();
        });
    };
}(jQuery));
