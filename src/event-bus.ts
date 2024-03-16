import { isFunction, isNil, isString } from 'lodash';
import { Utils } from './Utils';

type Func = (...arg: any[]) => any;

type EventInfo = {
  func: Func;
  once?: boolean;
  args?: any[];
};
/**
 * 事件总线
 *
 * ```ts
 * // -------- Global Import(全局引入)
 * const toolsjs = require('toolsjs.js'); // Node
 * import toolsjs from 'toolsjs.js' // Es6 Module
 * new toolsjs.EventBus();
 *
 * // -------- Import on Demand(按需引入)
 * const { EventBus } = require('toolsjs.js/event-bus'); // Node
 * import { EventBus } from 'toolsjs.js/event-bus' // Es6 Module
 * new EventBus();
 *  ```
 */
export class EventBus {
  #events = new Map<string, EventInfo>();

  _id = Utils.getUuid();

  constructor() {}

  /** 发布 */
  publish(name: string) {
    name = name.trim();
    const eventInfo = this.#events.get(name);

    if (isNil(eventInfo)) {
      throw new Error('不能为空');
    }

    const { once, func } = eventInfo;

    if (once) {
      this.clear(name);
    }

    func();
  }

  /** 订阅 */
  subscribe(name: string, func: Func) {
    name = name.trim();
    const errMsg = this.#validSuccess(name, func);
    if (errMsg) {
      throw new Error(errMsg);
    }
    this.#events.set(name, { func });
  }

  /** 订阅一次 */
  subscribeOnce(name: string, func: Func) {
    name = name.trim();
    const errMsg = this.#validSuccess(name, func);
    if (errMsg) {
      throw new Error(errMsg);
    }
    this.#events.set(name, { func, once: true });
  }

  /** 清空 */
  clear(name?: string) {
    if (name === undefined) {
      this.#events.clear();
      return;
    }
    name = `${name}`.trim();
    this.#events.delete(name);
  }

  #validSuccess(name: string, func: Func) {
    let error = '';
    if (!isString(name)) {
      error = `名称不能为空`;
    } else if (!isFunction(func)) {
      error = `${name} 订阅不是一个函数`;
    } else if (this.#has(name)) {
      error = `${name} 请勿重复订阅`;
    }

    return error;
  }

  #has(name: string) {
    return this.#events.has(name);
  }
}
