import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-gp-tracking-replay-map-config',
  template: `
  `,
  styles: []
})
export class GpTrackingReplayMapConfigComponent implements OnInit {

  @Input() config: any = {};
  constructor() { }

  ngOnInit() {
  }

}
