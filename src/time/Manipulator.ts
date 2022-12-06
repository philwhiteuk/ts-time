import { GConstructor } from '../util/mixin';
import { Duration } from './Duration';
import Time from './Time';
import { Time as ITime, UnixTimeStamp } from '../types/Time';
import { Clock } from './Clock';

export interface Manipulator {
  add(duration: Duration): ITime;
  subtract(duration: Duration): ITime;
}

export function Manipulator(Base: GConstructor<Clock>): GConstructor<Clock & Partial<ITime>> {
  return class ManipulatorMixin extends Base implements Manipulator {
    public add(duration: Duration): ITime {
      return this.create(this.now() - this.timezone.milliseconds + duration.milliseconds);
    }

    public subtract(duration: Duration): ITime {
      return this.create(this.now() - this.timezone.milliseconds - duration.milliseconds);
    }

    private create(calculated: UnixTimeStamp) {
      return Time.Fixed(calculated, this.timezone);
    }
  };
}
