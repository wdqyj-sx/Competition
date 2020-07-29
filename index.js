let map;
let url = "http://localhost:8090/iserver/services/map-sxx/rest/maps/City@EmergDS";
let mainCRS = L.Proj.CRS("EPSG:3857", {
        bounds: L.bounds([11541226.6, 3579087.71], [11546271.45, 3585516.41]),
        origin: [11544275.29, 3582369.97]
    })
    // console.log(mainCRS.unproject(L.point([11544275.29, 3582369.97])))
map = L.map('map', {
    center: { lat: 30.610764925557415, lng: 103.69926184415795 },

    maxZoom: 18,
    zoom: 1,
    crs: mainCRS
});
let flag = true;
L.supermap.tiledMapLayer(url).addTo(map);

function Fullwidth() {
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
            console.log(serviceResult.result.recordsets[0].features.features)
            let text = serviceResult.result.recordsets[0].features.features
            console.log(text)
            text.forEach(item => {
                let lat = item.geometry.coordinates[0]
                let lng = item.geometry.coordinates[1]
                console.log(lat, lng)
                console.log(mainCRS.unproject(L.point(lat, lng)))
                marker = L.marker(mainCRS.unproject(L.point(lat, lng))).addTo(map)

            });
            // serviceResult.result.recordsets[0].features.features.map(item => {
            //     let lat = item.geometry.coordinates[0]
            //     let lng = item.geometry.coordinates[1]

            //     marker = L.marker(mainCRS.unproject(lat, lng))
            // })
        })
}