import { NgModule } from '@angular/core';
import { CoreModule, HOOK_COMPONENTS } from '@c8y/ngx-components';
import { AngularResizedEventModule } from 'angular-resize-event';
import { GpTrackingReplayMapConfigComponent } from './config/gp-tracking-replay-map-config.component';
import { GpTrackingReplayMapComponent } from './gp-tracking-replay-map.component';
import { GpTrackingReplayMapService } from './gp-tracking-replay-map.service';
import { MovingMarkerService } from './movingMarker.service';
import * as preview from './preview-image';


@NgModule({
  declarations: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  imports: [
    CoreModule,
    AngularResizedEventModule
  ],
  entryComponents: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  exports: [GpTrackingReplayMapComponent, GpTrackingReplayMapConfigComponent],
  providers: [
    GpTrackingReplayMapService,
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
