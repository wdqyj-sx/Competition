var map, url = "http://localhost:8090/iserver/services/map-sxx/rest/maps/City@EmergDS";
map = L.map('map', {
    center: [30.61, -1500016.3],
    maxZoom: 18,
    zoom: 16
});
L.supermap.tiledMapLayer(url).addTo(map);