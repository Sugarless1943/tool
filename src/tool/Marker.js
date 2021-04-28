import Base from "./Base";

export default class Marker {
    static change = new Date().getTime()
    constructor(address, path) {
        console.log(path)
        this.address = address
        this.path = path
    }

    set address(val) {
        this.lng = val[0]
        this.lat = val[1]
        this.point = new window.BMapGL.Point(val[0], val[1]);
        this.marker = new window.BMapGL.Marker(this.point, {enableDragging: true});
        this.marker.addEventListener('mouseup', this.change.bind(this))
    }

    set name(val) {
        this.label && Base.component.map.removeOverlay(this.label)
        this.label = new window.BMapGL.Label(val, {
            position: this.point,
            offset: new window.BMapGL.Size(0, 0),
        });
    }

    change(e) {
        Base.component.map.removeOverlay(this.marker)
        this.address = e ? [e.latLng.lng, e.latLng.lat] : [this.lng, this.lat]
        Marker.change = new Date().getTime()
        console.log(this.path, 'path')
        if(this.path.polyline != null) {
            this.path.view(true)
        }
    }
}