import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear'
dayjs.extend(isLeapYear)
// console.log(dayjs('2000-01-01').isLeapYear());


import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
// console.log(dayjs('06/27/2018').week()) 

import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
// console.log('isBetween', dayjs('2010-10-20').isBetween('2010-10-19', dayjs('2010-10-25')));

import AdvancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(AdvancedFormat)
// console.log('AdvancedFormat', dayjs().format('Q Do k kk X x'))

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// console.log('relativeTime',dayjs().from(dayjs('1990')))
// console.log('relativeTime',dayjs().from(dayjs(), true))
// console.log('relativeTime',dayjs().fromNow())
// console.log('relativeTime',dayjs().to(dayjs()))
// console.log('relativeTime',dayjs().toNow())