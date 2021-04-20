import Base from "./Base";

export default class Contextmenu {
    constructor(station) {
        this.station = station
        this.menuId = 'staUl'
        this.txtMenuItem = [
            {
                text: '删除',
                callback: () => {
                    if (this.station.fat != null) {
                        let fat = Base.component.stationMap.get(this.station.fat)
                        if (fat) {
                            fat.children.splice(fat.children.indexOf(this.station.id), 1)
                            fat.children.length == 0 && Base.component.stationMap.delete(fat.id)
                        }
                    }
                    if (this.station.level > 1) {
                        Base.component.stations.forEach(item => {
                            if (item.net == this.net && item.level == (this.level - 1) && item.fat == this.id) {
                                item.fat = null
                            }
                        })
                    }
                    Base.component.stationMap.delete(this.station.id)
                    Base.component.stations = []
                    Base.component.stationMap.forEach(item => {
                        Base.component.stations.push(item)
                    })
                }
            }, {
                text: '修改点位',
                callback: () => {
                    Base.asy(() => {
                        this.station.marker.enableDragging()
                        this.station.marker.addEventListener('mouseup', e => {
                            this.station.address = [e.latLng.lng, e.latLng.lat]
                            this.station.reDraw()
                        })
                    })
                }
            }
        ]
        this.show = false
    }

    bindMarker(marker) {
        marker.addEventListener('click', this.contextFn.bind(this))
        return this
    }

    contextFn(e) {
        this.contextmenu(e.target)
        Base.asy(() => {
            Base.component.operationFlag = 2
            Base.component.stationChoose(this.station)
        })
    }

    contextmenu(el) {
        let dom = el.domElement
        let parent = dom.parentNode
        let ul = document.createElement('ul')
        ul.classList.add(this.menuId)
        ul.setAttribute('id', this.menuId)
        ul.style.position = 'absolute'
        ul.style.left = parseInt(dom.style.left) + 10 + 'px'
        ul.style.top = parseInt(dom.style.top) + 25 + 'px'
        this.txtMenuItem.forEach(item => {
            let li = document.createElement('li')
            li.innerText = item.text
            li.addEventListener('click', item.callback)
            ul.appendChild(li)
        })
        parent.appendChild(ul)

        let timer = setTimeout(() => {
            Base.component.map.addEventListener('click', this.menuClean)
            Base.component.map.addEventListener('dragstart', this.menuClean)
            Base.component.map.addEventListener('zoomstart', this.menuClean)
            clearTimeout(timer)
        })

        this.show = true
    }

    menuClean() {
        let menu = document.querySelector("#staUl")
        menu && menu.remove()
        Base.component.map.removeEventListener('click', this.menuClean)
        Base.component.map.removeEventListener('dragstart', this.menuClean)
        Base.component.map.removeEventListener('zoomstart', this.menuClean)
        Base.component.operationFlag = 0
        Base.component.stationChoose(null)
        this.show = false
    }
}