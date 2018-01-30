// Global Variables
var map

var ViewModel = function(){
    var self = this;

    // Create a new blank array for all the listing markers.
    var markers = [];
    
    this.initMap() = function() {
        var mapCanvas = document.getElementById('map');
        var mapOptions = {
            center: new google.maps.LatLng(20.591676, -100.380815),
            zoom: 13,
            styles: styles
        };
        map = new google.maps.Map(mapCanvas, mapOptions);
    };
    this.initMap();
};

googleError = function googleError() {
    alert('Google Maps did not load, please refresh the page');
};

function startApp() {
    ko.applyBindings(new ViewModel());
}