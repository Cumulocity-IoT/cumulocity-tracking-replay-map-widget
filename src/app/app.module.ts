import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GpTrackingReplayMapModule } from 'projects/gp-tracking-replay-map/src/public-api';
import { BasicAuth, Client, EventService, FetchClient, InventoryService } from '@c8y/client';

const auth = new BasicAuth({
  user: '###',
  password: '###',
  tenant: '###'
});
const client = new Client(auth, 'http://localhost:4200');
client.setAuth(auth);
const fetchClient = client.core;
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GpTrackingReplayMapModule,
  ],
  providers: [
    { provide: FetchClient, useValue: client.core },
    { provide: EventService, useValue: client.event },
    { provide: InventoryService, useValue: client.inventory },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
