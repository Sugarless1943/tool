import {colors} from './Config'
import Path from './Path'
import Base from './Base'

export default class Station {
    constructor({e, level, net, address, name = '换热站(未命名)', uid, id, fat = null, children = [], paths = [], net2_child = []}) {
        this.id = id || new Date().getTime()
        this.level = level
        this.net = net

        let imgUrl = require(`../assets/level${this.net}_${this.level}.png`)
        this.icon = new window.BMapGL.Icon(imgUrl, new window.BMapGL.Size(20, 25), {anchor: new window.BMapGL.Size(10, 25)});

        this.uid = uid ? uid : ""
        this.address = e ? [e.latlng.lng, e.latlng.lat] : address
        this.name = name

        this.fat = fat
        this.children = children

        this.polygon = null
        this.polylineList = []

        this.paths = paths
        this.pathLineList = []

        this.net2_child = net2_child
    }

    draw() {
        this.point = new window.BMapGL.Point(this.address[0], this.address[1]);
        this.marker = new window.BMapGL.Marker(this.point, {icon: this.icon});
        this.configBind()
        this.label = new window.BMapGL.Label(this.name, {
            position: this.point,
            offset: new window.BMapGL.Size(0, 0),
        });
        Base.component.map.addOverlay(this.marker)
        Base.component.map.addOverlay(this.label)
        let timer = setInterval(() => {
            let dom = this.label.domElement
            if (dom) {
                dom.classList.add('staLabel')
                dom.classList.add(`stan${this.net}l${this.level}`)
                dom.setAttribute("net", this.net)
                dom.setAttribute("level", this.level)
                dom.setAttribute("id", this.id)
                clearInterval(timer)
            }
        }, 10)
        return this
    }

    configBind() {
        // console.log('换热站编辑事件')
        this.marker.removeEventListener('click', this.setConfig.bind(this))
        this.marker.addEventListener('click', this.setConfig.bind(this))
    }

    configBindRemove() {
        // console.log('换热站编辑事件移除')
        this.marker.removeEventListener('click', this.setConfig.bind(this))
    }

    setConfig(e) {
        console.log('换热站点击事件，为了编辑', this)
        Base.component.refresh()
        Base.component.operationFlag = 2
        Base.component.stationChoose(this)
        // console.log(this.pathLineList)
        this.pathView(true)
        if (this.level == 2 || this.level == 3) this.circle(true)
        if (e) e.domEvent.stopPropagation()
    }

    clean() {
        Base.component.map.removeOverlay(this.marker)
        Base.component.map.removeOverlay(this.label)
        this.viewClean()
        return this
    }

    reDraw() {
        this.clean()
        this.draw()
        this.pathView(true)
    }

    markFn(e) {
        Base.stationsMarkInit()
        if (Path.path_Mark) {
            let marks = Base.component.stations.filter(item => {
                return item.label.domElement.hasAttribute("path")
            })
            //消除已有的标记
            let choose_type = Base.component.choose.level
            let target_net = e.target.getAttribute("net")
            // console.log(choose_type, target_net, target_level, target_path)
            if (e.target.hasAttribute("path")) {
                e.target.removeAttribute('path')
                if (marks.length == 2) {
                    if (choose_type == 9) {
                        Base.component.stations.forEach(item => {
                            let dom = item.label.domElement
                            dom.hasAttribute('path') && dom.setAttribute('path', 0)
                        })
                    }
                }
            } else {
                if(choose_type == 9) {
                    if(Path.path_Edit != null) {
                        if (marks.length < 2) {
                            e.target.setAttribute("path", 1)
                        } else {
                            marks.map(item => {
                                let dom = item.label.domElement
                                if(dom.getAttribute('path') == 1) {
                                    dom.removeAttribute("path")
                                }
                            })
                            e.target.setAttribute("path", 1)
                        }
                    }else {
                        if (marks.length < 2) {
                            if (marks.length == 0) e.target.setAttribute("path", 0)
                            if (marks.length == 1) e.target.setAttribute("path", 1)
                        } else {
                            marks.forEach(item => {
                                let dom = item.label.domElement
                                let path = dom.getAttribute("path") * 1
                                if (path === 0) {
                                    dom.removeAttribute("path")
                                }
                                if (path === 1) {
                                    dom.setAttribute("path", 0)
                                }
                            })
                            e.target.setAttribute("path", 1)
                        }
                    }
                }else if(choose_type == 10) {
                    marks.forEach(item => {
                        let dom = item.label.domElement
                        let path = dom.getAttribute("path") * 1
                        if(path == target_net - 1) dom.removeAttribute("path")
                    })
                    e.target.setAttribute("path", target_net - 1)
                }
            }
            Path.iconDraw()
        } else {
            let className = `markern${this.getAttribute("net")}l${this.getAttribute("level")}`
            e.target.classList.toggle(className)
        }
        e.stopPropagation()
    }

