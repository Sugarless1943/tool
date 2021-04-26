<template>
  <el-dialog
      title="换热站关系树"
      :visible.sync="dialogVisible"
      :fullscreen="true"
      custom-class="staTree"
      :before-close="handleClose">
    <div id="staTree"></div>
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
      dom: document.getElementById("staTree")
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
      let myChart = echarts.init(document.getElementById("staTree"));

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
      myChart.setOption(options);
    },

    init() {
      let level_map = {}
      let root = {
        name: "root",
        children: []
      }
      this.data.forEach(item => {
        if (!level_map[item.level]) level_map[item.level] = []
        level_map[item.level].push(item)
      })

      let start = Object.keys(level_map).sort((a, b) => b - a)[0]
      let start_items = level_map[start]
      start_items.map(station => {
        root.children.push({
          name: station.name,
          children: this.setChidren(station)
        })
      })

      console.log(root)
      this.draw(root)

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
    }
  }
}
</script>

<style lang="scss">
  .staTree {
    display: flex;
    flex-direction: column;

    .el-dialog__body {
      flex: 1;

      #staTree {
        height: 100%;
      }
    }
  }
</style>