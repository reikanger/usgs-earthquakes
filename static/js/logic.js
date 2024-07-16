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
	function getMarkerStyle(magnitude, depth) {
		console.log(`Mag: ${magnitude} - Depth: ${depth}`);
		let radius = magnitude * 2; // size scaling factor
		let color = depth > 75 ? '#d93025' :
								depth > 50 ? '#f2994a' :
								depth > 25 ? '#f2c94c' :
								'#27ae60';
		return {
			radius: radius,
			fillColor: color,
			color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
		};
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
		// set marker style
		let magnitude = data.features[i].properties.mag;
		let depth = data.features[i].geometry.coordinates[2];
		let markerStyle = getMarkerStyle(magnitude, depth);

		// create a new Leaflet geoJSON layer, and attach a popup with more info
		//feature = L.geoJSON(data.features[i]).bindPopup(`<h1>${data.features[i].properties.place}</h1><h3>Magnitude ${data.features[i].properties.mag}</h3>`);
		let lon = data.features[i].geometry.coordinates[0];
		let lat = data.features[i].geometry.coordinates[1];
		let feature = L.circleMarker(
			[lat, lon],
			markerStyle
		)
		.bindPopup(`<h1>${data.features[i].properties.place}</h1><h3>Magnitude ${magnitude}</h3><h3>Depth ${depth}</h3>`);

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
