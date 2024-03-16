export class Utils {
  static getUuid() {
    return `toolsjs_${Math.random().toString(16).slice(2)}`;
  }
}
