import { expect } from 'chai';
import { Milliseconds, Minutes, Seconds } from './Duration';
import { FixedClock, SystemClock } from './Clock';
import { GMT } from '../types/Time';
import { sleep } from './sleep';

describe('SystemClock', () => {
  it('tells the time', async () => {
    expect(new SystemClock().now()).to.eq(Date.now());
    await sleep(Milliseconds(100));
    expect(new SystemClock().now()).to.eq(Date.now());
  });

  it('tells the local time', () => {
    expect(new SystemClock(GMT(+1)).now()).to.eq(Date.now() + 60 * 60 * 1000);
    expect(new SystemClock(GMT(-1)).now()).to.eq(Date.now() - 60 * 60 * 1000);
  });

  it('exists in a timezone +/- 12 hours relative to GMT', () => {
    expect(() => new SystemClock(GMT(+13))).to.throw('timezone offset must be maximum +/- 12 hours');
    expect(() => new SystemClock(GMT(-13))).to.throw('timezone offset must be maximum +/- 12 hours');
    expect(() => new SystemClock(GMT(10))).not.to.throw('timezone offset must be specified in minutes/hours');
    expect(() => new SystemClock(Minutes(10))).not.to.throw('timezone offset must be specified in minutes/hours');
    expect(() => new SystemClock(Seconds(10))).to.throw('timezone offset must be specified in minutes/hours');
    expect(() => new SystemClock(Milliseconds(10))).to.throw('timezone offset must be specified in minutes/hours');
  });
});

describe('FixedClock', () => {
  it('always tells the same time', () => {
    const time = 0;
    expect(new FixedClock(time).now()).to.eq(time);
  });

  it('always tells the same local time', () => {
    const time = 0;
    expect(new FixedClock(time, GMT(+1)).now()).to.eq(time + 60 * 60 * 1000);
    expect(new FixedClock(time, GMT(-1)).now()).to.eq(time - 60 * 60 * 1000);
  });

  it('parses iso date strings', () => {
    expect(new FixedClock('2020-01-01').now()).to.eq(Date.parse('2020-01-01'));
    expect(new FixedClock('2020-01-01T08:21:22.123Z').now()).to.eq(Date.parse('2020-01-01T08:21:22.123Z'));
  });

  it('accepts dates', () => {
    expect(new FixedClock(new Date()).now()).to.eq(Date.now());
  });

  it('throws if given an invalid origin', async () => {
    expect(() => new FixedClock('non-standard-string').now()).to.throw('could not parse date non-standard-string');
    expect(() => new FixedClock({ foo: 'bar' } as any).now()).to.throw(/could not parse date/);
  });
});
