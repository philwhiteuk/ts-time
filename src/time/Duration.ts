export class Duration {
  constructor(public readonly milliseconds: number) {}

  from(start: number): Date {
    return new Date(start + this.milliseconds);
  }

  add(duration: Duration): Duration {
    return new Duration(this.milliseconds + duration.milliseconds);
  }

  subtract(duration: Duration): Duration {
    return new Duration(this.milliseconds - duration.milliseconds);
  }

  moreThan(age: Duration): boolean {
    return this.milliseconds > age.milliseconds;
  }

  lessThan(age: Duration): boolean {
    return this.milliseconds < age.milliseconds;
  }

  equalTo(age: Duration): boolean {
    return this.milliseconds === age.milliseconds;
  }

  isPrecise(to: 'seconds' | 'minutes' | 'hours') {
    const isInteger = (d: number) => Number.isInteger(d);
    switch (to) {
      case 'seconds':
        return isInteger(this.seconds);
      case 'minutes':
        return isInteger(this.minutes);
      case 'hours':
        return isInteger(this.hours);
    }
  }

  get seconds() {
    return this.milliseconds / 1000;
  }

  get minutes() {
    return this.milliseconds / 1000 / 60;
  }

  get hours() {
    return this.milliseconds / 1000 / 60 / 60;
  }

  get days() {
    return this.milliseconds / 1000 / 60 / 60 / 24;
  }

  get nights() {
    return this.days;
  }
}

export type Hours = Duration;
export const Hours = (hours: number) => new Duration(hours * 60 * 60 * 1000);

export type Minutes = Duration;
export const Minutes = (minutes: number) => new Duration(minutes * 60 * 1000);

export type Seconds = Duration;
export const Seconds = (seconds: number) => new Duration(seconds * 1000);

export type Milliseconds = Duration;
export const Milliseconds = (ms: number) => new Duration(ms);

export type Days = Duration;
export const Days = (days: number) => new Duration(days * 24 * 60 * 60 * 1000);

export type Nights = Duration;
export const Nights = (nights: number) => Days(nights);
