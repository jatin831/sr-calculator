import { Subject } from "rxjs";

export interface History {
  expression: string;
  result: string;
};

export class HistoryService {
  listChanged = new Subject<History[]>();
  historyList: History[] = [];

  addHistory(history: History) {
    this.historyList.push(history);
    this.listChanged.next(this.historyList.slice());
  }

  getHistoryList() {
    return this.historyList.slice();
  }

  clearHistory() {
    this.historyList = [];
    this.listChanged.next([]);
  }
}