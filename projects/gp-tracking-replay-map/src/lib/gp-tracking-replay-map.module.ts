import { NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { AngularResizedEventModule } from 'angular-resize-event';
import { GpTrackingReplayMapConfigComponent } from './config/gp-tracking-replay-map-config.component';
import { GpTrackingReplayMapComponent } from './gp-tracking-replay-map.component';
import { GpTrackingReplayMapService } from './gp-tracking-replay-map.service';
import { MovingMarkerService } from './movingMarker.service';
import * as preview from './preview-image';
import { BsDatepickerConfig, BsDaterangepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
const materialModules = [
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule
]
@NgModule({
  declarations: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  imports: [
    CoreModule,
    AngularResizedEventModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    materialModules
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
