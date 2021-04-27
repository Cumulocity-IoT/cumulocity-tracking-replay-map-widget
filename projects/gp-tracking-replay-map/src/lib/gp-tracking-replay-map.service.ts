import { Injectable } from '@angular/core';
import { InventoryService } from '@c8y/client';

@Injectable()
export class GpTrackingReplayMapService {

  constructor(private invSvc: InventoryService) { }

  /**
   * Retrieve the details for the specified managed object as a Promise
   *
   * @param deviceId Id of the managed object
   */
   getTargetObject(deviceId: string): any {
    return new Promise(
      (resolve, reject) => {
        this.invSvc.detail(deviceId)
          .then((resp) => {
            if (resp.res.status === 200) {
              resolve(resp.data);
            } else {
              reject(resp);
            }
          });
      });
  }
}
