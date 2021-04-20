import Base from "./Base";

export default class Marker {
    static change = new Date().getTime()
    constructor(address) {
        this.address = address
    }

    set address(val) {
        this.lng = val[0]
        this.lat = val[1]
        this.point = new BMapGL.Point(val[0], val[1]);
        this.marker = new BMapGL.Marker(this.point, {enableDragging: true});
        this.marker.addEventListener('mouseup', this.change.bind(this))
    }

    set name(val) {
        this.label && Base.component.map.removeOverlay(this.label)
        this.label = new BMapGL.Label(val, {
            position: this.point,
            offset: new BMapGL.Size(0, 0),
        });
    }

    change(e) {
        Base.component.map.removeOverlay(this.marker)
        this.address = e ? [e.latLng.lng, e.latLng.lat] : [this.lng, this.lat]
        Marker.change = new Date().getTime()
    }
}