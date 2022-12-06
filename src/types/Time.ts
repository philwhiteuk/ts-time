// i.e. millis since epoch
import { Duration, Hours, Minutes } from '../time/Duration';
import { Clock } from '../time/Clock';
import { Manipulator } from '../time/Manipulator';
import { Measurer } from '../time/Measurer';
import { Formatter } from '../time/Formatter';

export type UnixTimeStamp = number;
// the timezone represented as the offset relative to GMT/UTC
export type Timezone = Duration;
export const Timezone = (offset: Minutes | Hours) => offset;
// total hours offset - can be expressed as GMT(+1), or GMT(-1) respectively
export const GMT = (offset?: number) => Timezone(Hours(offset || 0));
// universal timezone i.e. GMT+0
export const UTC = GMT(0);

export interface Time extends Clock, Manipulator, Measurer, Formatter {}
