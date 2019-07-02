const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const monthNamesShort = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const dayNamesShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export default class HjStandardDateUtils {
  constructor(date, format) {
    this.date = new Date();
    if(this.validateDateFormate(date).validate){
      this.date = new Date(date);
    }
    this.format = format;
  }
  setDate(date) {
    if(this.validateDateFormate(date).validate){
      this.date = new Date(date);
    }else if(this.validateDateFormate(date).isFalsy){
      this.date = new Date();
    }
  }
  validateDateFormate (date){
    var result = {validate: false, isFalsy: false}
    if (!date) {
      console.log('date is falsy')
      result.isFalsy = true;
      return result;
    }

    if ((date instanceof String )|| ((+date) instanceof Number)) {
      try {
        var testDate = new Date(date);
      } catch (e) {
        console.error('date is error format, date parmas must be string or Date instance')
        return false
      }
      result.validate = true;
      return result
    } else if (date instanceof Date) {
      result.validate = true;
      return result
    } else {
      console.error('date is error format, date parmas must be string or Date instance')
      return result
    }
  }
  formatDate(dateFormat = 'yyyy-mm-dd', date) {
    if(!date){}
    date = new Date(date)
    const year = date.getFullYear()
    const month = date.getMonth()
    const month1 = month + 1
    const day = date.getDate()
    const weekDay = date.getDay()
    
    return this.dateFormat
      .replace(/yyyy/g, year)
      .replace(/yy/g, (year + '').substring(2))
      .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
      .replace(/m/g, month1)
      .replace(/MM/g, monthNames[month])
      .replace(/M/g, monthNamesShort[month])
      .replace(/dd/g, day < 10 ? '0' + day : day)
      .replace(/d/g, day)
      .replace(/DD/g, dayNames[weekDay])
      .replace(/D/g, dayNamesShort[weekDay])
  }
}
export function formatDate(date, dateFormat = 'yyyy-mm-dd') {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth()
  const month1 = month + 1
  const day = date.getDate()
  const weekDay = date.getDay()

  return dateFormat
    .replace(/yyyy/g, year)
    .replace(/yy/g, (year + '').substring(2))
    .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
    .replace(/m/g, month1)
    .replace(/MM/g, monthNames[month])
    .replace(/M/g, monthNamesShort[month])
    .replace(/dd/g, day < 10 ? '0' + day : day)
    .replace(/d/g, day)
    .replace(/DD/g, dayNames[weekDay])
    .replace(/D/g, dayNamesShort[weekDay])
}
