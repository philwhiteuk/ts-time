import { GConstructor } from '../util/mixin';
import { Time, UTC } from '../types/Time';
import { Clock } from './Clock';

export enum DateFormat {
  YMD = 'ymd',
  MDY = 'mdy',
  DMY = 'dmy',
}

export interface Formatter {
  /*
   * (default) YMD format e.g. 2000-12-31
   *
   * DMY format e.g. 31-12-2000
   *
   * MDY format e.g. 12-31-2000
   */
  toDateString(format?: DateFormat, delimiter?: '/' | '-'): string;

  // e.g. 1970-01-01T00:00:00.000+01:00
  toTimestamp(): string;

  // as js Date object
  toDate(): Date;

  toJSON(): string;

  toString(): string;
}

export function Formatter(Base: GConstructor<Clock>): GConstructor<Clock & Partial<Time>> {
  return class FormatterMixin extends Base implements Formatter {
    public toDateString(format = DateFormat.YMD, delimiter: '/' | '-' = '-'): string {
      const localTime = new Date(this.now());
      const day = FormatterMixin.padTime(localTime.getUTCDate());
      const month = FormatterMixin.padTime(localTime.getUTCMonth() + 1);
      const year = localTime.getUTCFullYear();

      switch (format) {
        case 'dmy':
          return `${day}${delimiter}${month}${delimiter}${year}`;
        case 'mdy':
          return `${month}${delimiter}${day}${delimiter}${year}`;
        default:
          return `${year}${delimiter}${month}${delimiter}${day}`;
      }
    }

    public toTimestamp(): string {
      return `${new Date(this.now() - this.timezone.milliseconds)
        .toISOString()
        .substr(0, new Date(this.now()).toISOString().length - 1)}${this.timezoneDesignator()}`;
    }

    public toDate(): Date {
      return new Date(this.now());
    }

    public toJSON(): string {
      return this.toTimestamp();
    }

    public toString(): string {
      return this.toTimestamp();
    }

    private timezoneDesignator() {
      const operator = this.timezone.minutes > 0 ? '+' : '-';
      const hours =
        this.timezone.minutes >= 0
          ? FormatterMixin.padTime(this.timezone.hours)
          : FormatterMixin.padTime(-this.timezone.hours);
      const minutes = FormatterMixin.padTime(this.timezone.minutes % 60);
      return this.timezone.equalTo(UTC) ? 'Z' : `${operator}${hours}:${minutes}`;
    }

    private static padTime(value: string | number, padWith: string = '0', length: number = 2) {
      return `${value}`.padStart(length, padWith);
    }
  };
}
