import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { History, HistoryService } from './history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  @Output() setHistory = new EventEmitter<History>();

  historyList: History[] = [];
  constructor(private historyService: HistoryService) { }

  ngOnInit(): void {
    this.historyList = this.historyService.getHistoryList();
    this.historyService.listChanged.subscribe((historyList: History[]) => {
      this.historyList = historyList;
    })
  }

  onSetHistory(index: number) {
    this.setHistory.emit(this.historyList[index]);
  }

  clearHistory() {
    this.historyService.clearHistory();
  }
}
