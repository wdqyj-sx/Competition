let map;
let url = "http://localhost:8090/iserver/services/map-sxx/rest/maps/City@EmergDS";
//定义热点
let markers = []
let resultLayer;
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
    $("#hos-pan").toggle(1000)
})
$("#showHos").click(function() {
    //query();
    loadPulse();
    $(".chartColor").toggle()
})
$("#showSigle").click(function() {
        query()

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
            console.log(serviceResult.result.recordsets[0].features)
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
    result.features.map((feature, index) => {
        console.log(feature)
        var latLng = L.CRS.EPSG3857.unproject(L.point(feature.geometry.coordinates));
        markers.push(L.marker(latLng, { icon: pulseIcon[index] }));

    });
    resultLayer = L.featureGroup(markers).addTo(map);
}

//清除图层
function clearLayer(lay) {
    if (lay) {
        resultLayer.removeFrom(map)
    }
}