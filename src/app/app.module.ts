import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HistoryComponent } from './history/history.component';
import { HistoryService } from './history/history.service';

@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [HistoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
