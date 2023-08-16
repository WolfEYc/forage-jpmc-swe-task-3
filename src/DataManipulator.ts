import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined
}

const THRESHOLD = 0.05;

export class DataManipulator {
  static getDate(stockA: ServerRespond, stockB: ServerRespond) {
    const a = stockA.timestamp;
    const b = stockB.timestamp;
    return a > b ? a : b
  }

  static getPrice(stock: ServerRespond) {
    return (stock.top_ask.price + stock.top_bid.price) / 2
  }

  static getTriggerAlert(ratio: number, lower_bound: number, upper_bound: number) {
    return ratio > lower_bound && ratio < upper_bound ? undefined : ratio
  }

  static getBounds() {
    return [1 - THRESHOLD, 1 + THRESHOLD];
  }

  static generateRow(serverResponds: ServerRespond[]): Row {
    const stockA = serverResponds[serverResponds.length - 2]
    const stockB = serverResponds[serverResponds.length - 1]

    const price_abc = this.getPrice(stockA);
    const price_def = this.getPrice(stockB);
    const ratio = price_abc / price_def
    const [lower_bound, upper_bound] = this.getBounds();
    const timestamp = this.getDate(stockA, stockB);
    const trigger_alert = this.getTriggerAlert(ratio, lower_bound, upper_bound);

    console.log(serverResponds.length)

    return {
      price_abc,
      price_def,
      ratio,
      timestamp,
      upper_bound,
      lower_bound,
      trigger_alert
    }
  }
}
