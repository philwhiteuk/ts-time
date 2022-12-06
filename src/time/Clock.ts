import { Duration, Hours, Milliseconds } from './Duration';
import { Timezone, UnixTimeStamp, UTC } from '../types/Time';

export interface Clock {
  now(): UnixTimeStamp;
}

export abstract class Clock {
  private offset!: Timezone;
  protected origin: UnixTimeStamp;

  constructor(origin: UnixTimeStamp | Date | string, tz: Timezone) {
    if (typeof origin == 'number') {
      this.origin = origin;
    } else if (origin instanceof Date) {
      this.origin = origin.getTime();
    } else {
      const parsed = Date.parse(origin as string);
      if (!parsed) throw new Error(`could not parse date ${origin}`);
      this.origin = Date.parse(origin as string);
    }

    this.timezone = tz;
  }

  public now(): UnixTimeStamp {
    return this.time;
  }

  protected get time() {
    return Date.now() + this.timezone.milliseconds;
  }

  protected get timezone() {
    return this.offset;
  }

  protected set timezone(offset: Duration) {
    if (offset.lessThan(Hours(-12)) || offset.moreThan(Hours(12))) {
      throw new Error('timezone offset must be maximum +/- 12 hours');
    }

    if (!offset.isPrecise('minutes')) {
      throw new Error('timezone offset must be specified in minutes/hours');
    }

    this.offset = offset;
  }
}

export class SystemClock extends Clock {
  constructor(tz: Timezone = UTC) {
    super(Date.now(), tz);
  }
}

export class FixedClock extends Clock {
  constructor(at: Date | string | UnixTimeStamp = Date.now(), tz: Timezone = UTC) {
    super(at, tz);
  }

  protected get time() {
    return this.origin + this.timezone.milliseconds;
  }
}

export class TestingClock extends FixedClock {
  protected stubs: Duration[] = [];

  public advanceTime(ms: number) {
    this.origin += ms;
  }

  public stub(calls: Duration[]) {
    this.stubs = this.stubs.concat(calls);
  }

  protected get time() {
    this.origin += this.stubs.shift()?.milliseconds || 0;
    return this.origin + this.timezone.milliseconds;
  }
}
export const FixedMutableClock = TestingClock;

export class ClockStub extends TestingClock {
  constructor(...stubs: number[]) {
    super();
    this.stubs = stubs.map((ms, index) => Milliseconds(ms - (stubs[index - 1] || 0)));
  }
}
