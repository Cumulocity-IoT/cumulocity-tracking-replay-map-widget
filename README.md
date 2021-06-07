
  # Cumulocity Tracking Replay Widget[<img width="35" src="https://user-images.githubusercontent.com/67993842/97668428-f360cc80-1aa7-11eb-8801-da578bda4334.png"/>]
(https://github.com/SoftwareAG/cumulocity-tracking-replay-map-widget/releases/download/1.0.0/tracking-replay-runtime-widget-1.0.0.zip)
  
The Cumulocity Tracking Replay widget help you to displays track lines of the tracking device with replay feature on map.

![tracking replay image](https://user-images.githubusercontent.com/83225057/120200287-ccd36180-c241-11eb-81b2-302d8ef993aa.png)

## Features

  
*  **Tracking Events:** Displays the position in map at a particular time.

*  **Faster/ Slower:** Configurable speed for tracing the path movement.

*  **Date/Time Filter:** Filters tracking events based on the date/time selected.

*  **Marker Click:** Shows the longitude and latitude of the marker.

*  **Configurable Zoom:**  Select and configurable zoom which is best fit for your map.  

*  **Configurable Device:** Based on configuration during widget configuration a device can be selected. 

  

## Installation

  
### Runtime Widget Deployment?

* This widget support runtime deployment. Download [Runtime Binary](https://github.com/SoftwareAG/cumulocity-tracking-replay-map-widget/releases/download/1.0.0/tracking-replay-runtime-widget-1.0.0.zip)  and follow runtime deployment instructions from [here](https://github.com/SoftwareAG/cumulocity-runtime-widget-loader).
  

### Installation of widget through Appbuilder or Cockipt Deployment?
  

**Supported Cumulocity Environments:**
  

*  **App Builder:** Tested with Cumulocity App Builder version 1.2.6.  

*  **Cockpit Application:** Tested with Cockpit 1009.0.4 with [Patch Fix](https://www.npmjs.com/package/cumulocity-runtime-widget-loader).

  
**Requirements:**

* Git

* NodeJS (release builds are currently built with `v12.19.0`)

* NPM (Included with NodeJS)

**External dependencies:**

```

"angular-resize-event": "^1.1.1"

"leaflet2": "npm:leaflet@^1.6.0"

```

**Installation Steps For App Builder:**


**Note:** If you are new to App Builder or not yet downloaded/clone app builder code then please follow [App builder documentation(Build Instructions)](https://github.com/SoftwareAG/cumulocity-app-builder) before proceeding further.



1. Open Your existing App Builder project and install external dependencies by executing below command or install it manually.

    ```

    npm i angular-resize-event@1.1.1 leaflet2@npm:leaflet@^1.6.0

    ```
2. Grab the Replay Tracking Map **[Latest Release Binary](https://github.com/SoftwareAG/cumulocity-tracking-replay-map-widget/releases/download/1.0.0/gp-tracking-replay-map-1.0.0.tgz)**.


3. Install the Binary file in app builder.

    ```
    
    npm i <binary file path>/gp-tracking-replay-map-x.x.x.tgz

    ```

4. Import GpTrackingReplayMapModule in custom-widget.module.ts file located at /cumulocity-app-builder/custom-widgets/

    ```  

    import {GpTrackingReplayMapModule} from  'gp-tracking-replay-map';

    @NgModule({

    imports: [

    GpTrackingReplayMapModule

    ]

    })

    ```

9. Congratulation! Installation is now completed. Now you can run app builder locally or build and deploy it into your tenant.

    ```

    //Start App Builder

    
    npm run start

    // Build App


    npm run build


    // Deploy App


    npm run deploy


    ```
  

**Installation Steps For Cockpit:**
  

**Note:** If you are new to Cockpit or not yet created any cockpit application then please follow [Web SDK for Angular](https://cumulocity.com/guides/web/angular/) before proceeding further.


1. Open Your existing Cockpit/Cumulocity project and install external dependencies by executing below command or install it manually.

    ```

    npm i angular-resize-event@1.1.1 leaflet2@npm:leaflet@^1.6.0

    ```

2. Grab the Tracking Replay Map **[Latest Release Binary](https://github.com/SoftwareAG/cumulocity-tracking-replay-map-widget/releases/download/1.0.0/gp-tracking-replay-map-1.0.0.tgz)**

3. Install the Binary file in your project.

    ``` 
    npm i <binary file path>/gp-tracking-replay-map-x.x.x.tgz
    ``` 

4. Import GpTrackingReplayMapModule in app.module.ts file located at /cumulocity-app/

    ```

    import {GpTrackingReplayMapModule} from  'gp-tracking-replay-map';

    @NgModule({

    imports: [


    GpTrackingReplayMapModule
    

    ]

    })


    ```

5. Congratulation! Installation is now completed. Now you can run your app locally or build and deploy it into your tenant.

    ```

    //Start App Builder

    

    npm run start

    

    // Build App

    

    npm run build


    // Deploy App

    

    npm run deploy


    ```

## Build Instructions

**Note:** It is only necessary to follow these instructions if you are modifying/extending this widget, otherwise see the [Installation Guide](#Installation).

**Requirements:**
  
* Git  

* NodeJS (release builds are currently built with `v12.19.0`)
  

* NPM (Included with NodeJS)
  

**Instructions**


1. Clone the repository:

    ```  

    git clone https://github.com/SoftwareAG/cumulocity-tracking-replay-map-widget.git

    ```

2. Change directory:

    ```

    cd cumulocity-tracking-replay-map-widget

    ```

3. (Optional) Checkout a specific version:

    ```

    git checkout <your version>
    
    ```  

4. Install the dependencies:

    ```

    npm install

    ```

5. (Optional) Local development server:

    ```

    npm run start

    ```

6. Build the app:

    ```

    npm run build

    ```

7. Deploy the app:

    ```

    npm run deploy

    ```

## QuickStart
  

This guide will teach you how to add widget in your existing or new dashboard.

  

**NOTE:** This guide assumes you have followed the [Installation instructions](#Installation)

  

1. Open you application from App Switcher
  

2. Add new dashboard or navigate to existing dashboard
  

3. Click `Add Widget`
  

4. Search for `Tracking Replay Map`


5. Select `Target Assets or Devices`


6. Click `Save`


Congratulations! Tracking Replay Map is configured.

  

## User Guide

 

*  **Target assets or devices:** User can select a device. Based on device, list of devices will be display on Map. Only those devices are visible on map where position attributes are configured. 



**Tracking Replay Map On Screen Options:**

 
* **Filters**:  The following filters can be used to filter/get data for the specified time period:
	*  **Start Date/Time**
	*  **End Date/Time**
	*  **Last minute**
	* **Last hour**
	* **Last day**
	* **Last week**
	* **Last month**

*   **Slower**: Reduces the marker speed to half.
*  **Play/ Pause**: Marker traces the path when played and can be paused at any instance.
*   **Faster**: Increase the marker speed to double.
*  **Reload**: Useful for force reload/refresh map.
*  **Zoom in/ out** : Zooms in/out of the map.

 
  

------------------------------

This widget is provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.

_____________________

For more information you can Ask a Question in the [TECHcommunity Forums](https://tech.forums.softwareag.com/tag/Cumulocity-IoT).


You can find additional information in the [Software AG TECHcommunity](https://techcommunity.softwareag.com/home/-/product/name/cumulocity).
