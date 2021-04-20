<template>
  <div id="tool">
    <nav>
      <header>
        <img src="../assets/logo.png" width="30px" height="30px">
        <section class="center-point">
          <label>中心点：</label>
          <el-input v-model="center[0]" placeholder="请输入内容"></el-input>
          <span>-</span>
          <el-input v-model="center[1]" placeholder="请输入内容"></el-input>
        </section>
        <section class="zoom">
          <label>zoom：</label>
          <el-input-number v-model="zoomNum" :min="1" :max="20" size="mini" label="描述文字"></el-input-number>
        </section>
      </header>
      <footer>
        <el-button type="primary" @click="stationTree()">换热站关系预览</el-button>
        <el-button type="primary" @click="stationTable()">换热站管理</el-button>
        <el-button type="primary" @click="save()">保存</el-button>
      </footer>
    </nav>
    <main>
      <header>
        <leftNav @btnClick="toolSwitch" ref="nav"></leftNav>
      </header>
      <main id="container"></main>
      <footer>
        <StationView v-if="operationFlag == 0" @view="stationView" ref="staView"></StationView>
        <OperationTips v-if="operationFlag == 1" :choose="choose" ref="tip"></OperationTips>
        <StationConfig v-if="operationFlag == 2" ref="con"></StationConfig>
      </footer>
    </main>
    <StationTable ref="staTable"></StationTable>
    <StationTree ref="staTree"></StationTree>
  </div>
</template>

<script>
import leftNav from "./LeftNav";
import Station from '../tool/Station'
import Base from '../tool/Base'
import StationView from "./StationView";
import StationConfig from "./StationConfig";
import OperationTips from "./OperationTips";
import {Stations} from '../tool/Config'
import bus from '../tool/bus'
import Path from '../tool/Path'
import Marker from '../tool/Marker'
import StationTable from "./StationTable";
import View from '../tool/View'
import StationTree from "./StationTree";

