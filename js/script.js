// Global Variables
var map

function ViewModel() {
    var self = this;

    self.searchOption = ko.observable("");

    // Create a new blank array for all the listing markers.
    self.markers = [];

    // Populates Info Window with all the locations listed on the
    // markers.js file. 
    self.populateInfoWindow = function(marker, infowindow){   
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker){
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            
            var streetViewService = new google.maps.StreetViewService();
            var radius =100;

            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
                    var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Found</div>');
                }
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

            // Load Wikipedia Articles
            var $wikiElem = $('#wikipedia-links');
            // clear out old data before new request
            $wikiElem.text("");
            // Wikipedias URL API 
            var wikiUrl = 'http://es.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

            $.getJSON(wikiUrl).done(function(marker){
                var response = response[1];
                for (var i = 0; i < articleList.length; i++){
                        articleStr = articleList[i];
                        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                        $wikiElem.append(
                            '<li><a class="wiki-links" href="' + url + '" target="_blank">' + articleStr + '</a></li>');
                    };

            })
            // Stop the Request after a certain time interval    
            var wikiRequestTimeout = setTimeout(function(){
                $wikiElem.text("No Wikipedia Resources for this Location");
            }, 5000);

            $.ajax({
                url: wikiUrl,
                dataType: 'jsonp',
                //jsonp:"callback" by default by setting jsonp the callback would be corrected
                success: function( response ){
                    var articleList = response[1];

                    for (var i = 0; i < articleList.length; i++){
                        articleStr = articleList[i];
                        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                        $wikiElem.append(
                            '<li><a class="wiki-links" href="' + url + '" target="_blank">' + articleStr + '</a></li>');
                    };

                    clearTimeout(wikiRequestTimeout);
                }
            });

            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);

            infowindow.addListener('closeclick', function(){
                infowindow.marker = null;
            });
        };
    };

    //Populates teh map with all the visible markers with an animation
    //effect.
    self.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function(){
            this.setAnimation(null);
        }).bind(this),2500);
    };

    //Initializes Map with the Google Maps API and uses the markers info
    //from the markers.js file to place markers in the map, according to 
    //their latitudes and longitudes
    self.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(20.591676, -100.380815),
            zoom: 13,
            styles: styles
        };
        // Creates Map
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        self.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            self.markerTitle = myLocations[i].title;
            self.markerLat = myLocations[i].location.lat;
            self.markerLng = myLocations[i].location.lng;
            // Google Maps marker setup
            self.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: self.markerLat,
                    lng: self.markerLng
                },
                title: self.markerTitle,
                lat: self.markerLat,
                lng: self.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            self.marker.setMap(map);
            self.markers.push(self.marker);
            self.marker.addListener('click', self.populateAndBounceMarker);
        }
    };
    self.initMap();

    // Function for the search filter that transforms the search to lower 
    // case and then filters out the possible option, so that the results
    // are filtered while the user types by chaing the visible status of the
    // markers. By changin the status of the marker itself, the change is 
    // reflected in both the infowindow and the map. 
    self.myLocationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < self.markers.length; i++) {
            var markerLocation = self.markers[i];
            if (markerLocation.title.toLowerCase().includes(self.searchOption()
                    .toLowerCase())) {
                result.push(markerLocation);
                self.markers[i].setVisible(true);
            } else {
                self.markers[i].setVisible(false);
            }
        }
        return result;
    }, self);
}

// Displays an error message in case the Google Maps API didn't function
// properly
googleError = function googleError() {
    alert('Google Maps did not load, please contact system administrator');
};

// Runs the View Model to start the app
function startApp() {
    ko.applyBindings(new ViewModel());
}