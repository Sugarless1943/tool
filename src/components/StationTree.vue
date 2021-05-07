<template>
  <el-dialog
      :title="net + '网换热站关系树'"
      :visible.sync="dialogVisible"
      :fullscreen="true"
      custom-class="staTree"
      :before-close="handleClose">
    <div class="treeBlock">
      <i class="el-icon-refresh" @click="netExchange"></i>
      <div id="staTree"></div>
    </div>
  </el-dialog>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "StationTree",
  data() {
    return {
      dialogVisible: false,
      data: [],
      dom: document.getElementById("staTree"),
      net: 1,
      myChart: null
    }
  },

  methods: {
    open(data) {
      this.dialogVisible = true
      this.data = data
      this.$nextTick().then(() => {
        this.init()
      })
    },

    handleClose() {
      this.dialogVisible = false
    },

    draw(root) {
      this.myChart = echarts.init(document.getElementById("staTree"));

      let options = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',

            data: [root],

            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',

            symbolSize: 7,

            initialTreeDepth: -1,

            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 15
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },

            emphasis: {
              focus: 'descendant'
            },

            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      }
      this.myChart.setOption(options);
    },

    init() {
      let level_map = this.getLevelMap(this.net)
      if(Object.keys(level_map).length > 0) {
        let root = {
          name: "root",
          children: []
        }
        let start = Object.keys(level_map).sort((a, b) => b - a)[0]
        let start_items = level_map[start]
        start_items.map(station => {
          root.children.push({
            name: station.name,
            children: this.setChidren(station)
          })
        })

        // console.log(root)
        this.draw(root)
      }
    },

    getLevelMap(net) {
      let level_map = {}

      this.data.forEach(item => {
        if(item.net == net) {
          if (!level_map[item.level]) level_map[item.level] = []
          level_map[item.level].push(item)
        }
      })

      return level_map
    },

    setChidren(station) {
      if(station.children && station.children.length > 0) {
        return station.children.map(item => {
          let station = this.data.get(item)
          return {
            name: station.name,
            value: "",
            children: this.setChidren(station)
          }
        })
      }

      return []
    },

    netExchange() {
      this.net == 1 ? this.net = 2 : this.net = 1
      if(this.myChart) this.myChart.clear()
      this.init()
    }
  }
}
</script>

<style lang="scss">

    .staTree {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100%;

      .el-dialog__body {
        flex: 1;

        #staTree {
          height: 100%;
        }
      }

      .treeBlock {
        height: 100%;
        position: relative;

        i {
          font-size: 28px;
          position: absolute;
          left: calc(50% - 14px);
          z-index: 1;

          &:hover {
            cursor: pointer;
            color: #00B5D0;
          }
        }
      }
    }

</style>