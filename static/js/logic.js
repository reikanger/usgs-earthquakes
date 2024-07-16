// set URL for USGS earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// request data from URL
d3.json(url).then(function (data) {
	// print to console for debugging
	console.log(data);
	console.log(data.features);

	// create base layer
	let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});

	let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});

	// Create a baseMaps object
	let baseMaps = {
		"Street Map": street,
		"Topographic Map": topo
	};

	// loop data object for 'data.features' content
	let features_array = [];
	for (let i = 0; i < data.features.length; i++) {
		feature = L.geoJSON(data.features[i]).bindPopup(`<h1>${data.features[i].properties.place}</h1><h3>Magnitude ${data.features[i].properties.mag}</h3>`);
		features_array.push(feature);
	};

	let features_group = L.layerGroup(features_array);

	// set Earthquakes feature to map
	let overlayMaps = {
		Earthquakes: features_group
	};

	// add leaflet map to map div
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
