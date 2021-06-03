/**
 * Copyright (c) 2020 Software AG, Darmstadt, Germany and/or its licensors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GpTrackingReplayMapModule } from 'projects/gp-tracking-replay-map/src/public-api';
import { BasicAuth, Client, EventService, FetchClient, InventoryService } from '@c8y/client';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '@c8y/ngx-components';

const auth = new BasicAuth({
  user: 'userID',
  password: '####',
  tenant: ''
});
const client = new Client(auth, 'http://localhost:4200');
client.setAuth(auth);
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GpTrackingReplayMapModule,
    NoopAnimationsModule,
    CoreModule.forRoot()
  ],
  providers: [
    { provide: FetchClient, useValue: client.core },
    { provide: EventService, useValue: client.event },
    { provide: InventoryService, useValue: client.inventory},


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