export default {
  name: "Main",
  components: {StationTree, OperationTips, leftNav, StationView, StationConfig, StationTable},
  data() {
    return {
      center: [111.916823, 37.033985],
      zoomNum: 15,
      map: null,
      stations: Stations,
      station_choose: Base.station_choose,
      operationFlag: 0,
      choose: null,
      stationMarker: e => {
        let newId = new Date().getTime()
        let children = []
        if (this.choose.level > 1) {
          children = Base.setChildren({id: newId, ...this.choose})
        }
        // console.log(children)
        let station = new Station({
          id: newId,
          e,
          level: this.choose.level,
          net: this.choose.net,
          children
        }).draw()

        this.stations.push(station)
        this.refresh()
        this.mapStationAdd(false)
        this.mapReset(true)
        e.domEvent.stopPropagation()
      },
      map_click: e => {
        // console.log('地图点击重置事件')
        this.stationChoose(null)
        e.domEvent.stopPropagation()
      },
      stationMap: new Map(),
      path: null
    }
  },

  methods: {
    drawMap() {
      let point = new BMapGL.Point(this.center[0], this.center[1]);
      this.map.centerAndZoom(point, this.zoomNum);
      this.map.enableScrollWheelZoom(true);
    },

    refresh() {
      // console.log('refresh')
      this.stationFresh()
      this.path && this.path.clean()
      this.path = null
      this.$refs.nav && this.$refs.nav.reset()
      this.$refs.staView && this.$refs.staView.init()
      this.choose = null
      this.operationFlag = 0
    },

    stationFresh() {
      this.map.clearOverlays()
      this.staionMap = new Map()
      // console.log(this.stations, 'stations')
      this.stations.map(item => {
        item.draw()
        this.stationMap.set(item.id, item)
      })
      this.mapReset(true)
      Path.path_Mark = false
    },

    //左侧导航栏点击
    toolSwitch(val) {
      //点击了哪个按钮
      console.log('按钮', val)
      if (val.active) {
        this.stationFresh()
        this.choose = val
        //取消初始状态的两个事件
        this.mapReset(false)
        Base.configBindRemove()
        this.pathReset()
        switch (val.level) {
          case 1:
            this.mapStationAdd(true)
            break;
          case 2:
          case 3:
            Base.stationsMarkInit()
            this.mapStationAdd(true)
            break;
          case 9:
          case 10:
            this.pathMarker()
            break;
        }
      } else {
        this.choose = null
        this.refresh()
      }

      this.$nextTick(() => {
        this.choose && this.$refs.tip.choose(this.choose)
      })
      this.operationFlag = val.active ? 1 : 0
    },

    mapMarker(callback) {
      this.map.addEventListener('click', callback)
    },

    pathMarker() {
      Base.stationsMarkInit()
      let path = new Path()
      path.pathMark()
      Object.defineProperty(Marker, 'change', {
        set() {
          path.drawCourse()
        }
      })
      this.$nextTick().then(() => {
        this.$refs.tip.setOptData({
          path
        })
      })
      this.path = path
    },

    pathReset() {
      Path.path_Mark = false
      if (this.path) {
        this.path.clean()
        this.path = null
      }
    },

    stationView(val) {
      View.run(val)
    },

    format(sts) {
      return sts.map(item => {
        return {
          id: item.id,
          level: item.level,
          name: item.name,
          net: item.net,
          uid: item.uid,
          address: [item.point.lng, item.point.lat]
        }
      })
    },

    init() {
      this.map = new BMapGL.Map("container");
      Base.component = this
      this.drawMap()

      //是否需要感知类型转换换热站
      if (this.stations.length > 0) {
        this.stations = this.stations.map(item => {
          return new Station(item)
        })
      }
    },

    pathSave() {
      console.log('pathSave')
    },

    save() {
      console.log(this.stations)
      console.log(JSON.stringify(this.stations.map(({
                                                      id,
                                                      level,
                                                      name,
                                                      net,
                                                      uid,
                                                      address,
                                                      fat,
                                                      children,
                                                      paths,
                                                      net2_child
                                                    }, index) => {
        return {id, level, name, net, uid, address, fat, children, paths, net2_child}
      }), null, 2))
    },

    mapReset(open) {
      this.map.removeEventListener("click", this.map_click.bind(this))
      open && this.map.addEventListener("click", this.map_click.bind(this))
    },

    mapStationAdd(open) {
      this.map.removeEventListener('click', this.stationMarker)
      open && this.map.addEventListener('click', this.stationMarker)
    },

    stationChoose(station) {
      return new Promise(resolve => {
        this.station_choose && this.station_choose.viewClean()
        this.station_choose = station
        this.$nextTick().then(() => {
          if (station != null) {
            this.$refs.con.station = station
          } else {
            this.refresh()
          }
          resolve()
        })
      })
    },

    stationTree() {
      this.$refs.staTree.open(this.stationMap)
    },

    stationTable() {
      this.$refs.staTable.open(this.stations)
    }
  },

  mounted() {
    this.init()
  },

  watch: {
    center(val) {
      this.drawMap()
    },

    zoomNum(val) {
      this.drawMap()
    },

    stations(val, pre) {
      // console.log('Stations update', val, this.map)
      Base.asy(() => {
        this.refresh()
      })
      console.log('choose：' + this.choose)
    },

    choose(val) {
      console.log('choose', val)
    },

    operationFlag(val) {
      // console.log(val)
    },

    station_choose(val, old) {
      // console.log('station_choose', val, old)
    }
  }
}
</script>

<style lang="scss">
#tool {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  & > nav {
    color: #fff;
    background: #3C3F41;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    & > header {
      display: flex;
      align-items: center;

      & > img {
        padding: 10px 10px 10px 0;
      }

      .center-point {
        span {
          margin: 0 5px;
        }

        display: flex;
        align-items: center;
        margin-right: 20px;

        .el-input {
          width: 115px;

          .el-input__inner {
            height: 28px;
            background: #333333;
            color: #fff;
            border-color: #222222;
          }
        }

      }

      .zoom {
        .el-input__inner, .el-input-number__decrease, .el-input-number__increase {
          background: #333333;
          color: #fff;
          border-color: #222222;
        }
      }
    }
  }

  & > main {
    flex: 1;
    display: flex;
    max-height: calc(100% - 50px);
    overflow: hidden;

    & > header {
      width: 50px;
      background: #333333;
      color: #fff;
    }

    & > main {
      flex: 1;
    }

    & > footer {
      width: 300px;
      background: #333333;
      color: #ccc;

      & > header {
        margin: 0;
        padding: 10px;
        text-align: left;
      }
    }
  }
}

</style>