import { Injectable } from '@nestjs/common';
import { forOwn, cloneDeep } from 'lodash';

type Action = 'mask' | 'delete';
type Strategy = 'fixed' | 'default';

interface RedactorOptions {
  strategy?: Strategy;
  fixedLength?: number;
}

@Injectable()
export class RedactorService {
  private maskValue(value: any, strategy: Strategy = 'default', fixedLength = 8): string {
    const strValue = value?.toString() ?? '';
    const len = strValue.length;

    if(len === 0) return '';

    switch (strategy) {
      case 'fixed':
        return '*'.repeat(fixedLength);

      case 'default':
      default:
      if (len <= 2) return '*'.repeat(len);
      if (len <= 6) return strValue[0] + '*'.repeat(len - 2) + strValue[len - 1];        
      
      // show 25% at each end
      // ex: Pix-Comcore@pixartprinting.com -> Pix-Com****************ing.com
      const visiblePortion = Math.floor(len / 4);
      const start = strValue.slice(0, visiblePortion);
      const end = strValue.slice(-visiblePortion);
      const masked = '*'.repeat(len - 2 * visiblePortion);
      return start + masked + end;
    }
  }

  private redactKey(
    obj: any,
    targetKey: string,
    action: Action,
    options?: RedactorOptions,
    seen: WeakSet<object> = new WeakSet()
  ): void {
    if (!obj || typeof obj !== 'object' || obj === null) return;
    if (seen.has(obj)) return;
    seen.add(obj);
  
    if (Array.isArray(obj)) {
      for (const item of obj) {
        this.redactKey(item, targetKey, action, options, seen);
      }
      return;
    }
  
    forOwn(obj, (value, key) => {
      if (key === targetKey) {
        if (action === 'delete') {
          delete obj[key];
        } else if (action === 'mask') {
          obj[key] = this.maskValue(value, options?.strategy, options?.fixedLength);
        }
      } else if (value && typeof value === 'object') {
        this.redactKey(value, targetKey, action, options, seen);
      }
    });
  }

  redactMultiple(obj: any, actions: { key: string; action: Action; options?: RedactorOptions }[]): any {
    const copy = cloneDeep(obj);
    actions.forEach(({ key, action, options }) => {
      this.redactKey(copy, key, action, options);
    });
    return copy;
  }
}