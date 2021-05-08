<template>
  <div id="staCon">
    <main v-if="station != null">
      <el-form ref="form" size="mini" :model="station" label-width="55px">
        <el-form-item label="名称：">
          <el-input v-model="station.name"></el-input>
        </el-form-item>
        <el-form-item label="uid：">
          <el-input v-model="station.uid"></el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-input v-model="station.address[0]" style="margin-bottom: 5px" readonly></el-input>
          <el-input v-model="station.address[1]" readonly></el-input>
          <el-button type="primary" @click="move()" style="margin-top: 5px; width: 100%" :disabled="editing">修改地址 <i
              class="el-icon-loading" v-show="moving"></i></el-button>
        </el-form-item>
        <div class="paths" v-if="station.level == 1">
          <section v-if="station.paths.length > 0">
            <h6>路径</h6>
            <ul>
              <li v-for="(item,index) in station.paths" :key="item.to">
                <header>
                  <span>{{ getName(item.to) }}</span>
                  <span>
                  <i class="el-icon-edit" @click="editPath(index, 'paths')"></i>
                  <i class="el-icon-close" @click="delpath(index, 'paths')"></i>
              </span>
                </header>
                <footer>
                  <div>
                    <label>管径：</label>
                    <el-input v-model="item.diam"></el-input>
                  </div>
                  <div>
                    <label>管长：</label>
                    <el-input v-model="item.len"></el-input>
                  </div>
                </footer>
              </li>
            </ul>
          </section>
          <section v-if="station.net2_child.length > 0">
            <h6>二网一级换热站</h6>
            <ul>
              <li v-for="(item,index) in station.net2_child" :key="item.to">
                <header>
                  <span>{{ getName(item.to) }}</span>
                  <span>
                  <i class="el-icon-edit" @click="editPath(index, 'net2_child')"></i>
                  <i class="el-icon-close" @click="delpath(index, 'net2_child')"></i>
              </span>
                </header>
                <footer>
                  <div>
                    <label>管径：</label>
                    <el-input v-model="item.diam"></el-input>
                  </div>
                  <div>
                    <label>管长：</label>
                    <el-input v-model="item.len"></el-input>
                  </div>
                </footer>
              </li>
            </ul>
          </section>
        </div>
        <el-button v-if="station.level == 2 || station.level == 3" type="primary" @click="chiEdit()"
                   style="margin: 5px 0; width: 100%" :disabled="moving">编 辑 <i class="el-icon-loading"
                                                                                v-show="editing"></i></el-button>
        <el-button v-if="station.level == 2 || station.level == 3" type="primary" @click="saveEdit()"
                   style="margin: 5px 0; width: 100%" :disabled="!editing">保 存
        </el-button>
        <el-button type="danger" @click="delSta()" style="margin: 5px 0; width: 100%">删 除</el-button>
      </el-form>
    </main>
  </div>
</template>

<script>
import Base from '../tool/Base'
import Path from '../tool/Path'
import Marker from "../tool/Marker";
import {getConfig} from "../tool/Config";

export default {
  name: "StationConfig",

  data() {
    return {
      station: null,
      level: 1,
      editing: false,
      moving: false,


      markMousedown: () => {
        Base.component.map.addEventListener('mousemove', this.markMove)
      },

      markMouseup: e => {
        let latLng = this.station.marker.getPosition()
        this.station.address = [latLng.lng, latLng.lat]
        Base.component.map.removeEventListener('mousemove', this.markMove)
        this.station.pathView(true)
        this.station.net2_childView(true)
        // this.moving = false
        // this.refresh()
      },

      markMove: e => {
        this.station.label.setPosition(this.station.marker.getPosition())
      }
    }
  },

  methods: {
    getName(val) {
      return Base.component.stationMap.get(val) ? Base.component.stationMap.get(val).name : ''
    },

    delSta() {
      Base.stationDelete(this.station.id)
    },

    chiEdit() {
      this.editing = true
      this.station.childEdit()
    },

    saveEdit() {
      this.editing = false
      this.station.children = Base.setChildren(this.station, false)
      if (this.station.level > 1 && this.station.children.length == 0) {
        Base.stationDelete(this.station.id)
      } else {
        this.refresh()
      }
    },

    refresh() {
      Base.component.refresh()
      this.station.setConfig()
    },

    move() {
      if (this.moving) {
        this.moving = false
        this.refresh()
        return
      }
      Base.configBindRemove()
      Base.component.mapReset(false)
      this.station.marker.enableDragging()
      this.eventManager(true)
      this.moving = true
    },

    eventManager(create) {
      if (create) {
        this.station.marker.addEventListener('mousedown', this.markMousedown)
        this.station.marker.addEventListener('mouseup', this.markMouseup)
      } else {
        this.station.marker.removeEventListener('mousedown', this.markMousedown)
        this.station.marker.removeEventListener('mouseup', this.markMouseup)
      }
    },

    delpath(index, field) {
      this.station[field].splice(index, 1)
      this.station.reDraw()
    },

    editPath(index, field) {
      let path = new Path()
      path.courseList = this.station[field][index].course.map(item => {
        return new Marker([item[0], item[1]], path)
      })
      path.edit(this.station.id, this.station[field][index].to, field)
      Base.component.toolSwitch(getConfig({net: this.station.net, level: field == 'paths' ? 9 : 10}), path)
    }
  },

  watch: {
    station(val) {
      console.log('配置组件中的换热站', val)
    }
  },

  destroyed() {
    this.eventManager(false)
  }
}
</script>

<style lang="scss">
#staCon {
  height: 100%;

  main {
    padding: 10px;
    box-sizing: border-box;
    height: 100%;
  }

  .el-form {
    padding: 5px 10px;
    background: #46494B;
    border: 1px solid #666666;
    box-shadow: 5px 5px 5px #444444;
    border-radius: 5px;
    height: 100%;

    label {
      color: #fff;
    }

    .el-input {

      .el-input__inner {
        height: 28px;
        background: #333333;
        color: #fff;
        border-color: #222222;
      }
    }

    .paths {
      max-height: calc(100% - 250px);
      overflow-y: auto;
    }

    h6 {
      margin: 10px 0;
    }

    ul {
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        background: #2B2B2B;
        margin-bottom: 15px;
        border: 1px solid #2B2B2B;
        border-radius: 5px;

        &:last-child {
          margin-bottom: 5px;
        }

        header {
          display: flex;
          justify-content: space-between;
          background: #3C3F41;
          margin-bottom: 5px;
          padding: 5px;
          border-radius: 5px 5px 0 0;

          i {
            margin-left: 5px;

            &:hover {
              cursor: pointer;
              color: #F56C6C;
            }
          }

          & > div {
            flex: 1;
          }
        }

        header > div, footer > div {
          display: flex;

          label {
            width: 50px;
          }

          .el-input {
            width: 65px;
          }
        }

        & > main {
          padding: 0;

          ul {
            padding: 0;
            margin: 0;

            li {
              margin-bottom: 5px;
              display: flex;
            }
          }
        }

        footer {
          display: flex;
          justify-content: space-between;
          padding: 5px;
        }
      }
    }
  }
}

</style>