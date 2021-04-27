import { AfterViewInit, Component, ElementRef, Input, isDevMode, OnInit, ViewChild } from '@angular/core';
import * as moment_ from 'moment';
import * as MarkerImage from './marker-icon';
declare global {
  interface Window {
    L: any;
    h337: any;
  }
}

import 'leaflet2/dist/leaflet.js';
import { MovingMarkerService } from './movingMarker.service';
import { ResizedEvent } from 'angular-resize-event';
import { GpTrackingReplayMapService } from './gp-tracking-replay-map.service';
const L: any = window.L;
const moment = moment_;

@Component({
  selector: 'lib-gp-tracking-replay-map',
  templateUrl: './gp-tracking-replay-map.component.html',
  styleUrls: ['./gp-tracking-replay-map.component.less'],
})
export class GpTrackingReplayMapComponent implements OnInit, AfterViewInit {
  inputConfig: any;
  @Input() set config(newConfig: any) {
    this.inputConfig = newConfig;
    if (this.map) {
      this.initializeMap(false);
    }
  }
  get config(): any {
    return this.inputConfig;
  }
  @ViewChild('trmapRef', { static: true }) protected mapDivRef: ElementRef;
  @ViewChild('trInfoRef', { static: true })
  protected mapInfosDivRef: ElementRef;
  protected mapDiv: HTMLDivElement;
  protected mapInfosDiv: HTMLDivElement;
  protected map: any;
  protected initialMinZoom = 3;
  protected layerControl = L.control.layers([], [], {});
  protected movingMarker: any;
  protected startingPoints: any;
  realtime = true;
  LAYER_OSM = {
    id: 'openstreetmap',
    name: 'Open Street Map',
    enabled: true,
    layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxNativeZoom: 19, // max zoom where base layer tiles will be retrieved... this avoids errors when zooming more
      maxZoom: 28, // but, it can be zoomed closer :)
      attribution: 'Open Street Map',
    }),
  };

  initialMaxZoom = 14;
  width: number;
  height: number;
  mapLoaded = false;
  deviceId = '';
  constructor(private movingMarkerService: MovingMarkerService, private tpMapService: GpTrackingReplayMapService) { }

  ngOnInit() {
    this.initializeMap(true);
  }

  public ngAfterViewInit(): void {
    this.initMapHandlers();
  }

  refresh() {
    this.initializeMap(false);
  }

  /**
   * Intialzie map and load confiuration parameter. if it is not first call then clear all subscriptions
   */
   protected initializeMap(isFirstCall): void {
    this.mapDiv = this.mapDivRef.nativeElement;
    this.mapInfosDiv = this.mapInfosDivRef.nativeElement;

    this.deviceId = '99470470';
    if (this.inputConfig) {
      if (this.inputConfig.device) {
        this.deviceId = this.inputConfig.device.id;
      }
    }

    if (!isFirstCall) {
      this.clearMapAndSubscriptions();
    }
    if (this.mapLoaded) {
      return;
    }
    this.mapLoaded = true;
    this.updateMapSize(null, null);
    this.renderMap();
    this.renderDeviceOnMap(this.deviceId);
  }

  /**
   * Initialize Leaflet Map handlers
   */
  protected initMapHandlers(): void {
    this.map.invalidateSize();
    this.movingMarkerService.initializeMovingMarker(L);
  }

  protected updateMapSize(w: number, h: number): void {
    if (w > 0 && h > 0) {
      this.width = w - 20;
      this.height = h - this.mapInfosDiv.offsetHeight - 10; // 10px from styling :/
    } else {
      this.width = this.mapDiv.parentElement.offsetWidth - 20;
      this.height =
        this.mapDiv.parentElement.offsetHeight -
        this.mapInfosDiv.offsetHeight -
        10; // 10px from styling :/
    }
  }

  /**
   * Clear map, all variables and subscriptions
   */
  private clearMapAndSubscriptions() {
    this.map.remove();
    this.layerControl = L.control.layers([], [], {
      hideSingleBase: false,
      sortLayers: true,
      sortFunction(a, b) {
        return a.options.name - b.options.name;
      },
    });

    this.mapLoaded = false;
  }

  /**
   * Render the map (establish center and base layer)
   */
  protected renderMap(): void {
    // Create Leaflet Map in fixed DIV - zoom level is hardcoded for simplicity and will be overriden with fitBounds
    const initBounds = new L.LatLngBounds([0, 0], [0, 0]);
    this.map = L.map(this.mapDiv, {
      zoomControl: true,
      zoomAnimation: false,
      trackResize: true,
      boxZoom: true,
    }).setView(
      [initBounds.getCenter().lat, initBounds.getCenter().lng],
      this.initialMinZoom
    );
    this.map.addLayer(this.LAYER_OSM.layer);
  }

  onResized(event: ResizedEvent) {
    this.updateMapSize(event.newWidth, event.newHeight);
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  /**
   * Render a Device on Map
   */
   protected renderDeviceOnMap(deviceId): void {
    if (deviceId) {
      this.tpMapService
        .getTargetObject(deviceId) // this.config.device.id
        .then((mo) => {
            this.addSingleDeviceToMap(mo);
        })
        .catch((err) => {
          if (isDevMode()) {
            console.log(
              '+-+- ERROR while getting context object details for dashboard ',
              err
            );
          }
        });
    } else {
        this.addLayerToMap(null);
    }
  }
  /**
   * render single device on map based on its position
   */
   private addSingleDeviceToMap(device: any): void {
    if (
      device &&
      device.c8y_Position &&
      device.c8y_Position.lat &&
      device.c8y_Position.lng
    ) {
      const myIcon = L.icon({
        iconUrl: MarkerImage.markerIcon,
        iconSize: [25, 41],
        iconAnchor: [12.5, 41]
    });
      this.startingPoints = L.latLng(device.c8y_Position);
      this.movingMarker = L.Marker.movingMarker(
        [this.startingPoints, this.startingPoints],
        [1000],
        {icon: myIcon}
      );
      const mapBounds = new L.LatLngBounds(
        this.movingMarker.getLatLng(),
        this.movingMarker.getLatLng()
      );
      this.map.addLayer(this.movingMarker);
      this.addLayerToMap(mapBounds);
    }
  }



  /**
   * THis method is used to load all layers(marker, geofence, heatmap, etc) on map based on given configuration
   */
   private addLayerToMap(mapBounds: any) {
    if (this.map) {
      if (!mapBounds) {
        mapBounds = new L.LatLngBounds([0, 0], [0, 0]);
      }
      this.map.flyToBounds(mapBounds, { maxZoom: this.initialMaxZoom });
    }
  }

  next() {
    const points = [48.8567, 2.3508];
    L.polyline([this.startingPoints, points]).addTo(this.map);
    this.map.fitBounds([this.startingPoints, points]);
    this.movingMarker.moveTo(points, 2000);
  }
}
