// set URL for USGS earthquake data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// request data from URL
d3.json(url).then(function (data) {
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

	// add leaflet map to map div
	let myMap = L.map("map", {
		layers: [street]
	});

	L.control.layers(baseMaps, {
		collapsed: false
	}).addTo(myMap);
});
