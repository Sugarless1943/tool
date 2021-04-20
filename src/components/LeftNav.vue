<template>
  <div id="leftNav">
    <section v-for="item in menu" :key="item.header">
      <ul>
        <li v-for="(tool,index) in item.main" :key="tool.title" :class="{'toolAct': tool.active}" :title="tool.title"
            @click="switchTool(tool,index)">
          <span>{{ tool.show }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import {Config} from '../tool/Config'
export default {
  name: "leftNav",
  data() {
    return {
      menu: Config
    }
  },

  methods: {
    switchTool(tool) {
      // debugger;
      if (tool.active) {
        tool.active = false
        this.$emit('btnClick', tool)
        return
      }
      this.menu.map(me => {
        me.main.map(item => {
          item.active = false
        })
      })

      tool.active = true
      console.log(JSON.stringify(tool,null,2), 'tool')
      this.$emit('btnClick', tool)
    },

    reset() {
      this.menu.map(me => {
        me.main.map(item => item.active = false)
      })
    }
  },

  watch: {}
}
</script>

<style lang="scss" scoped>
#leftNav {
  & > section {
    font-size: 14px;

    & > header {
      letter-spacing: 7px;
      height: 26px;
      line-height: 26px;
      text-align: left;
    }

    ul {
      margin: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      padding: 10px 0;
      //height: 150px;

      li {
        font-size: 16px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 5px;
        box-sizing: border-box;
        background: #444444;
        border: 1px solid #222222;
        margin-bottom: 10px;

        &:hover {
          cursor: pointer;
          background: #666666;
        }

        &:active {
          background: #222222;
        }
      }
    }
  }
}

.toolAct {
  background: #222222 !important;

  &:hover {
    background: #222222 !important;
  }
}
</style>