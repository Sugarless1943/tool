import Base from "./Base";

export default class Marker {
    static change = new Date().getTime()
    constructor(address) {
        this.address = address
    }

    set address(val) {
        this.lat = val[0]
        this.lng = val[1]
        this.point = new BMapGL.Point(val[0], val[1]);
        this.marker = new BMapGL.Marker(this.point, {enableDragging: true});
        let self = this
        this.marker.addEventListener('mouseup', e => {
            Base.component.map.removeOverlay(self.marker)
            self.address = [e.latLng.lng, e.latLng.lat]
            Marker.change = new Date().getTime()
        })
    }

    set name(val) {
        this.label && Base.component.map.removeOverlay(this.label)
        this.label = new BMapGL.Label(val, {
            position: this.point,
            offset: new BMapGL.Size(0, 0),
        });
    }
}