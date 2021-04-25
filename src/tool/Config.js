import Station from './Station'
// import StationServer from './StationServer'

const Config = [
    {
        header: '一网配置',
        main: [
            {
                title: '一网一级换热站',
                show: "一",
                net: 1,
                level: 1,
                active: false,
                tip: [
                    '请标记换热站站点'
                ]
            },
            {
                title: '一网二级换热站',
                show: "二",
                net: 1,
                level: 2,
                active: false,
                tip: [
                    '请选择一级换热站',
                    '请标记二级站点'
                ]
            },
            {
                title: '一网三级换热站',
                show: "三",
                net: 1,
                level: 3,
                active: false,
                tip: [
                    '请选择二级换热站',
                    '请标记三级站点'
                ]
            },
            {
                title: '二网管道',
                show: '管',
                net: 1,
                level: 9,
                active: false,
                tip: [
                    '请选择起始和终止换热站（左键）',
                    '请标记管线路径（右键）'
                ],
                opt: 'pathOpt'
            },
            {
                title: '一二网串联',
                show: '串',
                net: 1,
                level: 10,
                active: false,
                tip: [
                    '请选择一网一级换热站',
                    '请选择二网一级换热站'
                ],
                opt: 'pathOpt'
            }
        ]
    },
    {
        header: '二网配置',
        main: [{
            title: '二网一级换热站',
            show: "一",
            net: 2,
            level: 1,
            active: false,
            tip: [
                '请标记换热站站点'
            ]
        }, {
            title: '二网二级换热站',
            show: "二",
            net: 2,
            level: 2,
            active: false,
            tip: [
                '请选择一级换热站',
                '请标记二级站点'
            ]
        }, {
            title: '二网管道',
            show: "管",
            net: 2,
            level: 9,
            active: false,
            tip: [
                '请选择起始和终止换热站',
                '请标记管线路径'
            ],
            opt: 'pathOpt'
        }]
    }
]

