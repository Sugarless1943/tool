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
          <i class="el-icon-aim go" @click="drawMap"></i>
        </section>
<!--        <section class="zoom">-->
<!--          <label>zoom：</label>-->
<!--          <el-input-number v-model="zoomNum" :min="1" :max="20" size="mini" label="描述文字"></el-input-number>-->
<!--        </section>-->
        <section>
          <el-button type="primary" @click="mapStyleSwitch"><i class="el-icon-location-information"></i></el-button>
          <el-button type="primary" @click="labelSwitch"><i class="el-icon-postcard"></i></el-button>
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
    <StationTable ref="staTable" @close="init"></StationTable>
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
import Path from '../tool/Path'
import Marker from '../tool/Marker'
import StationTable from "./StationTable";
import View from '../tool/View'
import StationTree from "./StationTree";
import StationServer from "../tool/StationServer";

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
          if(children.length == 0) return
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
      path: null,
      mapStyle: false,
      labelShow: true
    }
  },

  methods: {
    drawMap() {
      console.log('draw')
      let point = new window.BMapGL.Point(this.center[0], this.center[1]);
      this.map.centerAndZoom(point, this.zoomNum);
      this.map.enableScrollWheelZoom(true);
      this.mapStyleChange()
    },

    mapStyleSwitch() {
      this.mapStyle = !this.mapStyle
      this.mapStyleChange()
    },

    labelSwitch() {
      this.labelShow = !this.labelShow
      if(this.labelShow) {
        this.refresh()
      }else {
        this.stations.map(item => {
          this.map.removeOverlay(item.label)
        })
      }
    },

    mapStyleChange() {
      this.map.setMapStyleV2({styleId: this.mapStyle ? '' : 'c522f15ba9feaa78df940823e01dc1f4'})
    },

    refresh() {
      console.log('refresh')
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
      console.log(this.stations, 'stations')
      this.stations.map(item => {
        item.draw()
        this.stationMap.set(item.id, item)
      })
      this.mapReset(true)
      this.pathReset()
      this.station_choose = null
    },

    /**
     * 左侧导航栏点击
     * @param val 按钮相关配置
     * @param obj 由其他地方点过来可能会触发的一些配置
     */
    toolSwitch(val, obj) {
      //点击了哪个按钮
      console.log('按钮', val, obj)
      if (val.active) {
        this.stationFresh()
        this.choose = val
        //取消初始状态的两个事件
        this.mapReset(false)
        Base.configBindRemove()
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
            this.pathMarker(obj)
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

    pathMarker(path = new Path()) {
      if(path.startId && path.endId) Path.path_Edit = path
      Base.stationsMarkInit()
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
      Path.path_Edit = null
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
      StationServer.findAll().then(res => {
        this.stations = [{"id":1618453784620,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.89979112753075,37.0497991380632],"fat":null,"children":[],"paths":[],"net2_child":[]},{"id":1618453786003,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.89231722568772,37.0464579820624],"fat":null,"children":[],"paths":[],"net2_child":[]},{"id":1618453787435,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.89425756558927,37.05342815666865],"fat":null,"children":[],"paths":[],"net2_child":[]},{"id":1617776516290,"level":1,"name":"1号","net":1,"uid":"","address":["111.96915115563008",37.04357755610032],"fat":1617860706542,"children":[],"paths":[{"to":1617788147083,"course":[[111.90079722970192,37.05014476642387],[111.90474977394582,37.03873819230871]],"diam":0,"len":0},{"to":1617776518086,"course":[[111.95979793559727,37.02104882348492],[111.94456267414805,37.01574696563593],[111.9097084203609,37.020126788054895],[111.92832131052764,37.03424421876822]],"diam":0,"len":0}],"net2_child":[]},{"id":1617776518086,"level":1,"name":"2号","net":1,"uid":"","address":[111.89864129647798,37.042482965329114],"fat":1617860706542,"children":[],"paths":[],"net2_child":[]},{"id":1617788147083,"level":1,"name":"3号","net":1,"uid":"","address":[111.90661824940658,37.04409604090944],"fat":1617860706542,"children":[],"paths":[],"net2_child":[]},{"id":1617860706542,"level":2,"name":"二级","net":1,"uid":"","address":[111.90022231417554,37.04559386584936],"fat":1617871167991,"children":[1617776516290,1617776518086,1617788147083],"paths":[],"net2_child":[]},{"id":1617860729732,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.889011461411,37.0311904682933],"fat":1617871122220,"children":[],"paths":[],"net2_child":[]},{"id":1617860731447,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.89928807644516,37.03251569597538],"fat":1617871122220,"children":[],"paths":[],"net2_child":[]},{"id":1617871122220,"level":2,"name":"换热站(未命名)","net":1,"uid":"","address":[111.89540739664204,37.033495197096876],"fat":1617871167991,"children":[1617860729732,1617860731447],"paths":[],"net2_child":[]},{"id":1617871124657,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.87830365973207,37.04305906771935],"fat":1617871133704,"children":[],"paths":[],"net2_child":[]},{"id":1617871126026,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.87147653785624,37.0347627678678],"fat":1617871133704,"children":[],"paths":[],"net2_child":[]},{"id":1617871127618,"level":1,"name":"换热站(未命名)","net":1,"uid":"","address":[111.88261552617996,37.03637600889285],"fat":1617871133704,"children":[],"paths":[],"net2_child":[]},{"id":1617871133704,"level":2,"name":"换热站(未命名)","net":1,"uid":"","address":[111.87665077759371,37.038046829225266],"fat":1617871167991,"children":[1617871124657,1617871126026,1617871127618],"paths":[],"net2_child":[]},{"id":1617871167991,"level":3,"name":"换热站(未命名)","net":1,"uid":"","address":[111.89274841233251,37.04012089942661],"fat":null,"children":[1617860706542,1617871122220,1617871133704],"paths":[],"net2_child":[]},{"id":1619592389352,"level":1,"name":"串test","net":1,"uid":"","address":[111.91526128474645,37.020859341805725],"fat":null,"children":[],"paths":[{"to":1617860731447,"course":[[111.91687468658628,37.0293426411569],[111.90228620510423,37.027902114480995]],"diam":0,"len":0,"color":"blue"}],"net2_child":[{"to":1619592413108,"course":[[111.91791009886974,37.012961489389866],[111.91798196331054,37.007255601577334]],"diam":0,"len":0,"color":"red"},{"to":1619592414976,"course":[[111.92689315396952,37.01549730084203],[111.93055824045022,37.012615690306475]],"diam":0,"len":0,"color":"red"}]},{"id":1619592411104,"level":1,"name":"aaa","net":2,"uid":"","address":[111.90066263307816,37.01342255236568],"fat":null,"children":[],"paths":[],"net2_child":[]},{"id":1619592413108,"level":1,"name":"bbb","net":2,"uid":"","address":[111.91503552123781,37.00350907664323],"fat":null,"children":[],"paths":[],"net2_child":[]},{"id":1619592414976,"level":1,"name":"ccc","net":2,"uid":"","address":[111.93609180239169,37.00909997620766],"fat":null,"children":[],"paths":[],"net2_child":[]}].map(item => {
          return new Station(item)
        })
        this.map = new window.BMapGL.Map("container");
        Base.component = this
        this.drawMap()
      })
    },

    pathSave() {
      console.log('pathSave')
    },

    save() {
      // console.log(this.stations)
      let res = this.stations.map(({
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
      })
      console.log(JSON.stringify(res), null, 2)
      StationServer.save(res).then(() => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '保存失败!'
        })
      })
      // localStorage.setItem('req', JSON.stringify(res))
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
      this.$refs.staTable.open()
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

  .go {
    margin: 10px;
    &:hover {
      cursor: pointer;
      color: #00B5D0;
    }
  }
}

</style>