    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');


var ViewModel = function () {
    this.streetStr = ko.observable('');
    this.cityStr = ko.observable('');
    this.requestData = function() {

    // clear out old data before new request
        $wikiElem.text("");
        $nytElem.text("");

        var self = this;

        self.address = self.streetStr() + ', ' + self.cityStr();
        $greeting.text('So, you want to live at ' + self.address + '?');

        var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + self.address + '';
        $body.append('<img class="bgimg" src=" ' + streetviewUrl + ' ">');

        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?[q=' + self.cityStr() + '&fq=glocations:('+ self.cityStr() +')&sort=newest&api-key=06ea61a7ba50a7f7f9d06ae09697e1b7:9:71778273'

        $.getJSON(nytimesUrl, function (data) {

            $nytHeaderElem.text('New York Times Articles About ' + self.cityStr());

            articles = data.response.docs;
            for ( var i = 0; i < articles.length; i++) {
                var article = articles[i];
                $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>' + article.snippet + '</p>'+'</li>');
            };
        }).error(function(e) {
            $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
        });

        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + self.cityStr() + '&format=json&callback=wikiCallback';

        var wikiRequestTimeout = setTimeout(function() {
            $wikiElem.text("Failed to get wikipedia resources");
        }, 8000);

        $.ajax( {
            url: wikiUrl ,
            dataType:"jsonp",
            //jsonp: "callback",
            success: function (response) {
                var articleList = response[1];

                for (var i = 0; i < articleList.length; i++) {
                    articleStr = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                    $wikiElem.append('<li><a href="' + url + '">'+ articleStr + '</a></li>');
                };
                clearTimeout(wikiRequestTimeout);
            }
        } );
    };
    return false;
};

ko.applyBindings(new ViewModel());


