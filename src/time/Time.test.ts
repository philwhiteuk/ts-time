import { expect } from 'chai';
import Time from './Time';
import { Days, Hours, Milliseconds } from './Duration';
import { sleep } from './sleep';
import { DateFormat } from './Formatter';
import { GMT } from '../types/Time';

describe('Time', () => {
  it('tells the time universally', async () => {
    const universalTime = Time.Universal;
    expect(universalTime.now()).to.be.closeTo(Date.now(), 5);
    await sleep(Milliseconds(100));
    expect(universalTime.now()).to.be.closeTo(Date.now(), 5);
  });

  it('tells the local time', () => {
    expect(Time.Local(GMT(+1)).now()).to.be.closeTo(Date.now() + 60 * 60 * 1000, 5);
    expect(Time.Local(GMT(-1)).now()).to.be.closeTo(Date.now() - 60 * 60 * 1000, 5);
  });

  describe('formatted', () => {
    it('as an ISO8601 timestamp', async () => {
      const fixedTime = Time.Fixed('2020-01-01');
      const GMTZero = Time.Universal;
      const GMTPlusOne = Time.Local(GMT(+1));
      const GMTMinusOne = Time.Local(GMT(-1));

      expect(fixedTime.toTimestamp()).to.eql('2020-01-01T00:00:00.000Z');
      expect(GMTZero.toTimestamp()).to.contain(new Date().toISOString().split(':').slice(0, -1).join(':'));
      expect(GMTPlusOne.toTimestamp()).to.match(/\+01:00$/);
      expect(GMTMinusOne.toTimestamp()).to.match(/-01:00$/);
    });

    it('as a YMD date', async () => {
      const GMTZero = Time.Fixed('2020-01-01');
      const GMTPlusOne = Time.Fixed('2020-01-01', GMT(+1));
      const GMTMinusOne = Time.Fixed('2020-01-01', GMT(-1));

      expect(GMTZero.toDateString()).to.eql('2020-01-01');
      expect(GMTPlusOne.toDateString()).to.eql('2020-01-01');
      expect(GMTMinusOne.toDateString()).to.eql('2019-12-31');

      expect(GMTZero.toDateString(DateFormat.YMD, '/')).to.eql('2020/01/01');
      expect(GMTPlusOne.toDateString(DateFormat.YMD, '/')).to.eql('2020/01/01');
      expect(GMTMinusOne.toDateString(DateFormat.YMD, '/')).to.eql('2019/12/31');
    });

    it('as a DMY date', async () => {
      const GMTZero = Time.Fixed('2020-01-01');
      const GMTPlusOne = Time.Fixed('2020-01-01', GMT(+1));
      const GMTMinusOne = Time.Fixed('2020-01-01', GMT(-1));

      expect(GMTZero.toDateString(DateFormat.DMY)).to.eql('01-01-2020');
      expect(GMTPlusOne.toDateString(DateFormat.DMY)).to.eql('01-01-2020');
      expect(GMTMinusOne.toDateString(DateFormat.DMY)).to.eql('31-12-2019');

      expect(GMTZero.toDateString(DateFormat.DMY, '/')).to.eql('01/01/2020');
      expect(GMTPlusOne.toDateString(DateFormat.DMY, '/')).to.eql('01/01/2020');
      expect(GMTMinusOne.toDateString(DateFormat.DMY, '/')).to.eql('31/12/2019');
    });

    it('as an MDY date', async () => {
      const GMTZero = Time.Fixed('2020-01-01');
      const GMTPlusOne = Time.Fixed('2020-01-01', GMT(+1));
      const GMTMinusOne = Time.Fixed('2020-01-01', GMT(-1));

      expect(GMTZero.toDateString(DateFormat.MDY)).to.eql('01-01-2020');
      expect(GMTPlusOne.toDateString(DateFormat.MDY)).to.eql('01-01-2020');
      expect(GMTMinusOne.toDateString(DateFormat.MDY)).to.eql('12-31-2019');

      expect(GMTZero.toDateString(DateFormat.MDY, '/')).to.eql('01/01/2020');
      expect(GMTPlusOne.toDateString(DateFormat.MDY, '/')).to.eql('01/01/2020');
      expect(GMTMinusOne.toDateString(DateFormat.MDY, '/')).to.eql('12/31/2019');
    });

    it('as a string', async () => {
      const GMTZero = Time.Fixed('2020-01-01');
      const GMTPlusOne = Time.Fixed('2020-01-01', GMT(+1));
      const GMTMinusOne = Time.Fixed('2020-01-01', GMT(-1));

      expect(String(GMTZero)).to.eql('2020-01-01T00:00:00.000Z');
      expect(String(GMTPlusOne)).to.eql('2020-01-01T00:00:00.000+01:00');
      expect(String(GMTMinusOne)).to.eql('2020-01-01T00:00:00.000-01:00');

      expect(JSON.stringify(GMTZero)).to.eql('"2020-01-01T00:00:00.000Z"');
      expect(JSON.stringify(GMTPlusOne)).to.eql('"2020-01-01T00:00:00.000+01:00"');
      expect(JSON.stringify(GMTMinusOne)).to.eql('"2020-01-01T00:00:00.000-01:00"');
    });

    it('as a date object', async () => {
      const GMTZero = Time.Fixed('2020-01-01');
      const GMTPlusOne = Time.Fixed('2020-01-01', GMT(+1));
      const GMTMinusOne = Time.Fixed('2020-01-01', GMT(-1));

      expect(GMTZero.toDate()).to.eql(new Date('2020-01-01T00:00:00.000Z'));
      expect(GMTPlusOne.toDate()).to.eql(new Date('2020-01-01T01:00:00.000Z'));
      expect(GMTMinusOne.toDate()).to.eql(new Date('2019-12-31T23:00:00.000Z'));
    });
  });

  describe('manipulated', () => {
    it('adds to time', () => {
      expect(Time.Fixed('2020-01-01T00:00:00').add(Hours(1)).now()).to.eq(Date.parse('2020-01-01T01:00:00'));
      expect(Time.Universal.add(Hours(1)).now()).to.be.closeTo(Date.now() + 60 * 60 * 1000, 500);
      expect(Time.Local(GMT(0)).add(Hours(1)).now()).to.be.closeTo(Date.now() + 60 * 60 * 1000, 500);
      expect(Time.Local(GMT(-1)).add(Hours(1)).now()).to.be.closeTo(Date.now(), 500);
    });

    it('subtracts from time', () => {
      expect(Time.Fixed('2020-01-01T00:00:00').subtract(Hours(1)).now()).to.eq(Date.parse('2019-12-31T23:00:00'));
      expect(Time.Universal.subtract(Hours(1)).now()).to.be.closeTo(Date.now() - 60 * 60 * 1000, 500);

      expect(Time.Local(GMT(0)).subtract(Hours(1)).now()).to.be.closeTo(Date.now() - 60 * 60 * 1000, 500);
      expect(
        Time.Local(GMT(+1))
          .subtract(Hours(1))
          .now()
      ).to.be.closeTo(Date.now(), 500);
    });
  });

  describe('measured', () => {
    it('determines how long it has been keeping time', async () => {
      const localTime = Time.Local();
      const fixedTime = Time.Fixed();

      expect(localTime.elapsed.milliseconds).to.be.closeTo(1, 5);
      expect(fixedTime.elapsed.milliseconds).to.eq(0);
      await sleep(Milliseconds(100));
      expect(localTime.elapsed.milliseconds).to.be.closeTo(100, 5);
      expect(fixedTime.elapsed.milliseconds).to.eq(0);
    });

    it('determines how long until time', async () => {
      const universalTime = Time.Universal;
      expect(universalTime.until(universalTime.add(Days(23))).seconds).to.eq(Days(23).seconds);
    });
  });
});
