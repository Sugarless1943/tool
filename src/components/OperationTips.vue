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
            <el-input v-model="item.lat" readonly></el-input>
            <el-input v-model="item.lng" readonly></el-input>
          </main>
        </li>
      </ul>
      <footer>
        <el-button type="info" @click="pathView">预览</el-button>
        <el-button type="primary" @click="pathSave">保存</el-button>
      </footer>
    </section>

  </div>
</template>

<script>
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
      this.optData = val
    },

    /**
     * 管道路径相关功能
     */
    pathView() {
      console.log(this.optData.path.courseList)
      this.optData.path.view()
    },

    delCourse(index) {
      this.optData.path.clanCourse()
      this.optData.path.courseList.splice(index, 1)
      this.optData.path.drawCourse()
    },

    pathSave() {
      this.optData.path.save()
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

  &>header {
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