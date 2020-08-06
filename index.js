let map;
let url = "http://localhost:8090/iserver/services/map-sxx/rest/maps/City@EmergDS";
//定义热点
let markers = []
let resultLayer1, resultLayer2;
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
//全幅显示
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

//医院按钮组
$("#ldcxclick").click(function() {
    clearAllLayer()
    query();
    loadPulse();
    $(".chartColor").show()
})

// 毒气扩散按钮组
$("#lddjclick").click(function() {
    clearAllLayer()
    $("#gasArea").show()
})
$("#deadly").click(function() {
    if (!buffer.includes(150)) {
        bufferAnalyst(150)
    }

})
$("#serious").click(function() {
    if (!buffer.includes(400)) {
        bufferAnalyst(400)
    }
    //bufferAnalyst(400)
})
$("#wound").click(function() {
    if (!buffer.includes(800)) {
        bufferAnalyst(800)
    }
    // bufferAnalyst(800)
})
$("#light").click(function() {
        if (!buffer.includes(1500)) {
            bufferAnalyst(1500)
        }
        // bufferAnalyst(1500)
    })
    //最短救援路线
$("#xyljclick").click(function() {
    clearAllLayer()
    findPath()
})

//医院信息图表
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

// 点击显示医院信息图表
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
                resultLayer1 = L.geoJSON(records.features, {
                    coordsToLatLng: function(coords) {
                        var latlng = L.CRS.EPSG3857.unproject(L.point(coords[0], coords[1]));
                        latlng.alt = coords[2]
                        return latlng;
                    }
                }).bindPopup(function(layer) {
                    console.log(layer)
                    let name = layer.feature.properties.Name
                    let latlng = L.CRS.EPSG3857.unproject(L.point(layer.feature.geometry.coordinates[0], layer.feature.geometry.coordinates[1]))
                    return `<span>${name}</span></br><span>${latlng}</span>`
                        // var city = layer.feature.properties.Name;
                        // var data1 = [];
                        // var data2 = [];
                        // for (var i = 0; i < 7; ++i) {
                        //     var data = Math.random().toFixed(2);
                        //     data1.push(data);
                        //     data2.push(data * (Math.random() + 1.5));
                        // }
                        // chart.setOption({
                        //     title: {
                        //         text: city,

                    //     },
                    //     series: [{
                    //         name: 'text1',
                    //         data: data1
                    //     }, {
                    //         name: 'text2',
                    //         data: data2
                    //     }]
                    // })
                    // return chart.getDom();
                }).addTo(map)
            })
        })

}

// 给不同医院赋予不同的颜色
var color = ['#ea66a6', '#1d953f', '#009ad6', '#ffc20e', '#905d1d', '#4e72b8'];
// 热点图
var pulseIcon = [];
for (let i = 0; i < 6; ++i) {
    pulseIcon[i] = L.icon.pulse({
        iconSize: [18, 18],
        color: color[i]
    })
}

function loadPulse() {
    var param = new SuperMap.QueryBySQLParameters({
        queryParams: [{
            name: "Hospital@EmergDS",
            attributeFilter: "1 = 1"
        }]
    });
    L.supermap
        .queryService(url)
        .queryBySQL(param, function(serviceResult) {
            createLayers(serviceResult.result.recordsets[0].features)

        })

}
//设置热点图颜色图表
var myChart = echarts.init(document.getElementById('chartColor'));
var scaleData = [{
        'name': '市第一人民医院',
        'value': 1
    },
    {
        'name': '市骨科康复医院',
        'value': 1
    },
    {
        'name': '市中医院',
        'value': 1
    },
    {
        'name': '仁爱医院',
        'value': 1
    }, {
        'name': '某军区总医院',
        'value': 1
    },
    {
        'name': '城南医院',
        'value': 1
    }

];
var placeHolderStyle = {
    normal: {
        label: {
            show: false
        },
        labelLine: {
            show: false
        },
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0
    }
};
var data = [];
var color = ['#ea66a6', '#1d953f', '#009ad6', '#ffc20e', '#905d1d', '#4e72b8'];
var colorBorder = ['rgba(234,102,166, 0.4)', 'rgba(29,149,63, 0.4)', 'rgba(0,154,214, 0.4)', 'rgba(255,194,14, 0.4)', 'rgba(144,93,29,0.4)', 'rgba(78,114,184,0.4)'];
for (var i = 0; i < scaleData.length; i++) {
    data.push({
        data: scaleData[i].value,
        value: 20,
        name: scaleData[i].name,
        itemStyle: {
            normal: {
                color: color[i],
                borderWidth: 7,
                borderColor: colorBorder[i]
            }
        }
    }, {
        value: 8,
        name: '',
        itemStyle: placeHolderStyle
    });
}

