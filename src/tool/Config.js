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

const colors = {
    n1l1: "#F24676",
    n1l2: "#EE9400",
    n1l3: "#00B5D0",
    n2l1: "#494E8E",
    n2l2: "#121929"
}

const getConfig = function(args) {
    let res = null
    Config.map(item => {
        item.main.map(cfg => {
            if(cfg.net == args.net && cfg.level == args.level) res = Object.assign(cfg, {active: true})
        })
    })

    return res
}

export {Config, getConfig, colors}