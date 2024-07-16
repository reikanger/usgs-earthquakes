// set URL for USGS earthquake data feed in GeoJSON format
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// request data from URL and execute callback function once loaded
d3.json(url).then(function (data) {
	// print to console for debugging - confirmed GeoJSON format
	console.log(data);
	console.log(data.features);

	// Base Maps Layers:
	//
	// create base map layer
	let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

	// create topographic view layer
	let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});

	// Function to set marker style:
	function setMarkerStyle(magnitude) {
		return False;
	};

	// Create a baseMaps object to store the two map layers with friendly names
	let baseMaps = {
		"Street Map": street,
		"Topographic Map": topo
	};

	// Process earthquake data:
	//
	// array to hold GeoJSON layers for Leaflet for each earthquake
	let features_array = [];

	// loop data object for 'data.features' content
	for (let i = 0; i < data.features.length; i++) {
		// create a new Leaflet geoJSON layer, and attach a popup with more info
		feature = L.geoJSON(data.features[i]).bindPopup(`<h1>${data.features[i].properties.place}</h1><h3>Magnitude ${data.features[i].properties.mag}</h3>`);

		// add new layer to features_array
		features_array.push(feature);
	};

	// create a layer group for the earthquake markers
	let features_group = L.layerGroup(features_array);

	// Overlay map:
	//
	// create an object to hold the earthquake layer group for toggle on/off
	let overlayMaps = {
		Earthquakes: features_group
	};

	// Create Leaflet map:
	//
	// add leaflet map to 'map' div in index.html
	let myMap = L.map("map", {
		center: [
			40.00, -115.00
		],
		zoom: 6,
		layers: [street, features_group]
	});

	L.control.layers(baseMaps, overlayMaps, {
		collapsed: false
	}).addTo(myMap);
});
