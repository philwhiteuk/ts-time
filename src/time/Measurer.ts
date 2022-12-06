import { Duration, Milliseconds } from './Duration';
import { GConstructor } from '../util/mixin';
import { Time } from '../types/Time';
import { Clock } from './Clock';

export interface Measurer {
  readonly elapsed: Duration;
  until(time: Time): Duration;
}

export function Measurer(Base: GConstructor<Clock>): GConstructor<Clock & Partial<Time>> {
  return class TrackerMixin extends Base implements Measurer {
    public get elapsed() {
      return Milliseconds(this.now() - this.origin - this.timezone.milliseconds);
    }

    public until(time: Time): Duration {
      return Milliseconds(time.now() - this.now());
    }
  };
}
