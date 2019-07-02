export default {
  methods: {
    getSeriesTimeDataArr({
      startTime,
      endTime,
      unit,
      value,
      timeDataMap
    }) {
      // endTime =
      //   endTime ||
      //   this.$_dayjs()
      //     .endOf("month")
      //     .add(1, "day")
      //     .format("YYYY-MM-DD 00:00:00");

      endTime = endTime || "2018-11-30 00:00:00";
      startTime = startTime || "2018-11-20 00:00:00";
      timeDataMap = timeDataMap || {};
      // startTime =
      //   startTime ||
      //   this.$_dayjs()
      //     .startOf("month")
      //     .format("YYYY-MM-DD 00:00:00");

      endTime = this.$_dayjs(endTime).set("millisecond", 0);
      startTime = this.$_dayjs(startTime).set("millisecond", 0);
      unit = unit || "MINUTE"; // minute , MINUTE
      unit = unit.toLowerCase(); // minute
      value = value || 15;
      var result = {};
      // var map = new Map();
      var result = [];
      while (startTime.isBefore(endTime)) {
        let timeStr = startTime.format("YYYY-MM-DD HH:mm:ss");
        // result[timeStr] =
        var value1 = NaN;
        if (timeDataMap.hasOwnProperty(timeStr)) {
          value1 = timeDataMap[timeStr];
        }
        result.push({
          name: timeStr,
          value: [timeStr, value1]
        });
        startTime = startTime.add(15, unit);
      }
      return result;
    }
  }
}
