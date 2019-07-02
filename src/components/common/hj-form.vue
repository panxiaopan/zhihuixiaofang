<template>
  <div
    class="hj-dispatch-form__item"
    @click.stop="clickFormContainer"
  >

    <span
      v-if="currentConfig.socialUnitName.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.socialUnitName.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span>{{socialUnitNameLabel}}</span>
    <!-- <input v-if="currentConfig.socialUnitName.show" class="hj-dispatch-form__item__input hj-dispatch-form__item__input--socialUnitName" :class="{'hj-dispatch-form__item__input--unactive': currentConfig.socialUnitName.disabled,'hj-dispatch-form__item__input--active':!currentConfig.socialUnitName.disabled }"  v-model="socialUnitName" type="text" :disabled="currentConfig.socialUnitName.disabled"> -->
    <hjSearch
      ref="hjSearch1"
      :value="socialUnitName"
      :isReset="isReset"
      hjStyle="z-index:4"
      :disabled="currentConfig.socialUnitName.disabled"
      @select="socialUnitNameSelected"
    ></hjSearch>
    <!-- v-model.lazy="socialUnitName" -->

    <span
      v-if="currentConfig.deviceName.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.deviceName.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span>{{deviceNameLabel}}</span>
    <!-- <input v-if="currentConfig.deviceName.show" class="hj-dispatch-form__item__input hj-dispatch-form__item__input--deviceName" :class="{'hj-dispatch-form__item__input--unactive': currentConfig.deviceName.disabled,'hj-dispatch-form__item__input--active':!currentConfig.deviceName.disabled }" v-model="deviceName" type="text" :disabled="currentConfig.socialUnitName.disabled"> -->
    <hjSearch
      ref="hjSearch2"
      :value="deviceName"
      :isReset="isReset"
      hjStyle="z-index:3"
      search-url="devices"
      :disabled="deviceNameDisabled"
      :params="deviceParams"
      @select="deviceNameSelected"
      :proccessFun="proccessFun"
    ></hjSearch>
    <!-- v-model.lazy="deviceName" -->

    <div
      v-if="currentConfig.title.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.title.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span>{{titleLabel}}</div>
    <input
      v-if="currentConfig.title.show"
      class="hj-dispatch-form__item__input"
      :class="{'hj-dispatch-form__item__input--unactive': currentConfig.title.disabled,'hj-dispatch-form__item__input--active':!currentConfig.title.disabled }"
      v-model.lazy="title"
      type="text"
    >

    <div
      v-if="currentConfig.dateTime.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.dateTime.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span>{{dateTimeLabel}}</div>
    <!-- <input v-if="currentConfig.dateTime.show" class="hj-dispatch-form__item__input" v-model.lazy="dateTime" type="text"> -->
    <picker
      v-if="currentConfig.dateTime.show"
      mode="date"
      v-model.lazy="dateTime"
      @change="dateChange"
      style="width:100%;"
    >
      <view
        class="hj-dispatch-form__item__input"
        :class="{'hj-dispatch-form__item__input--unactive': currentConfig.dateTime.disabled,'hj-dispatch-form__item__input--active':!currentConfig.dateTime.disabled }"
        style="width:100%;"
      >
        {{dateTime}}
      </view>
    </picker>

    <div
      v-if="currentConfig.time.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.time.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span>{{timeLabel}}</div>
    <!-- <input v-if="currentConfig.time.show" class="hj-dispatch-form__item__input" v-model.lazy="time" type="text"> -->
    <picker
      v-if="currentConfig.time.show"
      mode="time"
      v-model.lazy="time"
      @change="timeChange"
      style="width:100%;"
    >
      <view
        class="hj-dispatch-form__item__input"
        :class="{'hj-dispatch-form__item__input--unactive': currentConfig.time.disabled,'hj-dispatch-form__item__input--active':!currentConfig.time.disabled }"
        style="width:100%;"
      >
        {{time}}
      </view>
    </picker>

    <div
      v-if="currentConfig.description.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.description.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span> {{descriptionLabel}}</div>
    <div
      style="position:relative; z-index:0;width:100%;margin-bottom: 20px;"
      v-if="currentConfig.description.show"
      :class="{'hj-dispatch-form__item__textarea--unactive': currentConfig.description.disabled,'hj-dispatch-form__item__textarea--active':!currentConfig.description.disabled }"
    >
      <textarea
        placeholder-style="position:relative;z-index: -1;transform:translateZ(0)"
        class="hj-dispatch-form__item__textarea"
        v-model.lazy="description"
        :placeholder="descriptionPlaceholder"
        name=""
        id=""
      ></textarea>
      <!-- :adjust-position="false" -->
    </div>

    <div
      v-if="currentConfig.attachments.show"
      class="hj-dispatch-form__item__label"
    >{{attachmentsLabel}}</div>
    <!-- <div class="hj-dispatch-form__item__add" @click="selectImage" hover-class="hj-dispatch-form__item__add--active">
    <wux-icon class="hj-dispatch-form__item__add__btn" type="ios-add"></wux-icon>
    </div>
    <div v-if="fileList.length" style="width: 100%;background-color: #fff;">
    <img v-for="file in fileList" :src="file.path" style="width: 44px;height:44px;margin-left:5px;margin-right: 5px;">
    </div> -->

    <wux-upload
      v-if="currentConfig.attachments.show"
      style="width: 100%;"
      progress
      :fileList="fileList"
      name="attachments"
      :url="uploadUrl"
      list-type="picture-card"
      :size-type="sizeType"
      :source-type="sourceType"
      @change="onChange"
      @success="onSuccess"
      @fail="onFail"
      @complete="onComplete"
      @progress="onProgress"
      @preview="onPreview"
      @remove="onRemove"
    >
      <wux-icon
        type="ios-add"
        @click="clickAdd"
      ></wux-icon>
    </wux-upload>

    <!-- <progress :percent="progressed" show-info /> -->

    <wux-white-space></wux-white-space>
    <wux-white-space></wux-white-space>
    <div
      v-if="currentConfig.maintainers.show"
      class="hj-dispatch-form__item__label"
    ><span
        v-if="currentConfig.maintainers.require"
        class="hj-dispatch-form__item__label--mark"
      >* </span>{{maintainersLabel}}</div>

    <!-- <wux-cell wux-class="hj-dispatch-form__item__wux_maintainers" v-if="currentConfig.maintainers.show" style="width:100%;font-size: 14px;" :title="maintainersName" isLink @click="select">
      <span class="hj-dispatch-form__item__input__ft" slot="footer">{{maintainersPlaceholder}}</span>
    </wux-cell> -->

    <div
      v-if="currentConfig.maintainers.show"
      class="hj-dispatch-form__item__cell"
      hover-class="wux-cell--hover"
    >
      <div class="hj-dispatch-form__item__cell__title hj-dispatch-form__item__cell__title--left">
        <input
          v-model="maintainerSearchStr"
          type="text"
          :placeholder="maintainerPlaceholder"
          style="font-family: PingFang-SC-Medium;font-size: 18px;"
          placeholder-class="hj-dispatch-form__item__cell__title--placeholder"
        >
        <!-- {{maintainersName}} -->
      </div>
      <div
        class="hj-dispatch-form__item__cell__title hj-dispatch-form__item__cell__title--right"
        @click="select"
      >
        <span class="hj-dispatch-form__item__input__ft">{{maintainersPlaceholder}} &nbsp;</span>
        <wux-icon
          type="ios-arrow-forward"
          size="20"
          color="rgba(99, 99, 99, 1)"
          style="vertical-align:top;"
        ></wux-icon>
        &nbsp;
      </div>
    </div>
    <wux-white-space size="default"></wux-white-space>
    <wux-white-space size="default"></wux-white-space>
    <wux-white-space size="default"></wux-white-space>
    <wux-row style="width:100%;">
      <!-- <wux-col
        span="5"
        push="0"
      >
        <button
          class="hj-dispatch-form__item__cancel_btn"
          @click="reset(true)"
        >{{resetText}}</button>
      </wux-col> -->
      <wux-col
        span="12"
        push="0"
      >
        <button
          class="hj-dispatch-form__item__confirm_btn"
          @click="confirm"
        >{{confirmText}}</button>
      </wux-col>
    </wux-row>
    <!-- <picker-view indicator-style="height: 50px;" mask-style="background-color: rgba(0,0,0,0.2)" style="width: 100%; height: 300px;" :value="value" @change="bindChange">
      <picker-view-column>
        <view v-for="item in years" :key="item" style="line-height: 50px">{{item}}年</view>
      </picker-view-column>
    </picker-view> -->

    <wux-select
      id="wux-select-form"
      v-if="isShowSelect"
    ></wux-select>
    <wux-toptips id="wux-toptips1" />
  </div>
