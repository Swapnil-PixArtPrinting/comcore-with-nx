import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ExecutionProfiler {
  private intervals: Record<string, number> = {};
  private profile: Record<string, number> = {};

  constructor() {
    this.start();
  }

  start(): void {
    this.mark('start');
  }

  end(): void {
    this.mark('end');
  }

  mark(key: string): void {
    this.intervals[key] = Date.now();
  }

  calculate(forceEndTime = false): Record<string, number> {
    let previous: number | null = null;

    for (const [key, value] of Object.entries(this.intervals)) {
      if (previous !== null) {
        this.profile[key] = parseFloat(((value - previous) / 1000).toFixed(3));
      }
      previous = value;
    }

    if (forceEndTime || !this.intervals['end']) {
      this.end();
    }

    this.profile['total'] = parseFloat(
      ((this.intervals['end'] - this.intervals['start']) / 1000).toFixed(3),
    );

    return this.profile;
  }

  getIntervals(): Record<string, number> {
    return this.intervals;
  }
}
