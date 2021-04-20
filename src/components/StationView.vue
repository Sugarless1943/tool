<template>
  <div id="StaView">
    <ul>
      <li v-for="item in menu" :key="item.level" @click="choose(item)" :class="[{'StaAct':item.active}]">{{item.name}}</li>
      <li @click="refresh()"><i class="el-icon-refresh"></i></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "StationView",
  data() {
    return {
      menu: [
        {
          name: "二级",
          level: 2,
          active: false
        },
        {
          name: "三级",
          level: 3,
          active: false
        },
        {
          name: "管道",
          level: 9,
          active: false
        }
      ]
    }
  },

  methods: {
    choose(m) {
      m.active = !m.active
      this.$emit('view', m)
    },

    refresh() {
      this.init()
      this.$emit('view', 0)
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