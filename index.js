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
    zoom: 4,
    crs: mainCRS
});
let flag = true;
L.supermap.tiledMapLayer(url).addTo(map);

function Fullwidth() {
    map.setZoom(2, {})
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
            //console.log(serviceResult)
            // console.log(serviceResult.result.recordsets[0].features.features)
            let text = serviceResult.result.recordsets[0].features.features
            console.log(text)
            let data = [11542678.4805783, 3582697.888648468, 30]
            text.forEach(item => {
                let lat = item.geometry.coordinates[0]
                let lng = item.geometry.coordinates[1]
                    //console.log(lat, lng)
                    //console.log()
                let pos = mainCRS.unproject(L.point(lat, lng));
                let loc = [pos.lat, pos.lng, 30];
                data.push({
                    name: item.properties.Name,
                    value: loc
                })



            });
            console.log(data)
            data1 = {
                name: '市第一人民医院',
                value: [11542678.4805783, 3582697.888648468, 30]
            }
            option = {
                title: {
                    text: "s",
                    subtext: 'data from PM25.in',
                    sublink: 'http://www.pm25.in',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    y: 'bottom',
                    x: 'right',
                    data: ['pm2.5'],
                    textStyle: {
                        color: '#666'
                    }
                },
                series: [

                    {
                        name: 'pm2.5',
                        type: 'scatter',
                        coordinateSystem: 'leaflet',
                        data: data,
                        symbolSize: function(val) {
                            console.log(val)
                            return val[2];
                        },
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#ddb926'
                            }
                        }
                    }
                ]
            };
            L.supermap.echartsLayer(option).addTo(map);
            // serviceResult.result.recordsets[0].features.features.map(item => {
            //     let lat = item.geometry.coordinates[0]
            //     let lng = item.geometry.coordinates[1]

        })
}
//医院点击事件
$("#ldcxclick").click(function() {
    $("#hos-pan").toggle(1000)
})