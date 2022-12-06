import { expect } from 'chai';
import { Days, Duration, Hours, Milliseconds, Minutes, Nights, Seconds } from './Duration';

describe('Duration', () => {
  it('calculates the date from now', () => {
    expect(Days(4).from(new Date('2021-02-11T10:00:00.000Z').getTime())).to.eql(new Date('2021-02-15T10:00:00.000Z'));
    expect(Hours(4).from(new Date('2021-02-11T10:00:00.000Z').getTime())).to.eql(new Date('2021-02-11T14:00:00.000Z'));
    expect(Minutes(4).from(new Date('2021-02-11T10:00:00.000Z').getTime())).to.eql(
      new Date('2021-02-11T10:04:00.000Z')
    );
    expect(Seconds(4).from(new Date('2021-02-11T10:00:00.000Z').getTime())).to.eql(
      new Date('2021-02-11T10:00:04.000Z')
    );
    expect(Milliseconds(4).from(new Date('2021-02-11T10:00:00.000Z').getTime())).to.eql(
      new Date('2021-02-11T10:00:00.004Z')
    );
  });

  it('is equal to a unit of itself', () => {
    expect(Milliseconds(1).milliseconds).to.eq(1);
    expect(Seconds(1).seconds).to.eq(1);
    expect(Minutes(1).minutes).to.eq(1);
    expect(Hours(1).hours).to.eq(1);
    expect(Days(1).days).to.eq(1);
    expect(Nights(1).nights).to.eq(1);
  });

  it('determines whether one unit is longer than another', () => {
    expect(Days(4).moreThan(Days(4.5))).to.be.false;
    expect(Days(5).moreThan(Days(4.5))).to.be.true;
    expect(Nights(4).moreThan(Nights(4.5))).to.be.false;
    expect(Nights(5).moreThan(Nights(4.5))).to.be.true;
    expect(Hours(4).moreThan(Hours(4.5))).to.be.false;
    expect(Hours(5).moreThan(Hours(4.5))).to.be.true;
    expect(Minutes(4).moreThan(Minutes(4.5))).to.be.false;
    expect(Minutes(5).moreThan(Minutes(4.5))).to.be.true;
    expect(Seconds(4).moreThan(Seconds(4.5))).to.be.false;
    expect(Seconds(5).moreThan(Seconds(4.5))).to.be.true;
    expect(Milliseconds(4).moreThan(Milliseconds(4.5))).to.be.false;
    expect(Milliseconds(5).moreThan(Milliseconds(4.5))).to.be.true;
  });

  it('determines whether one unit is shorter than another', () => {
    expect(Days(4).lessThan(Days(4.5))).to.be.true;
    expect(Days(5).lessThan(Days(4.5))).to.be.false;
    expect(Nights(4).lessThan(Nights(4.5))).to.be.true;
    expect(Nights(5).lessThan(Nights(4.5))).to.be.false;
    expect(Hours(4).lessThan(Hours(4.5))).to.be.true;
    expect(Hours(5).lessThan(Hours(4.5))).to.be.false;
    expect(Minutes(4).lessThan(Minutes(4.5))).to.be.true;
    expect(Minutes(5).lessThan(Minutes(4.5))).to.be.false;
    expect(Seconds(4).lessThan(Seconds(4.5))).to.be.true;
    expect(Seconds(5).lessThan(Seconds(4.5))).to.be.false;
    expect(Milliseconds(4).lessThan(Milliseconds(4.5))).to.be.true;
    expect(Milliseconds(5).lessThan(Milliseconds(4.5))).to.be.false;
  });

  it('determines whether one unit is equal to another', () => {
    expect(Days(4).equalTo(Days(4.5))).to.be.false;
    expect(Days(5).equalTo(Days(5))).to.be.true;
    expect(Nights(4).equalTo(Nights(4.5))).to.be.false;
    expect(Nights(5).equalTo(Nights(5))).to.be.true;
    expect(Hours(4).equalTo(Hours(4.5))).to.be.false;
    expect(Hours(5).equalTo(Hours(5))).to.be.true;
    expect(Minutes(4).equalTo(Minutes(4.5))).to.be.false;
    expect(Minutes(5).equalTo(Minutes(5))).to.be.true;
    expect(Seconds(4).equalTo(Seconds(4.5))).to.be.false;
    expect(Seconds(5).equalTo(Seconds(5))).to.be.true;
    expect(Milliseconds(4).equalTo(Milliseconds(4.5))).to.be.false;
    expect(Milliseconds(5).equalTo(Milliseconds(5))).to.be.true;
  });

  it('combines two durations', () => {
    expect(Days(4).add(Days(4.5))).to.eql(Days(8.5));
    expect(Nights(4).add(Nights(4.5))).to.eql(Nights(8.5));
    expect(Hours(4).add(Hours(4.5))).to.eql(Hours(8.5));
    expect(Minutes(4).add(Minutes(4.5))).to.eql(Minutes(8.5));
    expect(Seconds(4).add(Seconds(4.5))).to.eql(Seconds(8.5));
    expect(Milliseconds(4).add(Milliseconds(4.5))).to.eql(Milliseconds(8.5));
  });

  it('determines whether one unit is equal to another', () => {
    expect(Minutes(60).isPrecise('hours')).to.be.true;
    expect(Minutes(30).isPrecise('hours')).to.be.false;
    expect(Seconds(60).isPrecise('minutes')).to.be.true;
    expect(Seconds(30).isPrecise('minutes')).to.be.false;
    expect(Milliseconds(1000).isPrecise('seconds')).to.be.true;
    expect(Milliseconds(500).isPrecise('seconds')).to.be.false;
  });

  describe('subtract', () => {
    const cases = [
      [Minutes(60).subtract(Minutes(1)), Minutes(59)],
      [Hours(24).subtract(Hours(24)), Minutes(0)],
      [Milliseconds(1000).subtract(Seconds(2)), Milliseconds(-1000)],
    ];

    cases.forEach(([actual, expected]) => {
      it('subtracts correctly', () => {
        expect(actual).to.eql(expected);
      });
    })
  });
});
