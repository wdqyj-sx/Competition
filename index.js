let map;
let url = "http://localhost:8090/iserver/services/map-sxx/rest/maps/City@EmergDS";
// let url = "http://localhost:8090/iserver/services/map-sx/rest/maps/City%40EmergDS";
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
query();
//附近医院查询
function query() {
    let param = new SuperMap.QueryBySQLParameters({
        queryParams: [{
            name: "Hospital@EmergDS",
            attributeFilter: "1 = 1"
        }]
    })
    L.supermap
        .queryService(url)
        .queryBySQL(param, function(serviceResult) {
            console.log(serviceResult)
        })
}