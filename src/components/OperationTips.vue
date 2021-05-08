<template>
  <div id="OpeTips">
    <header>操作提示</header>
    <ol>
      <li v-for="item in tip" :key="item">{{ item }}</li>
    </ol>
    <section v-if="opt == 'pathOpt' && optData != null" id="pathOpt">
      <ul>
        <li v-for="(item,index) in optData.path.courseList" :key="index">
          <header>
            <span>{{ index + 1 }}</span>
            <i class="el-icon-close" @click="delCourse(index)"></i>
          </header>
          <main>
            <el-input v-model="item.lat" @input="markChange(item)"></el-input>
            <el-input v-model="item.lng" @input="markChange(item)"></el-input>
          </main>
        </li>
      </ul>
      <footer>
        <el-button type="primary" @click="pathView">预览</el-button>
        <el-button type="primary" @click="pathSave">保存</el-button>
      </footer>
    </section>

  </div>
</template>

<script>
import Marker from "../tool/Marker";

export default {
  name: "OperationTips",
  prop: ["choose", "tipsData"],
  data() {
    return {
      tip: [],
      buttons: [],
      opt: null,
      optData: null
    }
  },

  methods: {
    choose(val) {
      // console.log(val)
      this.tip = val.tip
      this.buttons = val.buttons
      this.opt = val['opt']
    },

    setOptData(val) {
      if (val.path) {
        let path = val.path
        if (path.startId != null && path.endId != null) this.pathInit(path)
      }
      this.optData = val
    },

    pathInit(path) {
      path.editInit().then(_ => {
        path.drawCourse()
        path.view()
      })
    },

    /**
     * 管道路径相关功能
     */
    pathView() {
      this.optData.path.view()
    },

    markChange(item) {
      if (item.lat != "" && this.existNum(item.lat) && item.lng != "" && this.existNum(item.lng)) {
        this.optData.path.reDrawCourse(item)
      }
    },

    delCourse(index) {
      this.optData.path.clanCourse()
      this.optData.path.courseList.splice(index, 1)
      this.optData.path.drawCourse()
    },

    pathSave() {
      let inputs = document.querySelectorAll("#pathOpt input")
      let flag = true
      let errNums = new Set()
      inputs.forEach((item, index) => {
        if (!this.existNum(item.value)) {
          flag = false
          errNums.add(Math.floor(index / 2) + 1)
        }
      })

      if (flag) {
        this.optData.path.save()
      } else {
        this.$message({
          type: 'error',
          message: `位置规则错误，请校验${[...errNums].join(',')}组规则`
        })
      }
    },

    existNum(val) {
      return val != "" && val != null && val != undefined && !isNaN(val * 1) && typeof (val * 1) == 'number'
    }

  },

  mounted() {
    console.log(this.tipsData)
  },

  watch: {
    choose(val) {
      console.log('tip:' + val)
    },

    tipsData(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">
#OpeTips {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  ol {
    margin: 0 0 10px;

    li {
      text-align: left;
      margin-bottom: 5px;
    }
  }

  & > header {
    margin-bottom: 10px;
  }
}

#pathOpt {
  flex: 1;
  overflow: hidden;
  max-height: calc(100% - 100px);

  ul {
    padding: 0;
    margin: 0 0 5px 0;
    list-style: none;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100% - 50px);

    li {
      background: #2B2B2B;
      margin-bottom: 15px;
      border: 1px solid #2B2B2B;
      border-radius: 5px;

      header {
        display: flex;
        justify-content: space-between;
        background: #3C3F41;
        padding: 5px 10px;
        border-radius: 5px 5px 0 0;

        i {
          margin-left: 5px;

          &:hover {
            cursor: pointer;
            color: #F56C6C;
          }
        }
      }

      main {
        .el-input {

          .el-input__inner {
            height: 28px;
            background: #333333;
            color: #fff;
            border-color: #222222;
          }
        }

      }
    }
  }
}
</style>