const req = [
    {
        "id": 1618453784620,
        "level": 1,
        "name": "zzz",
        "net": 1,
        "uid": "",
        "address": [
            111.89979112753075,
            37.0497991380632
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618453786003,
        "level": 1,
        "name": "xxx",
        "net": 1,
        "uid": "",
        "address": [
            111.89231722568772,
            37.0464579820624
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618453787435,
        "level": 1,
        "name": "ccc",
        "net": 1,
        "uid": "",
        "address": [
            111.89425756558927,
            37.05342815666865
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617776516290,
        "level": 1,
        "name": "1号",
        "net": 1,
        "uid": "",
        "address": [
            "111.96915115563008",
            37.04357755610032
        ],
        "fat": 1617860706542,
        "children": [],
        "paths": [
            {
                "to": 1617788147083,
                "course": [
                    [
                        111.90079722970192,
                        37.05014476642387
                    ],
                    [
                        111.90474977394582,
                        37.03873819230871
                    ]
                ],
                "diam": 0,
                "len": 0,
                "color": "blue"
            },
            {
                "to": 1617776518086,
                "course": [
                    [
                        111.95979793559727,
                        37.02104882348492
                    ],
                    [
                        111.94456267414805,
                        37.01574696563593
                    ],
                    [
                        111.9097084203609,
                        37.020126788054895
                    ],
                    [
                        111.92832131052764,
                        37.03424421876822
                    ]
                ],
                "diam": 0,
                "len": 0,
                "color": "blue"
            }
        ],
        "net2_child": [
            {
                "to": 1618544542655,
                "course": [
                    [
                        111.94485013191124,
                        37.022028473762816
                    ],
                    [
                        111.93536402572587,
                        37.01828268333616
                    ]
                ],
                "diam": 0,
                "len": 0,
                "color": "red"
            },
            {
                "to": 1618544540766,
                "course": [
                    [
                        111.92731093932265,
                        37.04917004459418
                    ],
                    [
                        111.8966966875426,
                        37.02779542848346
                    ]
                ],
                "diam": 0,
                "len": 0,
                "color": "red"
            }
        ]
    },
    {
        "id": 1617776518086,
        "level": 1,
        "name": "2号",
        "net": 1,
        "uid": "",
        "address": [
            111.89864129647798,
            37.042482965329114
        ],
        "fat": 1617860706542,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617788147083,
        "level": 1,
        "name": "3号",
        "net": 1,
        "uid": "",
        "address": [
            111.90661824940658,
            37.04409604090944
        ],
        "fat": 1617860706542,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617860706542,
        "level": 2,
        "name": "二级",
        "net": 1,
        "uid": "",
        "address": [
            111.93658572121944,
            37.036836928550535
        ],
        "fat": 1617871167991,
        "children": [
            1617776516290,
            1617776518086,
            1617788147083
        ],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617860729732,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 1,
        "uid": "",
        "address": [
            111.889011461411,
            37.0311904682933
        ],
        "fat": 1617871122220,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617860731447,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 1,
        "uid": "",
        "address": [
            111.89928807644516,
            37.03251569597538
        ],
        "fat": 1617871122220,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617871122220,
        "level": 2,
        "name": "换热站(未命名)",
        "net": 1,
        "uid": "",
        "address": [
            111.89540739664204,
            37.033495197096876
        ],
        "fat": 1617871167991,
        "children": [
            1617860729732,
            1617860731447
        ],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617871124657,
        "level": 1,
        "name": "eeeeeeeeeeeeee",
        "net": 1,
        "uid": "",
        "address": [
            111.87830365973207,
            37.04305906771935
        ],
        "fat": 1617871133704,
        "children": [],
        "paths": [],
        "net2_child": [
            {
                "to": 1618824143978,
                "course": [],
                "diam": 0,
                "len": 0,
                "color": "red"
            },
            {
                "to": 1618824147358,
                "course": [],
                "diam": 0,
                "len": 0,
                "color": "red"
            }
        ]
    },
    {
        "id": 1617871126026,
        "level": 1,
        "name": "qqqqqqqqqqqqqq",
        "net": 1,
        "uid": "",
        "address": [
            111.87147653785624,
            37.0347627678678
        ],
        "fat": 1617871133704,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617871127618,
        "level": 1,
        "name": "wwwwwwwwwwwwwwwwwww",
        "net": 1,
        "uid": "",
        "address": [
            111.88261552617996,
            37.03637600889285
        ],
        "fat": 1617871133704,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617871133704,
        "level": 2,
        "name": "换热站(未命名)",
        "net": 1,
        "uid": "",
        "address": [
            111.87665077759371,
            37.038046829225266
        ],
        "fat": 1617871167991,
        "children": [
            1617871124657,
            1617871126026,
            1617871127618
        ],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1617871167991,
        "level": 3,
        "name": "aaa",
        "net": 1,
        "uid": "",
        "address": [
            111.89274841233251,
            37.04012089942661
        ],
        "fat": null,
        "children": [
            1617860706542,
            1617871122220,
            1617871133704
        ],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618544540766,
        "level": 1,
        "name": "bbb",
        "net": 2,
        "uid": "",
        "address": [
            111.89662909213561,
            37.02035729797049
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618544542655,
        "level": 1,
        "name": "ccc",
        "net": 2,
        "uid": "",
        "address": [
            111.90999587812409,
            37.01955051017982
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618824143978,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 2,
        "uid": "",
        "address": [
            111.88347789946954,
            37.022604732680314
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618824147358,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 2,
        "uid": "",
        "address": [
            111.90223024948406,
            37.02139914819359
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618901180560,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 2,
        "uid": "",
        "address": [
            111.92537335769497,
            37.05138018936157
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618901183212,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 2,
        "uid": "",
        "address": [
            111.9242235266422,
            37.044064170342445
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    },
    {
        "id": 1618901185206,
        "level": 1,
        "name": "换热站(未命名)",
        "net": 2,
        "uid": "",
        "address": [
            111.92465471328698,
            37.03715074294751
        ],
        "fat": null,
        "children": [],
        "paths": [],
        "net2_child": []
    }
]
// let req = []
// if(localStorage.getItem('req')) {
//     req = JSON.parse(localStorage.getItem('req'))
// }
// StationServer.findAll().then(res => {
//     console.log(res)
// })

const colors = {
    n1l1: "#F24676",
    n1l2: "#EE9400",
    n1l3: "#00B5D0",
    n2l1: "#494E8E",
    n2l2: "#121929"
}

const Stations = []
req.length > 0 &&
req.map(item => {
    Stations.push(new Station(item))
})

export {Config, Stations, colors}