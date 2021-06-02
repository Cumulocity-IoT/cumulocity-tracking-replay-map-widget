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
import { NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { AngularResizedEventModule } from 'angular-resize-event';
import { GpTrackingReplayMapConfigComponent } from './config/gp-tracking-replay-map-config.component';
import { GpTrackingReplayMapComponent } from './gp-tracking-replay-map.component';
import { GpTrackingReplayMapService } from './gp-tracking-replay-map.service';
import { MovingMarkerService } from './movingMarker.service';
import * as preview from './preview-image';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@NgModule({
  declarations: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  imports: [
    CoreModule,
    AngularResizedEventModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  entryComponents: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  exports: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  providers: [
    GpTrackingReplayMapService,
    BsDatepickerConfig,
    MovingMarkerService,
    {
      provide: HOOK_COMPONENTS,
      multi: true,
      useValue: {
        id: 'tracking-replay-map-widget',
        label: 'Tracking Replay Map',
        previewImage: preview.previewImage,
        description:
          'Displays track lines of tracking device with replay feature.',
        component: GpTrackingReplayMapComponent,
        configComponent: GpTrackingReplayMapConfigComponent,
        data: {
          ng1: {
            options: {
              noDeviceTarget: false,
              noNewWidgets: false,
              deviceTargetNotRequired: false,
              groupsSelectable: true,
            },
          },
        },
      },
    },
  ],
})
export class GpTrackingReplayMapModule { }
