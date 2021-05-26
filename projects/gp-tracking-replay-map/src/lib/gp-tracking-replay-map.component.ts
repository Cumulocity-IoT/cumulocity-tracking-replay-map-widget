import { AfterViewInit, Component, ElementRef, Input, isDevMode, OnInit, ViewChild } from '@angular/core';
import * as moment_ from 'moment';
import * as MarkerImage from './marker-icon';
import { EventService } from '@c8y/client';
declare global {
  interface Window {
    L: any;
    h337: any;
  }
}

import 'leaflet2/dist/leaflet.js';
import { MovingMarkerService } from './movingMarker.service';
import { AngularResizedEventModule, ResizedEvent } from 'angular-resize-event';
import { GpTrackingReplayMapService } from './gp-tracking-replay-map.service';
import { isObject } from 'util';
const L: any = window.L;
const moment = moment_;

@Component({
  selector: 'lib-gp-tracking-replay-map',
  templateUrl: './gp-tracking-replay-map.component.html',
  styleUrls: ['./gp-tracking-replay-map.component.less'],
})
export class GpTrackingReplayMapComponent implements OnInit, AfterViewInit {
  inputConfig: any;
  dataPoints: any;
  maxLat: any;
  minLat: any;
  maxLong: any;
  minLong: any;
  mapBounds: any;
  pLine: any;
  pArray: any = [];
  duration: number;
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
  myIcon = L.icon({
    iconUrl: MarkerImage.markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41]
  });

  deviceId = '99470470';
  initialMaxZoom = 14;
  width: number;
  height: number;
  mapLoaded = false;
  mmStartDate;
  mmEndDate;
  dropdownValue: string;
  constructor(
    private movingMarkerService: MovingMarkerService,
    private tpMapService: GpTrackingReplayMapService,
    private events: EventService) { }

  ngOnInit() {
    this.mmStartDate = moment().subtract(1, 'hours').format('YYYY-MM-DDTHH:mm:ssZ');
    this.mmEndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ'); // '2021-05-06T18:40:05+05:30'
    this.dropdownValue = 'lastHour';

    this.initializeMap(true);
    this.duration = 1000;
  }

  public ngAfterViewInit(): void {
    this.initMapHandlers();
  }

  refresh() {
    this.initializeMap(false);
  }
  onDropdownChange(value) {
    console.log(value);
    if (value === 'lastMinute') {
      this.mmStartDate = moment().subtract(1, 'm').format('YYYY-MM-DDTHH:mm:ssZ');
      this.mmEndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');


    } else if (value === 'lastHour') {
      this.mmStartDate = moment().subtract(1, 'h').format('YYYY-MM-DDTHH:mm:ssZ');
      this.mmEndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

    } else if (value === 'lastDay') {
      this.mmStartDate = moment().subtract(1, 'd').format('YYYY-MM-DDTHH:mm:ssZ');
      this.mmEndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

    } else if (value === 'lastWeek') {
      this.mmStartDate = moment().subtract(1, 'w').format('YYYY-MM-DDTHH:mm:ssZ');
      this.mmEndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

    } else if (value === 'lastMonth') {
      this.mmStartDate = moment().subtract(1, 'M').format('YYYY-MM-DDTHH:mm:ssZ');
      this.mmEndDate = moment().format('YYYY-MM-DDTHH:mm:ssZ');

    } else {

    }


  }

  /**
   * Intialzie map and load confiuration parameter. if it is not first call then clear all subscriptions
   */
  protected initializeMap(isFirstCall): void {
    this.mapDiv = this.mapDivRef.nativeElement;
    this.mapInfosDiv = this.mapInfosDivRef.nativeElement;


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
    // this.renderDeviceOnMap(this.deviceId);
    this.filter();
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
      this.height = this.mapDiv.parentElement.offsetHeight;
      // this.mapDiv.parentElement.offsetHeight -
      // this.mapInfosDiv.offsetHeight -
      // 10; // 10px from styling :/
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
      /* this.startingPoints = L.latLng(device.c8y_Position);
      this.movingMarker = L.Marker.movingMarker(
        [this.startingPoints, this.startingPoints],
        [1000],
        { icon: myIcon }
      );
      const mapBounds = new L.LatLngBounds(
        this.movingMarker.getLatLng(),
        this.movingMarker.getLatLng()
      );
      this.map.addLayer(this.movingMarker);
      this.addLayerToMap(mapBounds); */
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

  play() {
    if(this.movingMarker){
      if (this.movingMarker.isPaused()) {
        this.movingMarker.resume();

      } else {
        this.duration = 1000;
        this.movingMarker.stop();
        if (this.dataPoints && this.dataPoints.length > 0) {

          // this.movingMarker.moveTo(this.dataPoints[0].c8y_Position, this.duration);
          // this.mapBounds = new L.LatLngBounds([this.dataPoints[0].c8y_Position, this.dataPoints[0].c8y_Position]);
          this.drawPolyLine(this.dataPoints.length - 1);
          this.movingMarker.start();
        }
      }
    }
  }
  pause() {
    if (this.movingMarker) {
      this.movingMarker.pause();

    }

  }

  isRunning() {
    if (this.movingMarker) {
      return this.movingMarker.isRunning();

    }
  }
  drawPolyLine(pointIndex) {
    const mapBounds = new L.LatLngBounds([this.dataPoints[0].c8y_Position, this.dataPoints[0].c8y_Position]);
    for (let i = 0; i < pointIndex; i++) {
      const pLine = L.polyline([this.dataPoints[i].c8y_Position, this.dataPoints[i + 1].c8y_Position]);
      pLine.addTo(this.map);
      this.pArray.push(pLine);
      this.movingMarker.addLatLng(this.dataPoints[i + 1].c8y_Position, this.duration);
      mapBounds.extend(this.dataPoints[i + 1].c8y_Position);
      this.map.fitBounds(mapBounds);
    }

  }
  changeDuration(pointIndex) {
    for (let i = 0; i < pointIndex; i++) {
      const pLine = L.polyline([this.dataPoints[i].c8y_Position, this.dataPoints[i + 1].c8y_Position]);
      pLine.addTo(this.map);
      this.pArray.push(pLine);
      this.movingMarker.addLatLng(this.dataPoints[i + 1].c8y_Position, this.duration);
    }
  }
  removePolyLine() {
    if (this.pArray.length > 0) {
      this.pArray.forEach(pLine => {
        this.movingMarker.removeLatLng();
        pLine.removeFrom(this.map);
      });

    }

  }

  playTillPoint(pointIndex) {
    this.duration = 1000;
    this.movingMarker.stop();
    this.removePolyLine();
    this.drawPolyLine(pointIndex);
    this.movingMarker.start();

  }
  faster() {
    if (this.movingMarker) {
      this.movingMarker.pause();
      this.duration = this.duration / 2;
      this.removePolyLine();
      this.changeDuration(this.dataPoints.length - 1);
      this.movingMarker.resume();
    }

  }
  slower() {
    if (this.movingMarker) {
      this.movingMarker.pause();
      this.duration = this.duration * 2;
      this.removePolyLine();
      this.changeDuration(this.dataPoints.length - 1);
      this.movingMarker.resume();
    }
  }

  onDateTimeChange(event) {
    console.log(event);
    this.dropdownValue = 'custom';
  }
  async filter() {
    let startDate = this.mmStartDate;
    let endDate = this.mmEndDate;
    if (isObject(this.mmStartDate) || isObject(this.mmStartDate)) {
      startDate = this.mmStartDate.toISOString();
      endDate = this.mmEndDate.toISOString();

    }
    const param = {
      dateFrom: startDate,
      dateTo: endDate,
      fragmentType: 'c8y_Position',
      pageSize: 100,
      revert: true,
      source: this.deviceId,
    };
    const response = (await this.events.list(param)).data;
    if (response) {
      this.dataPoints = response;
      if (this.dataPoints && this.dataPoints.length > 0) {
        this.startingPoints = L.latLng(this.dataPoints[0].c8y_Position);
        if (this.movingMarker){
          this.movingMarker.removeFrom(this.map);
        }
        this.movingMarker = L.Marker.movingMarker(
        [this.startingPoints, this.startingPoints],
        [1000],
        { icon: this.myIcon }
      );

        this.movingMarker.addTo(this.map);
        this.map.flyToBounds([this.dataPoints[0].c8y_Position, this.dataPoints[0].c8y_Position], { maxZoom: this.initialMaxZoom });


      } else {
        const mapBounds = new L.LatLngBounds([0, 0], [0, 0]);
        this.map.fitWorld();
        //this.map.flyToBounds(mapBounds, { maxZoom: this.initialMinZoom });

      }


    }

    return response;
  }
}
