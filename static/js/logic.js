// create a function for conditional marker size based on magnitude
function markerSize(mag) {
    if (mag === 0) {
        return 1;
    }
    return mag * 5000;
}

// Create function for marker color based on depth
    // colors were chosen based on a randomly generated gradient palettte
function markerColor(depth) {
    if (depth > 90 ) return "#5C0201";
    else if (depth > 70 ) return "#BF1304";
    else if (depth > 50 ) return "#F28705";
    else if (depth > 30 ) return "#F2BE22";
    else if (depth > 10) return "#FEEB2D";
    else return "#EAFF00";
}

// function that styles the markers using the conditionals above
function markerStyle(feature, coords) {
    let marker = {
        radius: markerSize(feature.properties.mag),
        opacity: .8,
        color: markerColor(feature.geometry.coordinates[2]),
        stroke: false,
        fill: true,
        fill_opacity:0.6,
    }
    return L.circle(coords, marker)
}

// function that creates popups w information about each quake
function popups(feature, layer) {
    layer.bindPopup(
        `<h1 style='text-align: center'> Location: ${feature.properties.place}</h1>
        <br><h2> Magnitude: ${feature.properties.mag} </h2>
        <br><h2> Depth: ${feature.geometry.coordinates[2]} </h2>
        <br><h2> for more info: 
        <br><a href="url">${feature.properties.detail} </a>`
    )
}

// Putting all the functions together to convert geojson data for the map
function createFeatures(quakeData) {
    let quakes = L.geoJSON(quakeData, {
        onEachFeature: popups,
        pointToLayer: markerStyle
    });
    // using the create map function defined below
    quakeMap(quakes)
}

// Map Function
function quakeMap(quake) {

    // initializing the map
    let background = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [background, quake]
    });

    // creating the legend
    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend"),
        depth = [10, 30, 50, 70, 90];
  
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
        // for this to work I had to add .circle to the style.css file
        for (i = 0; i < depth.length; i++) {
            div.innerHTML += '<i class="circle" style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
      
    };
    legend.addTo(myMap)

}


// finally putting it all together after calling the api

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// using the json data
d3.json(url).then(data => {
    let features = data.features
    createFeatures(features)
});