// Initialize the map
const map = L.map('map').setView([37.5, -98.5], 4); // Center in the U.S. with initial zoom level 4

// Add base tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// URL to the earthquake data (last 7 days)
const earthquakeUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch earthquake data and plot it on the map
fetch(earthquakeUrl)
    .then(response => response.json())
    .then(data => {
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                const magnitude = feature.properties.mag;
                const depth = feature.geometry.coordinates[2];
                
                // Define marker size based on magnitude
                const radius = magnitude * 4;

                // Define color based on depth
                const color = depth > 90 ? "#ea2c2c" :
                              depth > 70 ? "#ea822c" :
                              depth > 50 ? "#ee9c00" :
                              depth > 30 ? "#eecc00" :
                              depth > 10 ? "#d4ee00" :
                                           "#98ee00";

                return L.circleMarker(latlng, {
                    radius: radius,
                    fillColor: color,
                    color: "#000",
                    weight: 0.5,
                    opacity: 1,
                    fillOpacity: 0.7
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.place}</h3>
                                <p>Magnitude: ${feature.properties.mag}</p>
                                <p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(map);
    });

// Add legend
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    const depthRanges = [-10, 10, 30, 50, 70, 90];
    const colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

    // Loop through intervals and generate a label with a color square for each interval
    for (let i = 0; i < depthRanges.length; i++) {
        div.innerHTML += `<i style="background:${colors[i]}"></i> 
                          ${depthRanges[i]}${depthRanges[i + 1] ? `&ndash;${depthRanges[i + 1]}` : '+'}<br>`;
    }

    return div;
};

legend.addTo(map);