    mark(open) {
        this.label.domElement.classList.remove('stanDisabled')
        this.label.domElement.removeEventListener("click", this.markFn)
        open ? this.label.domElement.addEventListener("click", this.markFn) : this.label.domElement.classList.add("stanDisabled")
    }

    markInit(choose = Base.component.choose || {net: this.net, level: this.level}) {
        // console.log(choose, Base.component.station_choose)
        if (choose.level == 2 || choose.level == 3) {
            let station_choose = Base.component.station_choose
            if (station_choose == null) {
                this.mark(this.net == choose.net && this.level == (choose.level - 1) && this.fat == null)
            } else {
                this.mark(this.net == choose.net && this.level == (station_choose.level - 1) && (this.fat == null || this.fat == station_choose.id))
            }
        } else if (choose.level == 9) {
            this.mark(choose.net == this.net && this.level == 1)
        } else if (choose.level == 10) {
            this.mark(this.level == 1 && !Base.getNet1Childs().includes(this.id))
        }
    }

    circle(active) {
        if (active) {
            if (this.polygon) Base.component.map.removeOverlay(this.polygon)
            // let points = this.children.map(item => {
            //     let child = Base.component.stationMap.get(item)
            //     return new window.BMapGL.Point(child.address[0], child.address[1])
            // })

            let points = []
            this.polylineList = []
            this.children.map(item => {
                let child = Base.component.stationMap.get(item)
                let point = new window.BMapGL.Point(child.address[0], child.address[1])
                points.push(point)

                console.log([this.point, point])
                this.polylineList.push(new window.BMapGL.Polyline([this.point, point], {
                    strokeColor: "blue",
                    strokeStyle: "dashed",
                    strokeWeight: 1,
                    strokeOpacity: 0.5,
                }));
            })

            // console.log(polylineList)


            this.polygon = new window.BMapGL.Polygon(points, {
                strokeColor: colors[`n${this.net}l${(this.level - 1)}`],
                strokeWeight: 2,
                fillColor: '#fff',
                enableClicking: false
            })
            Base.component.map.addOverlay(this.polygon)

            if (this.polylineList.length > 0) {
                this.polylineList.forEach(item => {
                    Base.component.map.addOverlay(item)
                })
            }
        } else {
            Base.component.map.removeOverlay(this.polygon)
            if (this.polylineList.length > 0) {
                this.polylineList.forEach(item => {
                    // console.log(item)
                    Base.component.map.removeOverlay(item)
                })
            }
        }
    }

    pathView(active) {
        // console.log('pathLineList', this.pathLineList)
        if (this.pathLineList && this.pathLineList.length > 0) {
            this.pathLineList.map(item => {
                Base.component.map.removeOverlay(item)
            })
            this.pathLineList = []
        }
        if (active) {
            // console.log('path', this.paths)
            this.pathLineList = []
            let paths_cur = this.paths.map(item => {return Object.assign(item, {color:'blue'})})
            let net2_child_cur = this.net2_child.map(item => {return Object.assign(item, {color:'red'})})
            let arr = [...paths_cur,...net2_child_cur].map(item => {
                let list = [this.address].concat(item.course)
                let end = Base.component.stationMap.get(item.to)
                if (end) {
                    list.push(end.address)
                    // console.log(list)

                    let pointList = list.map((item) => {
                        return new window.BMapGL.Point(item[0], item[1]);
                    });
                    // console.log(item, 'itemmmmmmmmmmmmmm')
                    this.pathLineList.push(new window.BMapGL.Polyline(pointList, {
                        strokeColor: item.color,
                        strokeWeight: 2,
                        strokeOpacity: 0.5,
                    }));
                }
            })

            this.pathLineList.map(item => {
                Base.component.map.addOverlay(item)
            })
        }
    }

    viewClean() {
        this.pathView(false)
        this.circle(false)
        Base.component.map.removeOverlay(this.polygon)
    }

    childEdit() {
        // console.log(111)
        this.viewClean()
        Base.component.mapReset(false)
        Base.configBindRemove()
        Base.editReady(this)
    }

    highlight() {
        let dom = this.label.domElement
        let className = `markern${this.net}l${this.level}`
        dom.classList.add(className)
    }

}

export {Station, Base}