var seriesObj = [{
    name: '',
    type: 'pie',
    clockWise: false,
    radius: [30, 60],
    hoverAnimation: false,


    itemStyle: {
        normal: {
            label: {
                show: false,

            },

        }
    },
    data: data
}, {
    name: '',
    type: 'pie',
    clockWise: false,
    radius: [30, 60],
    hoverAnimation: false,

    itemStyle: {
        normal: {
            label: {
                show: true,
                position: 'outside',
                fontSize: 10,
                formatter: '{b}'

            },
            labelLine: {
                length: 10,
                length2: 30,
                show: true
            }
        }
    },
    data: data
}];
option = {

    tooltip: {
        show: false
    },
    legend: {
        show: false
    },
    toolbox: {
        show: false
    },
    series: seriesObj,
    graphic: [{
        type: 'group',
        left: 'center',
        top: 'middle',
        children: [{
            type: 'text',
            z: 100,
            left: 'center',
            top: '0',
            style: {
                fill: '#333',
                text: [
                    '附近医院'
                ],
                font: '10px Microsoft YaHei'
            }
        }]
    }]
}
myChart.setOption(option);

//将热点图添加到图层上
function createLayers(result) {
    if (!result || !result.features || result.features.length < 1) {
        return;
    }
    markers = []
    result.features.map((feature, index) => {
        var latLng = L.CRS.EPSG3857.unproject(L.point(feature.geometry.coordinates));
        markers.push(L.marker(latLng, { icon: pulseIcon[index] }));

    });
    resultLayer2 = L.featureGroup(markers).addTo(map);
}

//清除图层
function clearLayer(lay) {
    if (lay) {
        lay.removeFrom(map)
    }
}
// 清除所有图层
function clearAllLayer() {
    clearLayer(resultLayer1)
    clearLayer(resultLayer2)
    pathPoints.forEach(item => {
        clearLayer(item)
    })
    facPoints.forEach(item => {
        clearLayer(item)
    })
    bufferAnswer.forEach(item => {
        clearLayer(item)
    })
    clearLayer(polyline)
    $(".chartColor").hide()
    $(".lddjclick").hide()
    $("#gasArea").hide()
}
// 最佳路径分析
var serviceUrl = "http://localhost:8090/iserver/services/transportationAnalyst-sxx/rest/networkanalyst/EmergDS_Network@EmergDS"


let pathPoints = []
let facPoints = []
let linePoint = []
let polyline;

