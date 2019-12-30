/* jshint esversion: 6 */
import Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet.locatecontrol';
import MiniMap from 'leaflet-minimap';
import 'leaflet-routing-machine';
import 'leaflet-sidebar-v2';
import token from './API_Token';

import './LeafletCountrySelect.min';

// Marker
let marker;

// Initializing Map
const streetTileLayer = Leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token.token}`, {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
});

const sateliteTileLayer = Leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token.token}`, {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/satellite-streets-v11',
});

/* eslint-disable */
const map = new Leaflet
  .map('mapid', {
    center: [51.505, -0.09],
    zoom: 13,
    layers: [streetTileLayer, sateliteTileLayer],
  });
/* eslint-enable */

const baseMaps = {
  Satelite: sateliteTileLayer,
  Street: streetTileLayer,
};

Leaflet.control.layers(baseMaps).addTo(map);
/* eslint-enable */
// map.addLayer(tileLayer);

new MiniMap(Leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token.token}`, {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
}), {
  toggleDisplay: true,
  // zoomLevelOffset: -3,
}).addTo(map);

Leaflet.control.locate().addTo(map);

// Handles the click event of map
function onMapClicked(e) {
  if (marker) {
    map.removeLayer(marker);
  }

  // https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=51.990819&lon=4.220295
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
    .then((data) => data.json())
    .then((res) => {
      marker = Leaflet.marker([e.latlng.lat, e.latlng.lng], {
        draggable: true,
      })
        .addTo(map)
        .bindPopup(res.display_name)
        .openPopup();
      marker.on('dragend', (event) => {
        const latlng = event.target.getLatLng();
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`)
          .then((data2) => data2.json())
          .then((res2) => {
            marker.bindPopup(res2.display_name)
              .openPopup();
          });
      });
    });
}

// Adding click event to Map
map.on('click', onMapClicked);

const provider = new OpenStreetMapProvider();

const searchController = new GeoSearchControl({
  provider,
  autoComplete: true,
  autoCompleteDelay: 150,
  showMarker: true,
  showPopup: true,
  autoClose: true,
  maxMarkers: 4,
  searchLabel: 'Enter Address', // It will change placeholder for search input
});

map.addControl(searchController);

function onResultSelected(e) {
  if (marker) {
    map.removeLayer(marker);
  }

  /* eslint-disable */
  marker = Leaflet.marker([e.marker._latlng.lat, e.marker._latlng.lng], {
    draggable: true,
  })
  .addTo(map)
  .bindPopup(e.location.label)
  .openPopup();

  // right now, we want to get lat and lang of the place where we moved the marker, so we are tapping into dragend event of marker
  marker.on('dragend', (e) => console.log(e));
}

map.on('geosearch/showlocation', (e) => {
  console.log(e);
  onResultSelected(e);
});

// We are importing modules again here.
// It will make the app slow as it will increase our js size
// Importing all dependencies at first of the file is a good practice!
// var L = require('leaflet');
// require('leaflet-routing-machine');
Leaflet.Routing.control({
  waypoints: [
    L.latLng(57.74, 11.94),
    L.latLng(57.6792, 11.949)
  ]
}).addTo(map);

Leaflet.control.sidebar({
  autopan: false,       // whether to maintain the centered map point when opening the sidebar
  closeButton: true,    // whether t add a close button to the panes
  container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
  position: 'left',     // left or right
}).addTo(map);          // Added semicolon

// Will initialize the toolbar here
// The leaflet-toolbar and leaflet-draw-toolbar libraries are not maintained so that it can be used with webpack or other new bundlers
// Rather than spending time to add such libraries, we should work on other stuff

// CountrySelect
var select = Leaflet.countrySelect({title: 'Pick the Country'});
select.addTo(map);
select.on('change', function(e){
  if (e.feature === undefined){ //Do nothing on title
    return;
  }
  var country = Leaflet.geoJson(e.feature);
  if (this.previousCountry != null){
    map.removeLayer(this.previousCountry);
  }
  this.previousCountry = country;

  map.addLayer(country);
  map.fitBounds(country.getBounds());
});

setTimeout(() => {
  map.invalidateSize();
}, 100);
