import { Minutes } from './Duration';
import { Clock, FixedClock, SystemClock } from './Clock';
import { Formatter } from './Formatter';
import { Manipulator } from './Manipulator';
import { Measurer } from './Measurer';
import { Time, Timezone, UnixTimeStamp, UTC } from '../types/Time';
import { applyMixins } from '../util/mixin';

const Time = applyMixins<Clock, Time>(SystemClock, [Formatter, Manipulator, Measurer]);
const FixedTime = applyMixins<Clock, Time>(FixedClock, [Formatter, Manipulator, Measurer]);

export default {
  get Universal(): Time {
    return new Time();
  },
  Fixed: (to?: string | UnixTimeStamp, offset: Timezone = UTC): Time => {
    return new FixedTime(to && typeof to !== 'number' ? Date.parse(to) : to || Date.now(), offset);
  },
  Local(offset: Timezone = Minutes(new Date().getTimezoneOffset())): Time {
    return new Time(offset);
  },
};
