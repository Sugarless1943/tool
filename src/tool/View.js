import Base from './Base'

export default class View {
    static run(val) {
        if (val) {
            Base.component.stations.map(item => {
                switch (val.level) {
                    case 2:
                    case 3:
                        if (item.level == val.level && item.children.length > 0) {
                            item.circle(val.active)
                        }
                        break;
                    case 9:
                        if (item.paths.length + item.net2_child.length > 0) {
                            item.pathView(val.active)
                        }
                        break;
                    case 0:
                        Base.component.refresh()
                }
            })
        } else {
            Base.component.stations.map(item => {
                item.viewClean()
            })
        }
    }
}