<template>
  <div id="StaView">
    <ul>
      <li v-for="item in menu" :key="item.name" @click="choose(item)" :class="[{'StaAct':item.active}]">{{item.name}}</li>
      <li @click="refresh()"><i class="el-icon-refresh"></i></li>
    </ul>
  </div>
</template>

<script>
import Base from "../tool/Base";

export default {
  name: "StationView",
  data() {
    return {
      menu: [
        {
          name: "一网二级",
          net: 1,
          level: 2,
          active: false
        },
        {
          name: "一网三级",
          net: 1,
          level: 3,
          active: false
        },
        {
          name: "一网管道",
          net: 1,
          level: 9,
          active: false
        },
        {
          name: "一网串联",
          net: 1,
          level: 10,
          active: false
        },
        {
          name: "二网二级",
          net: 2,
          level: 2,
          active: false
        },
        {
          name: "二网管道",
          net: 2,
          level: 9,
          active: false
        }
      ]
    }
  },

  methods: {
    choose(item) {
      item.active = !item.active
      this.view(item)
    },

    refresh() {
      this.init()
      Base.component.refresh()
    },

    view(val) {
      if (val) {
        Base.component.stations.map(item => {
          switch (val.level) {
            case 2:
            case 3:
              if (item.level == val.level && item.net == val.net && item.children.length > 0) {
                item.circle(val.active)
              }
              break;
            case 9:
              if (item.net == val.net && item.paths.length> 0) {
                item.pathView(val.active)
              }
              break;
            case 10:
              if (item.net2_child.length > 0) {
                item.nth2_childView(val.active)
              }
              break;
            case 0:
              Base.component.refresh()
                  break
          }
        })
      } else {
        Base.component.stations.map(item => {
          item.viewClean()
        })
      }
    },

    init() {
      this.menu.map(item => {
        item.active = false
      })
    }
  },

  mounted() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  #StaView {
    ul {
      list-style: none;
      padding: 10px 0;
      margin: 0 10px;

      li {
        margin-bottom: 10px;
        line-height: 72px;
        border: 1px solid #666666;
        box-shadow: 5px 5px 5px #444444;
        border-radius: 5px;
        font-size: 20px;
        letter-spacing: 5px;

        &:hover {
          background: #666666;
          cursor: pointer;
        }
      }
    }
  }

  .StaAct {
    background: #666666;
  }
</style>