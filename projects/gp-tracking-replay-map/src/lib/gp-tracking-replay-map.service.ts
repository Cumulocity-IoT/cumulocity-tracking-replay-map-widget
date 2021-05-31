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
