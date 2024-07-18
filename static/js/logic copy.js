// initializing the map
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// create a function for conditional marker size later
function markerSize(magnitude) {
    magnitude * 10
}

function createFeatures(earthquake) {

    function quakeMarker(feature, coords) {
        let options = {
            radius: feature.properties.mag *10,
            opacity: .75,
            color: feature.geometry.coordinates
        }
        return L.circleMarker(coords, options);
    }

    function popups(feature, layer) {
        layer.bindPopup(
            `<h3> Location: ${feature.properties.place}</h3>
            <br><h2> Magnitude: ${feature.properties.mag} </h2>
            <br><h2> for more info: ${feature.properties.url}`
        )
    }



    let earthquakes = L.geoJSON(earthquake, {
        onEachFeature: popups,
        pointToLayer: quakeMarker
      });

      createMap(earthquakes);
}

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(data => {
    createFeatures(data.features);
});
//     let quakeLocation = []

//     // console.log(earthquakes)

//     for (let i = 0; i < 100; i++) {
//         let quake = earthquakes[i].geometry.coordinates
//         quakeLocation.push(quake);
//         L.marker([quake[1], quake[0]]).addTo(myMap);
//         // quakeLocation.push(L.circle([quake[1], quake[0]]), {
//         //     fillOpacity: 0.75,
//         //     color: "red",
//         //     radius: markerSize(earthquakes[i].properties.mag)
//         // });
//     }
// // features.properties.mag
//     console.log(earthquakes[3].properties.mag)
// });

var legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(map);