/**
 * functionName formatDate;
 * Return String
 * @parma dataeFormat
 * @parma fancyFormat 
 * @parma ts // 时间搓 毫秒 
 * @param  Object  file object
 * 
 */

// formatDate = function(file, ts, fancyFormat, dateFormat) {
//  // var self = this, 
//    ts   = ts || file.ts, 
//    var i18 = {
//      en : {
//          translator      : '',
//          language        : 'English',
//          direction       : 'ltr',
//          dateFormat      : 'd.m.Y H:i',
//          fancyDateFormat : '$1 H:i',
//          messages        : {}
//      },
//      months : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//      monthsShort : ['msJan', 'msFeb', 'msMar', 'msApr', 'msMay', 'msJun', 'msJul', 'msAug', 'msSep', 'msOct', 'msNov', 'msDec'],

//      days : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
//      daysShort : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
//    },
//    date, format, output, d, dw, m, y, h, g, i, s;

//  if (ts > 0) {

//    date = new Date(ts);
//    // date = new Date(ts);

//    h  = date.getHours();
//    g  = h > 12 ? h - 12 : h;
//    i  = date.getMinutes();
//    s  = date.getSeconds();
//    d  = date.getDate();
//    dw = date.getDay();
//    m  = date.getMonth() + 1;
//    y  = date.getFullYear();

//    var todayTs = new Data().getTime();
//    var yesterdayTs = todayTs - 86400*1000;
//    format = ts >= yesterday ? fancyFormat  : dateFormat;

//    output = format.replace(/[a-z]/gi, function(val) {
//      switch (val) {
//        case 'd': return d > 9 ? d : '0'+d;
//        case 'j': return d;
//        case 'D': return i18.daysShort[dw];
//        case 'l': return i18.days[dw];
//        case 'm': return m > 9 ? m : '0'+m;
//        case 'n': return m;
//        case 'M': return i18.monthsShort[m-1];
//        case 'F': return i18.months[m-1];
//        case 'Y': return y;
//        case 'y': return (''+y).substr(2);
//        case 'H': return h > 9 ? h : '0'+h;
//        case 'G': return h;
//        case 'g': return g;
//        case 'h': return g > 9 ? g : '0'+g;
//        case 'a': return h > 12 ? 'pm' : 'am';
//        case 'A': return h > 12 ? 'PM' : 'AM';
//        case 'i': return i > 9 ? i : '0'+i;
//        case 's': return s > 9 ? s : '0'+s;
//      }
//      return val;
//    });

//    return ts >= this.yesterday
//      ? output.replace('$1', this.i18n(ts >= this.today ? 'Today' : 'Yesterday'))
//      : output;

//  } else if (file.date) {
//    return file.date.replace(/([a-z]+)\s/i, function(a1, a2) { return a2+' '; });
//  }

//  return 'dateUnknown';
// }
export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
export default function(format, ts) {
  var ts = ts || new Date().getTime(), date = new Date(ts), 
    output, d, dw, m, y, h, g, i, s;
    // hh,mm,ss,DD,MM,YYYY
  h = date.getHours();
  g = h > 12 ? h - 12 : h;
  i = date.getMinutes();
  s = date.getSeconds();
  d = date.getDate();
  dw = date.getDay();
  m = date.getMonth() + 1;
  y = date.getFullYear();

  output = format.replace(/hh|mm|ss|DD|MM|YYYY|[a-z]/gi, function(val) {
    switch (val) {
      //新增规则
      case 'YYYY':
        return y;  
      case 'MM':
        return m > 9 ? m : '0' + m;
      case 'DD':
        return d > 9 ? d : '0' + d;
      case 'hh':
        return h > 9 ? h : '0' + h;
      case 'mm':
        return i > 9 ? i : '0' + i;
      case 'ss':
        return  s > 9 ? s : '0' + s;
      // 旧规则
      case 'd':
        return d > 9 ? d : '0' + d;
      case 'j':
        return d;
      case 'D':
        // return i18.daysShort[dw];
        return formatNumber(dw);
      case 'l':
        // return i18.days[dw];
        return formatNumber(dw);
      case 'm':
        return m > 9 ? m : '0' + m;
      case 'n':
        return m;
      case 'M':
        // return i18.monthsShort[m - 1];
        return formatNumber(m - 1);
      case 'F':
        // return i18.months[m - 1];
        return formatNumber(m - 1);
      case 'Y':
        return y;
      case 'y':
        return ('' + y).substr(2);
      case 'H':
        return h > 9 ? h : '0' + h;
      case 'G':
        return h;
      case 'g':
        return g;
      case 'h':
        return g > 9 ? g : '0' + g;
      case 'a':
        return h > 12 ? 'pm' : 'am';
      case 'A':
        return h > 12 ? 'PM' : 'AM';
      case 'i':
        return i > 9 ? i : '0' + i;
      case 's':
        return s > 9 ? s : '0' + s;

    }
    return val;
  });
    
  // console.log('output', output)
  return output

}
