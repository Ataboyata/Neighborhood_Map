// Global Variables
var map

function ViewModel() {
    var self = this;

    // Create a new blank array for all the listing markers.
    this.markers = [];
    
    this.initMap = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(20.591676, -100.380815),
            zoom: 13,
            styles: styles
        };
        // Creates Map
        map = new google.maps.Map(mapCanvas, mapOptions);

        // Set InfoWindow
        this.largeInfoWindow = new google.maps.InfoWindow();
        for (var i = 0; i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].location.lat;
            this.markerLng = myLocations[i].location.lng;
            // Google Maps marker setup
            this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP
            });
            this.marker.setMap(map);
            this.markers.push(this.marker);
            this.marker.addListener('click', self.populateAndBounceMarker);
        }
    };
    this.initMap();

    this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
            this.setAnimation(null);
        }).bind(this), 1400);
    };
}

googleError = function googleError() {
    alert('Google Maps did not load, please refresh the page');
};

function startApp() {
    ko.applyBindings(new ViewModel());
}