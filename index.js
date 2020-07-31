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
// query();
// //附近医院查询
// function query() {
//     let param = new SuperMap.QueryBySQLParameters({
//         queryParams: [{
//             name: "Hospital@EmergDS",
//             attributeFilter: "1 = 1"
//         }]
//     })
//     L.supermap
//         .queryService(url)
//         .queryBySQL(param, function(serviceResult) {
//             //console.log(serviceResult)
//             // console.log(serviceResult.result.recordsets[0].features.features)
//             let text = serviceResult.result.recordsets[0].features.features
//             console.log(text)
//             let data = [11542678.4805783, 3582697.888648468, 30]
//             text.forEach(item => {
//                 let lat = item.geometry.coordinates[0]
//                 let lng = item.geometry.coordinates[1]
//                     //console.log(lat, lng)
//                     //console.log()
//                 let pos = mainCRS.unproject(L.point(lat, lng));
//                 let loc = [pos.lat, pos.lng, 30];
//                 data.push({
//                     name: item.properties.Name,
//                     value: loc
//                 })



//             });
//             console.log(data)
//             data1 = {
//                 name: '市第一人民医院',
//                 value: [11542678.4805783, 3582697.888648468, 30]
//             }


//         })
// }
//医院点击事件
$("#ldcxclick").click(function() {
    $("#hos-pan").toggle(1000)
})

option = {
    legend: {
        data: ['text1', 'text2'],
        align: 'left'
    },
    toolbox: {
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    tooltip: {},
    xAxis: {
        data: ['1', '2', '3', '4', '5'],
        silent: false,
        splitLine: {
            show: false
        }
    },
    yAxis: {},
    series: [{
        name: 'bar',
        type: 'bar',
        animationDelay: function(idx) {
            return idx * 10;
        }
    }, {
        name: 'bar2',
        type: 'bar',
        animationDelay: function(idx) {
            return idx * 10 + 100;
        }
    }],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function(idx) {
        return idx * 5;
    }


}
var div = L.DomUtil.create('div');
var chart = echarts.init(div, '', {
    width: 500,
    height: 500
});
chart.setOption(option);


function query() {
    //clearLayer();
    let param = new SuperMap.QueryBySQLParameters({
        queryParams: [{
            name: "Hospital@EmergDS",
            attributeFilter: "1 = 1"
        }]
    });
    L.supermap.queryService(url)
        .queryBySQL(param, function(serviceResult) {
            serviceResult.result.recordsets.map(function(records) {
                resultLayer = L.geoJSON(records.features, {
                    coordsToLatLng: function(coords) {
                        console.log(coords)
                        var latlng = L.CRS.EPSG3857.unproject(L.point(coords[0], coords[1]));
                        latlng.alt = coords[2]
                        return latlng;
                    }
                }).bindPopup(function(layer) {
                    console.log(layer)
                    var city = layer.feature.properties.Name;
                    var data1 = [];
                    var data2 = [];
                    for (var i = 0; i < 7; ++i) {
                        var data = Math.random().toFixed(2);
                        data1.push(data);
                        data2.push(data * (Math.random() + 1.5));
                    }
                    chart.setOption({
                        title: {
                            text: city,

                        },
                        series: [{
                            name: 'text1',
                            data: data1
                        }, {
                            name: 'text2',
                            data: data2
                        }]
                    })
                    return chart.getDom();
                }, { maxWidth: 600 }).addTo(map)
            })
        })

}
$("#showHos").click(function() {
    query();
})