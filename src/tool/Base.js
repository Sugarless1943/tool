import Path from './Path'

export default class Base {
    static component = null
    static station_choose = null

    static asy(callback, time = 0) {
        let timer = setTimeout(() => {
            callback()
            clearTimeout(timer)
        }, time)
    }

    static wait(callback, time = 10) {
        let timer = setInterval(() => {
            callback(timer)
        }, time)
        setTimeout(() => {
            clearInterval(timer)
        }, 5000)
    }

    static configBind() {
        Base.component.stations.map(item => {
            item.configBind()
        })
    }

    static configBindRemove() {
        Base.component.stations.map(item => {
            item.configBindRemove()
        })
    }

    static stationsMarkInit() {
        Base.component.stations.map(item => {
            item.markInit()
        })

        if(Path.path_Edit) {
            let startStation = Base.component.stationMap.get(Path.path_Edit.startId)
            startStation[Path.path_Edit.type].map(item => {
                Base.component.stationMap.get(item.to).mark(false)
                if(item.to == Path.path_Edit.endId)  Base.component.stationMap.get(item.to).mark(true)
            })
        }
    }

    static editReady(station) {
        // console.log(station, Base.component.stations)
        station.highlight()
        Base.component.stations.map(item => {
            if(item.level == station.level - 1 && (!item.fat || item.fat == station.id) && item.net == station.net) {
                item.mark(true)
            }else {
                item.mark(false)
            }

            if(item.fat == station.id) item.highlight()
        })
    }

    static setChildren({net, level, id}, tipsShow = true) {
        let doms = document.querySelectorAll(`.markern${net}l${(level - 1)}`)
        if (doms.length == 0) {
            tipsShow && Base.component.$message.warning('请至少选择一个换热站');
            return []
        }
        let children = []

        doms.forEach(item => {
            let item_id = item.getAttribute("id")*1
            let chidren_station = Base.component.stationMap.get(item_id)
            children.push(item_id)
            chidren_station.fat = id
        })
        Base.component.stations.map(item => {
            if(item.fat == id && !children.includes(item.id)) item.fat = null
        })

        return children.sort((a,b) => {
            return document.getElementById(a).getAttribute('clickTime')*1 - document.getElementById(b).getAttribute('clickTime')*1
        })
    }

    static getStationByClassName(className) {
        let dom = document.querySelector(className)
        if (dom) {
            let id = dom.getAttribute("id") * 1
            return Base.component.stationMap.get(id)
        }
        return null
    }

    static getNet1Childs() {
        return Base.component.stations.reduce((pre, cur) => {
            if(cur.net2_child && cur.net2_child.length > 0) {
                cur.net2_child.map(item => {
                    pre.push(item.to)
                })
            }
            return pre
        }, [])
    }

    static stationDelete(id) {
        Base.stationsFilter(id)
        Base.createStations()
    }

    static stationsFilter(id) {
        let station = Base.component.stationMap.get(id)
        Base.component.stationMap.delete(id)
        Base.component.stationMap.forEach(item => {
            if(item.fat == id) item.fat = null
            if(item.children.includes(id)) {
                item.children.splice(item.children.indexOf(id), 1)
            }
            item.paths.forEach((path, index) => {
                if (path.to == id) {
                    item.paths.splice(index, 1)
                }
            })
            if (item.net == 1 && item.level == 1 && item.net2_child.length > 0) {
                item.net2_child.map((chi, index) => {
                    if (chi.to == station.id) {
                        item.net2_child.splice(index, 1)
                    }
                })
            }

            if(item.level > 1 && item.children.length == 0) {
                Base.stationsFilter(item.id)
            }
        })
    }

    static createStations() {
        Base.component.stations = []
        Base.component.stationMap.forEach(item => {
            Base.component.stations.push(item)
        })
    }
}