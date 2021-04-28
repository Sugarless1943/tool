import Marker from "./Marker";
import Base from "./Base";

export default class Path {
    static path_Mark = false
    static path_Edit = false

    constructor(courseList = []) {
        this.courseList = courseList
        this.start = null
        this.end = null
    }

    pathMark() {
        Path.path_Mark = true
        Base.component.map.addEventListener('rightclick', this.courseMark.bind(this))
    }

    courseMark(e) {
        this.courseList.push(new Marker([e.latlng.lng, e.latlng.lat], this))
        this.drawCourse()
    }

    clanCourse() {
        this.courseList.map((item) => {
            Base.component.map.removeOverlay(item.marker)
            Base.component.map.removeOverlay(item.label)
        })
    }

    drawCourse() {
        this.courseList.map((item, index) => {
            Base.component.map.addOverlay(item.marker)
            item.name = index + 1
            Base.component.map.addOverlay(item.label)
        })
    }

    reDrawCourse(item) {
        item.change()
    }

    view(execute = false) {
        Base.component.map.removeOverlay(this.polyline);
        if(!execute && this.polyline) {
            this.polyline = null
            return
        }
        this.getStartEnd(() => {
            let addressList = [this.start.address, this.end.address]
            if (this.courseList.length > 0) {
                this.courseList.map((item, index) => {
                    addressList.splice(index + 1, 0, [item.lng, item.lat])
                })
            }

            let pointList = addressList.map((item) => {
                return new window.BMapGL.Point(item[0], item[1]);
            });
            console.log(pointList, 'pointListtttttttttttttttt')
            this.polyline = new window.BMapGL.Polyline(pointList, {
                strokeColor: "blue",
                strokeWeight: 2,
                strokeOpacity: 0.5,
            });
            Base.component.map.addOverlay(this.polyline);
        })
    }

    clean() {
        // console.log('remove')
        Base.component.map.removeOverlay(this.polyline);
        Base.component.map.removeEventListener('rightclick', this.courseMark.bind(this))
    }

    getStartEnd(callback) {
        this.start = Path.getStart()
        this.end = Path.getEnd()
        if (this.start && this.end) {
            callback()
        } else {
            Base.component.$message.warning('请至少选择两个换热站');
        }
    }

    save() {
        this.getStartEnd(() => {
            let station_start = Base.component.stationMap.get(this.start.id)
            let station_end = Base.component.stationMap.get(this.end.id)
            let aim = station_start[station_start.net == station_end.net ? 'paths' : 'net2_child']
            if(Path.path_Edit && Path.path_Edit.endId != station_end) {
               aim.map((item, index) => {
                   if(item.to == Path.path_Edit.endId) aim.splice(index, 1)
               })
            }
            aim.push({
                to: this.end.id,
                course: this.courseList.map(item => {
                    return [item.lng, item.lat]
                }),
                diam: 0,
                len: 0
            })

            this.clean()
            Base.component.refresh()
        })
    }

    edit(startId, endId, field) {
        this.startId = startId
        this.endId = endId
        this.type = field
    }

    editInit() {
        return new Promise(resolve => {
            Base.asy(() => {
                let [start_dom, end_dom] = [document.getElementById(this.startId), document.getElementById(this.endId)]
                start_dom.classList.add('pathStart')
                start_dom.classList.add('stanDisabled')
                start_dom.setAttribute('path', 0)

                end_dom.classList.add('pathEnd')
                end_dom.setAttribute('path', 1)

                let start_station = Base.component.stationMap.get(this.startId)
                start_station.mark(false)

                resolve()
            })
        })
    }

    static iconDraw() {
        //class渲染
        Base.component.stations.forEach(item => {
            let dom = item.label.domElement
            dom.classList.remove('pathStart')
            dom.classList.remove('pathEnd')
            if (item.label.domElement.hasAttribute("path")) {
                let path = dom.getAttribute("path") * 1
                path === 0 && dom.classList.add('pathStart')
                path === 1 && dom.classList.add('pathEnd')
            }

            item.level != 1 && item.mark(false)
        })

        let start = document.querySelector("[path='0']")
        if (start) {
            let id = start.getAttribute("id") * 1
            let station = Base.component.stationMap.get(id)
            if (station.paths.length > 0) {
                station.paths.map(item => {
                    Base.component.stationMap.get(item.to).mark(false)
                })
                if(Path.path_Edit != null) {
                    Base.component.stationMap.get(Path.path_Edit.startId).mark(false)
                    Base.component.stationMap.get(Path.path_Edit.endId).mark(true)
                }
            }
        }
    }

    static getStart() {
        return Base.getStationByClassName('.pathStart')
    }

    static getEnd() {
        return Base.getStationByClassName('.pathEnd')
    }
}