function findPathProcess(point) {
    if (pathPoints) {
        pathPoints.forEach(ietm => {
            ietm.removeFrom(map)
        })
    }

    linePoint = []
    if (polyline) {
        polyline.removeFrom(map)
    }

    let myIcon = L.icon({
        iconUrl: './img/care.png',
        iconSize: [30, 30]
    })
    let params = new SuperMap.FindPathParameters({
        nodes: [L.point(point), L.point(11544353.698388768, 3584569.322637741)],
        isAnalyzeById: false,
        parameter: analystParameter
    })
    var resultSetting = new SuperMap.TransportationAnalystResultSetting({
        returnEdgeFeatures: true,
        returnEdgeGeometry: true,
        returnEdgeIDs: true,
        returnNodeFeatures: true,
        returnNodeGeometry: true,
        returnNodeIDs: true,
        returnPathGuides: true,
        returnRoutes: true
    });
    var analystParameter = new SuperMap.TransportationAnalystParameter({
        resultSetting: resultSetting,
        weightFieldName: "SmLength"
    });

    L.supermap.networkAnalystService(serviceUrl).findPath(params, function(result) {
        let results = result;
        results.result.pathList.map(function(resultd) {
            console.log(resultd)
            L.geoJSON(resultd.pathGuideItems, {
                pointToLayer: function(geoPoints) {
                    let point = L.CRS.EPSG3857.unproject(L.point(geoPoints.geometry.coordinates))
                    linePoint.push(point)
                    let pathP = L.marker(point, { icon: myIcon }).addTo(map)
                    pathPoints.push(pathP)
                },
                filter: function(geoJsonFeature) {
                    if (geoJsonFeature.geometry && geoJsonFeature.geometry.type === 'Point') {
                        return true
                    }
                    return false
                }
            }).addTo(map)
        })

        polyline = L.polyline(linePoint, { color: 'red' }).addTo(map)
    })
}



function findPath() {
    let housIcon = L.icon({
        iconUrl: './img/hospitals.png',
        iconSize: [35, 35]
    })
    let facIcon = L.icon({
        iconUrl: './img/factory.png',
        iconSize: [35, 35]
    })
    let param = new SuperMap.QueryBySQLParameters({
        queryParams: [{
            name: "Hospital@EmergDS",
            attributeFilter: "1 = 1"
        }, {
            name: "Chemical_Factory@EmergDS",
            attributeFilter: "1 = 1"
        }]
    });
    L.supermap.queryService(url)
        .queryBySQL(param, function(serviceResult) {
            // console.log(serviceResult)
            serviceResult.result.recordsets[0].features.features.map(item => {
                let point = item.geometry.coordinates
                let name = item.properties.Name
                let latlng = L.CRS.EPSG3857.unproject(L.point(item.geometry.coordinates))
                let marker = L.marker(latlng, { icon: housIcon }).bindPopup(function() {
                    findPathProcess(point)
                    return name
                }).addTo(map)
                facPoints.push(marker)

            })
            let facP = serviceResult.result.recordsets[1].features.features[0].geometry.coordinates
            facP = L.CRS.EPSG3857.unproject(L.point(facP))
            let facpoint = L.marker(facP, { icon: facIcon }).addTo(map)
            facPoints.push(facpoint)
        })
}

//缓冲区分析

let spatialURL = "http://localhost:8090/iserver/services/spatialAnalysis-sxx/restjsr/spatialanalyst"
    //bufferAnalyst()
let buffer = []
let bufferAnswer = []

function bufferAnalyst(distance) {
    buffer.push(distance)
    let color = ['#d71345', '#8e453f', '#f47a55', '#f7acbc']
    let newColor;
    if (distance <= 150) {
        newColor = color[0]
    } else if (distance <= 400) {
        newColor = color[1]
    } else if (distance <= 800) {
        newColor = color[2]
    } else {
        newColor = color[3]
    }
    let bufferService = L.supermap.spatialAnalystService(spatialURL);
    let param = new SuperMap.DatasetBufferAnalystParameters({
        dataset: "Chemical_Factory@EmergDS",
        bufferSetting: new SuperMap.BufferSetting({
            endType: SuperMap.BufferEndType.ROUND,
            leftDistance: new SuperMap.BufferDistance({ value: distance }),
            rightDistance: new SuperMap.BufferDistance({ value: distance }),
            semicircleLineSegment: 20
        })
    })
    bufferService.bufferAnalysis(param, function(serviceResult) {
        console.log(serviceResult)
        let result = serviceResult.result
        items = []
        result.recordset.features.features[0].geometry.coordinates[0][0].map(item => {
            itemP = L.CRS.EPSG3857.unproject(L.point(item[0], item[1]))
            items.push([itemP.lat, itemP.lng])

        })
        let answer = L.polygon(items, { color: newColor }).addTo(map)
        bufferAnswer.push(answer)
    })

}