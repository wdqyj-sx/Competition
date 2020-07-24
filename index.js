var map, url = "http://localhost:8090/iserver/services/map-sxx/rest/maps/City@EmergDS";
map = L.map('map', {
    center: [30.61, -1500016.3],
    maxZoom: 18,
    zoom: 16
});
let flag = true;
L.supermap.tiledMapLayer(url).addTo(map);

function Fullwidth() {
    console.log('hah')
    map.setZoom(14, {})

}
//放大
function enlarge() {
    map.zoomIn()

}
//缩小
function narrow() {
    map.zoomOut()
}
//平移
function translation() {
    if (flag) {
        map.dragging.disable()

    } else {
        map.dragging.enable()
    }
    flag = !flag
}
let url1 = 'http://localhost:8090/iserver/services/data-sxx/rest/data'
L.supermap.featureService(url1)
    .getFeaturesBySQL({
        datasetNames: 'Hospital'
    }, function(result) {
        console.log(result)
    })