</template>
<script>
// socialUnitId	是	int	关联社会单位ID
// deviceId	是	int	关联设备ID
// description	是	string	隐患描述
// foundTime	否	date	隐患发现时间
// attachments	否	file[]	附件列表
import isEmpty from "lodash/isEmpty.js";
import { $wuxSelect, $wuxToptips, $hjSearch } from "@/utils/wux.js";
import merge from "lodash/merge.js";
import isEqual from "lodash/isEqual.js";
import clone from "lodash/clone.js";
import submitImage from "@/mixins/submitImage.js";
import hjSearch from "@/components/common/hj-search.vue";
import API from '@/store/flyio/apiUrl/home.js';
// console.log('clone', clone(33));
export default {
  name: "trouble-dispatch-list",
  mixins: [submitImage],
  components: {
    hjSearch
  },
  props: {
    isReset: {
      type: [String, Number, Boolean],
      default: false
    },
    resetText: {
      type: String,
      default: "重置"
    },
    confirmText: {
      type: String,
      default: "确定"
    },
    config: {
      type: Object,
      default: _ => null
    },
    fileType: {
      type: String,
      default: "efm-workorder"
    }
  },
  data() {
    var defaultConfig = {
      socialUnitName: {
        show: true,
        require: false,
        value: "",
        label: "社会单位",
        message: "请输入社会单位",
        disabled: true
      },
      deviceName: {
        show: true,
        require: false,
        value: "",
        label: "设备名称",
        message: "请输入设备名称",
        disabled: true
      },
      title: {
        show: true,
        require: true,
        value: "",
        label: "标题",
        message: "请输入标题",
        disabled: false
      },
      dateTime: {
        show: false,
        require: false,
        value: "",
        label: "日期",
        message: "请选择日期",
        disabled: false
      },
      time: {
        show: false,
        require: false,
        value: "",
        label: "时间",
        message: "请选择时间",
        disabled: false
      },
      description: {
        show: true,
        require: false,
        value: "",
        label: "描述",
        message: "请输入描述",
        placeholder: "",
        // showPlaceholder: true,
        disabled: false
      },
      attachments: {
        show: true,
        require: false,
        value: "",
        label: "添加附件",
        message: "",
        disabled: false
      },
      maintainers: {
        show: true,
        require: true,
        value: [],
        label: "执行人",
        placeholder: "请选择执行人",
        // showPlaceholder: true,
        message: "请选择执行人",
        disabled: false
      }
    };
    return {
      isShowSelect: false,
      usersParams: { keyword: "" },
      maintainerSearchStr: "",
      oldMaintainerSearchStr: "",
      // deviceParams:null,
      selectedSocialUnitName: null,
      selectedDeviceName: null,

      defaultConfig,
      currentConfig: merge({}, defaultConfig),
      progressed: 0,
      imageUrl: "",
      // uploadUrl: 'https://www.skyvow.cn/api/common/file',
      uploadUrl: API.workOrders,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      file: "",
      fileList: [],

      socialUnitNameLabel: "社会单位",
      deviceNameLabel: "设备名称",
      titleLabel: "标题",
      dateTimeLabel: "日期",
      timeLabel: "时间",

      descriptionLabel: "描述",
      attachmentsLabel: "添加附件",
      maintainersLabel: "执行人",
      descriptionPlaceholder: "",
      maintainersPlaceholder: "请选择执行人",
      // fileList: [
      //   {
      //     uid: 0,
      //     status: 'uploading',
      //     url: 'http://pbqg2m54r.bkt.clouddn.com/qrcode.jpg'
      //   },
      //   {
      //     uid: 1,
      //     status: 'done',
      //     url: 'http://pbqg2m54r.bkt.clouddn.com/qrcode.jpg'
      //   },
      //   {
      //     uid: 2,
      //     status: 'error',
      //     url: 'http://pbqg2m54r.bkt.clouddn.com/qrcode.jpg'
      //   }
      // ],
      years: [2012, 2018],
      yearValue: 2018,

      socialUnitName: "",
      deviceName: "",
      description: "",
      title: "",
      dateTime: "",
      time: "",
      attachments: [],
      maintainers: [],
      maintainersName: "",
      maintainerList: [],
      maintainersMap: {},
      workOrderTypeList: ["risk", "patrol", "maintenance"],
      sourceTypeList: ["risk", "patrol", "maintenance", "workorder"]
    };
  },
  computed: {
    maintainerPlaceholder() {
      if (!this.maintainersName) {
        return "  搜索";
      } else {
        return "  " + this.maintainersName;
      }
    },
    deviceNameDisabled() {
      // if(){
      //   return false
      // }
      // return true
      return !(this.deviceParams && this.deviceParams.id);
    },
    deviceParams() {
      if (this.selectedSocialUnitName && this.selectedSocialUnitName.id) {
        return { id: this.selectedSocialUnitName.id };
      }
      return null;
    }
  },
  watch: {
    config: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal && newVal !== oldVal && !isEmpty(newVal)) {
          // Object.assign(this, newVal);
          this.maintainers = [];
          this.maintainerList = [];
          this.maintainersName = "";
          this.maintainerSearchStr = "";
          this.oldMaintainerSearchStr = "";
          this.usersParams.keyword = "";
          this.fileList = [];
          this.currentConfig = merge(merge({}, this.defaultConfig), newVal);
          // this.currentConfig = merge({}, this.defaultConfig, newVal);
          Object.keys(this.currentConfig).forEach(key => {
            if (key !== "attachments") {
              var currentItem = this.currentConfig[key];
              this[key] = currentItem.value;
              this[key + "Label"] = currentItem.label;
              if (currentItem.placeholder) {
                this[key + "Placeholder"] = currentItem.placeholder;
              }
            }
          });
        }
      }
      // deep: true
    },
    isReset: {
      immediate: true,
      handler: function(newVal, oldVal) {
        if (newVal) {
          this.reset();
        }
      }
    }
  },
  methods: {
    clickFormContainer(e) {
      console.log("this.$refs", this.$refs);
      // // console.log('clickFormContainer', e);
      // console.log('this.$refs', this.$refs);
      this.$refs.hjSearch1.clickContainer(e);
      this.$refs.hjSearch2.clickContainer(e);
      // $hjSearch('#hj-simple-search', this.$root.$mp.page).clickContainer();
    },
    clickAdd(e) {
      this.$root.$mp.appOptions.query.from = "addImage";
      console.log("clickAdd", e);
    },
    socialUnitNameSelected(option) {
      // this.selectedSocialUnitName = option;
      console.log("socialUnitNameSelected", option);
      this.selectedSocialUnitName = option;
      // this.deviceParams = {id: option.id};
      this.socialUnitName = option.name;

      console.log(
        "this.socialUnitName, this.deviceName",
        this.socialUnitName,
        this.deviceName
      );
    },
    deviceNameSelected(option) {
      console.log("deviceNameSelected", option);
      console.log(
        "this.socialUnitName, this.deviceName",
        this.socialUnitName,
        this.deviceName
      );

      this.selectedDeviceName = option;
      this.deviceName = option.name;
    },
    proccessFun(res) {
      return (res.data && res.data.rows) || [];
    },
    dateChange(e) {
      console.log("dateChange", e);
      this.dateTime = e.mp.detail.value;
    },
    timeChange(e) {
      console.log("timeChange", e);
      this.time = e.mp.detail.value;
    },
    bindChange(e) {
      console.log("bindChange", e);
    },
    // selectImage() {
    //   wx.chooseImage({
    //     count: 9,
    //     sizeType: ['original', 'compressed'],
    //     // sizeType: 'original',
    //     sourceType: ['album', 'camera'],
    //     // sourceType: 'camera',
    //     success: res => {
    //       // res.tempFiles // path, size
    //       this.fileList = res.tempFiles;
    //       console.log('success chooseImage', res);
    //     },
    //     fail: res => {
    //       console.log('fail chooseImage', res);
    //     },
    //     complete: res => {
    //       console.log('complete chooseImage', res);
    //     }
    //   });
    // },
    onChange(e) {
      // console.log('onChange', e);
      const { file, fileList } = e.mp.detail;
      if (file.status === "uploading") {
        // this.progressed = 0;
        // wx.showLoading()
        console.log("onChange uploading", e);
      } else if (file.status === "done") {
        // } else if (!!file.res) {
        // this.progressed = 0;

        // this.imageUrl = file.url;

        // this.fileList = fileList;
        console.log("onChange done", e);

        // this.fileList = fileList.map(item => {
        //   return merge({}, item);
        //   // return item;
        // });

        // var cloneFile = clone(file);
        // delete cloneFile.res;
        // this.fileList.push(cloneFile);
      } else {
        // this.progressed = clone(file.progress);
        // this.progressed = file.progress;
        // var progressed = +file.progress.toString();
        // this.progressed = progressed;
        console.log(
          "onChange unknown state",
          e
          // file.progress.valueOf(),
          // file.progress.toString()
        );
      }
      if (!isEqual(this.fileList, fileList)) {
        this.fileList = fileList.map(item => {
          return merge({}, item);
          // return item;
        });
        this.attachments = this.fileList.map(item => item.url);
      }
      // this.fileList = fileList.map(item => {
      //   return item;
      // });
    },
    onSuccess(e) {
      // 上传多张图片 此函数会调用多次
      console.log("onSuccess", e);
      // e.mp.detail.fileList
      // fileList: [] //res: 后台返回的数据 // status:"done" // uid:"wux-upload--1540782787213-2" // url: "http://tmp/wxbc47483790762e40.o6zAJszqP_lXqu7XQSPXvd2xEvoA.dWiyylXaWawK355ee4810185b0b7caa997cffbf0031e.jpg"
      // this.fileList = e.mp.detail.fileList;
    },
    onFail(e) {
      console.log("onFail", e);
    },
    onComplete(e) {
      console.log("onComplete", e);
      // this.progressed = 100;
      // this.$nextTick(() => {
      //   this.progressed = 0;
      // });
    },
    onProgress(e) {
      // console.log('onProgress', e);
      // console.log()
      // this.progressed = e.mp.detail.file.progress;
      // this.progressed = e.mp.detail.file.progress.valueOf();
      // this.progressed = +e.mp.detail.file.progress.toString();
      // if (+this.progressed >= 99) {
      //   return;
      // } else {
      //   this.progressed += 10;
      // }
    },
    onPreview(e) {
      console.log("onPreview", e);
      this.$root.$mp.appOptions.query.from = "previewImage";
      const { file, fileList } = e.mp.detail;
      wx.previewImage({
        current: file.url,
        urls: fileList.map(n => n.url)
      });
    },
    onRemove(e) {
      console.log("onRemove", e);

      const { file, fileList } = e.mp.detail;
      console.log(this.fileList === fileList);
      console.log(this.fileList);
      console.log("onRemove", e, fileList);
      this.fileList = fileList.map(item => item);
      // wx.showModal({
      //   content: '确定删除？',
      //   success: res => {
      //     if (res.confirm) {
      //       this.fileList = fileList.filter(n => n.uid !== file.uid);
      //     }
      //   }
      // });
    },
    select() {
      // if (!this.$wuxSelect) {
      //   this.$wuxSelect = $wuxSelect('#wux-select-form', this.$root.$mp.page);
      // }
      // this.openSelectList();

      if (this.isShowSelect) {
        this.isShowSelect = false;
      }

      wx.nextTick(() => {
        this.$nextTick(() => {
          this.nextOpenSelect();
        });
      });

      // this.openSelect();
    },
    processData(dataArr) {
      if (!dataArr || !dataArr.length) {
        return [];
      }
      // this.maintainersMap = new Map();
      return dataArr.map((item, index) => {
        var { id: value, name: title, tel, userType } = item;
        console.log("maintainersMap", value, title);
        // this.maintainersMap.set(value, title);
        // value = value+'';
        this.maintainersMap[value] = title;
        console.log("maintainersMap value", value);
        // console.log(this.maintainersMap.get(value));
        return { value, title, tel, userType, checked: true, color: "royal" };
      });
    },
    nextOpenSelect() {
      this.isShowSelect = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        wx.nextTick(() => {
          this.$nextTick(() => {
            this.openSelect();
          });
        });
      }, 500);
    },
    openSelect() {
      // if (!this.maintainerList || !this.maintainerList.length) {
      // this.openSelectList();
      // this.maintainerList = [];
      // var keyword = this.maintainerSearchStr || this.maintainersName;

      // if(this.usersParams.keyword == '' && this.oldMaintainerSearchStr == '' && this.maintainerSearchStr){
      //   this.usersParams.keyword = this.maintainerSearchStr
      // }else if(!this.usersParams.keyword&&this.usersParams.keyword == this.usersParams.keyword){
      //   this.usersParams.keyword = this.maintainerSearchStr
      // }

      if (!this.maintainerSearchStr) {
        this.usersParams.keyword = this.oldMaintainerSearchStr;
      } else {
        this.usersParams.keyword = this.maintainerSearchStr;
      }

      this.usersParams.keyword = this.usersParams.keyword.trim();
      if (
        this.usersParams.keyword == this.oldMaintainerSearchStr &&
        this.maintainerList.length
      ) {
        this.openSelectList();
        return;
      }

      this.$http("users", this.usersParams, { method: "get" })
        .then(res => {
          console.log("quest maintainerList success res", res);
          this.maintainerList = this.processData(res.data);
          if (this.maintainerList.length) {
            this.openSelectList();
          } else {
            $wuxToptips("#wux-toptips1", this.$root.$mp.page).error({
              text: "无包含该搜索字段的用户列表",
              duration: 3000
            });
          }
        })
        .catch(res => {
          var errTip = (res && res.head && res.head.message) || "";
          $wuxToptips("#wux-toptips1", this.$root.$mp.page).error({
            text: "搜索用户列表失败 " + errTip,
            duration: 3000
          });
          console.log("quest maintainerList fail res", res);
        });

      // } else {
      //   this.openSelectList();
      // }

      // this.openSelectList();
    },
    openSelectList() {
      // this.$wuxSelect.open({
      console.log("this.maintainers", this.maintainers);
      console.log("this.maintainerList", this.maintainerList);
      var selectedValueArr = this.maintainers.map(item => {
        // return item +''
        return item;
      });
      // 有可能是 $$mergeOptionsAndBindMethods 该方法merge的时候并未改变options的引用，导致子组件无法刷新 // 由于是浅复制，所以应该不是这个原因
      $wuxSelect("#wux-select-form", this.$root.$mp.page).open({
        value: selectedValueArr,
        multiple: true,
        options: this.maintainerList,
        onConfirm: (values, indexs, options) => {
          console.log("values, indexs, options", values, indexs, options);
          console.log(
            "this.maintainersMap",
            this.maintainersMap
            // this.maintainersMap.has(values[0]),
            // this.maintainersMap.get(values[0])
          );
          if (values && values.length && !isEqual(values, this.maintainers)) {
            // var maintainersName = '';
            this.maintainers = values;
            this.maintainersName = values
              .map(item => {
                console.log("onConfirm item", item);
                if (this.maintainersMap[item]) {
                  return this.maintainersMap[item];
                }
                return "";
              })
              .join(",");
          }
          this.oldMaintainerSearchStr = this.maintainerSearchStr.trim();
          this.maintainerSearchStr = "";

          // var valueObj = {};
          // options.forEach((option)=>{
          //   options.value
          // })

          // this.maintainersName = options[index].title;
          // index.forEach(i => {
          //   if (options[i]) {
          //     maintainersName = maintainersName
          //       ? maintainersName + ',' + options[i].title
          //       : options[i].title;
          //   }
          // });

          // this.maintainersName = maintainersName;
        }
      });
    },
    reset(isNotResetSelect) {
      console.log("start reset", this);
      console.log(
        "this.socialUnitName, this.deviceName",
        this.socialUnitName,
        this.deviceName
      );
      if (!this.currentConfig.socialUnitName.disabled) {
        this.socialUnitName = "";
        this.selectedSocialUnitName = null;
      }
      if (!this.currentConfig.deviceName.disabled) {
        this.deviceName = "";
        this.selectedDeviceName = null;
      }

      if (!this.currentConfig.dateTime.disabled) {
        this.dateTime = "";
      }
      if (!isNotResetSelect) {
        this.$wuxSelect = null;
        this.$wuxToptips = null;
      }

      this.dateTime = "";
      this.maintainers = [];
      this.maintainerList = [];
      this.maintainersName = "";
      this.maintainerSearchStr = "";
      this.oldMaintainerSearchStr = "";
      this.usersParams.keyword = "";
      this.fileList = [];
      this.description = "";
      this.title = "";
      this.$emit("reset");
      console.log("end reset", this);
    },
    validate() {
      console.log("validate this", this);

      // if (!this.$wuxToptips) {
      // this.$wuxToptips = $wuxToptips('#wux-toptips1', this.$root.$mp.page);
      // }

      this.$wuxToptips = $wuxToptips("#wux-toptips1", this.$root.$mp.page);

      var isNotValidated = Object.keys(this.currentConfig).some(key => {
        var currentItem = this.currentConfig[key];
        if (
          // currentItem.disabled&&
          currentItem.show &&
          currentItem.require &&
          ((Array.isArray(this[key]) && !this[key].length) || !this[key])
        ) {
          // if(Array.isArray(this[key])){
          // }else

          this.$wuxToptips &&
            this.$wuxToptips.error({
              text: currentItem.message,
              duration: 3000
            });

          // $wuxToptips('#wux-toptips1', this.$root.$mp.page).error({
          //     text: currentItem.message,
          //     duration: 3000
          //   });

          return true;
        }
        console.log("currentItem", currentItem);
        return false;
      });

      console.log("isNotValidated", isNotValidated);
      return !isNotValidated;
    },
    confirm() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.submit();
      }, 300);
    },
    submit() {
      if (!this.validate()) {
        return;
      }
      if (this.attachments && this.attachments.length) {
        this.submitImages({
          uploadUrl: API.upload,
          filePaths: this.attachments,
          formData: {
            type: this.fileType
          }
        })
          .then(res => {
            console.log("upload image success res", res);
            this.triggerConfirm(
              res
                .map(response => {
                  if (!response.head.code) {
                    return response.data;
                  } else {
                    return "";
                  }
                })
                .filter(f => !!f)
            );
          })
          .catch(res => {
            console.log("upload image faile res", res);
          });
      } else {
        this.triggerConfirm([]);
      }
    },
    triggerConfirm(attachments) {
      var dateTime = this.dateTime;
      if (this.currentConfig.time.show && !this.currentConfig.time.disabled) {
        dateTime = +this.time + ":00";
      }
      var params = {
        socialUnitNameOption: this.selectedSocialUnitName,
        deviceNameOption: this.selectedDeviceName,
        socialUnitName: this.socialUnitName,
        deviceName: this.deviceName,
        title: this.title,
        dateTime,
        description: this.description,
        maintainers: this.maintainers,
        attachments
        // attachments: clone(this.fileList)
        // maintainersName: this.maintainersName
      };
      this.$emit("confirm", params);
    },
    setTitle() {
      console.log("hjForm mounted setTitle");
      if (this.config && this.config.title && this.config.title.value) {
        this.title = this.config.title.value;
      }
    }
  },
  mounted() {
    console.log("hjForm mounted");
    // this.reset();
    this.setTitle();
  },
  destroyed() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
};
</script>
<style lang="scss" scoped>
.hj-dispatch-form__item {
  padding-left: 6px;
  padding-right: 6px;
  // padding-top: 10px;
  // padding: 12px 12px 45px 12px;
  // padding: 12px 12px 15px 12px;
  background-color: #f4f7fb;
  font-family: PingFang-SC-Medium;
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: start;
  // width: 100wh;
  height: 100%;
  box-sizing: border-box;
  &__label {
    // margin-top: 10px;
    margin-bottom: 5px;
    font-size: 18px;
    font-family: PingFang-SC-Medium;
    font-weight: 500;
    // color: rgba(99, 99, 99, 1);
    color: rgb(8, 8, 8);
    &--mark {
      color: red;
    }
  }
  &__input {
    width: 100%;
    // border-bottom: 1rpx solid rgba(102, 120, 233, 1);
    border-bottom: 1rpx solid #ddd !important;
    margin-bottom: 20px;
    &--active {
      color: #111;
      // border-bottom: 1rpx solid rgba(102, 120, 233, 1);
      border-bottom: 1rpx solid #ddd !important;
    }
    &--unactive {
      color: #ccc;
      border-bottom: 1rpx solid #ddd !important;
    }
    // &--socialUnitName {
    //   color: #ccc;
    //   border-bottom: 1rpx solid #ddd !important;
    //   // display: inline-block;
    //   // width: 75% !important;
    //   // margin-bottom: 0;
    // }
    // &--deviceName {
    //   color: #ccc;
    //   border-bottom: 1rpx solid #ddd !important;
    //   //   display: inline-block;
    //   //   width: 75% !important;
    //   //   margin-bottom: 0;
    // }
    &__ft {
      font-size: 16px;
      font-family: PingFang-SC-Medium;
      font-weight: 500;
      color: rgba(99, 99, 99, 1);
      // vertical-align: top;
    }
  }
  &__textarea {
    width: 100%;
    // border: 1rpx solid rgba(102, 120, 233, 1);
    // margin-bottom: 20px;
    position: relative;
    // transform: translateZ(0);
    z-index: 1;
    height: 72px;
    &--active {
      // border: 1rpx solid rgba(102, 120, 233, 1);
      border: 1rpx solid #ddd !important;
    }
    &--unactive {
      border: 1rpx solid #ddd !important;
    }
  }
  &__wux_maintainers {
    font-size: 18px;
    font-family: PingFang-SC-Medium;
    margin-left: -20px;
    margin-right: -20px;
    // width:100%;font-size: 14px;
  }
  &__add {
    width: 44px;
    height: 44px;
    text-align: center;
    background-color: #fff;
    &__btn {
      text-align: center;
      width: 44px;
      height: 44px;
      line-height: 44px;
      vertical-align: middle;
      background-color: #fff;
    }
    &--active {
      background-color: rgba(144, 144, 144, 0.4);
    }
  }
  &__cancel_btn {
    background-color: #fff;
    color: rgba(102, 120, 233, 1);
  }
  &__confirm_btn {
    background-color: rgba(102, 120, 233, 1);
    color: #fff;
  }

  &__cell {
    font-size: 18px;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fff;
    font-family: PingFang-SC-Medium;
    // margin-left: -20px;
    // margin-right: -20px;
    display: flex;
    width: 100%;
    align-items: center;
    &__title {
      &--placeholder {
        font-family: PingFang-SC-Medium;
        font-size: 18px;
      }
      &--left {
        min-width: 60%;
        flex-grow: 1;
      }
      &--right {
        min-width: 40%;
        flex-grow: 0;
        // text-align: right;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
}
</style>
