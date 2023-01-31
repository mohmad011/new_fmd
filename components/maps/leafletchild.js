import L from "leaflet";
import { Resources } from "./Resources";
import $ from "jquery";
import moment from "moment";
import "helpers/plugins/fullscreen/Control.FullScreen";
import "helpers/plugins/markercluster/leaflet.markercluster";
import "helpers/plugins/markercluster/layersupport/layersupport";
import "helpers/plugins/googlemutant/Leaflet.GoogleMutant";
import "helpers/plugins/rotatedMarker/leaflet.rotatedMarker";
import "helpers/plugins/animatedmarker/AnimatedMarker";
import "helpers/plugins/slideto/SlideTo";
import "helpers/plugins/markerslideto/Leaflet.Marker.SlideTo";
import "helpers/plugins/leaflet-routing-machine/leaflet-routing-machine";
import "helpers/plugins/leaflet-routing-machine/leaflet-routing-machine";
import { getmainbuttons } from "./mapHelper";

export var Mapjs = {
  const: {
    locs: {
      ksa: [24.629778, 46.799308],
    },
    options: {
      minZoom: 6,
      maxZoom: 14,
      attribution: '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
      animate: { animate: true, duration: 1.5, easeLinearity: 0.75 },
    },
    tiles: {
      Saferoad: L.tileLayer("//tile.openstreetmap.de/{z}/{x}/{y}.png", {
        id: "saferoad",
        attribution:
          '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
      }),
      googleStreetsJS: L.gridLayer.googleMutant({
        type: "roadmap", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        styles: [{ featureType: "water", stylers: [{ color: "#42ABC0" }] }],
        attribution:
          '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
      }),
      googleStreetsDarkJS: L.gridLayer.googleMutant({
        type: "roadmap", // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
        attribution:
          '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }],
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#242f3e" }],
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#0095AA" }],
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#0095AA" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#42ABC0" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      }),
      googleHybridJS: L.gridLayer.googleMutant({
        type: "hybrid",
        attribution:
          '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
      }),
      googleSatJS: L.gridLayer.googleMutant({ type: "satellite" }),
      googleTerrainJS: L.gridLayer.googleMutant({ type: "terrain" }),
      googleStreets: L.tileLayer(
        "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
          id: "googleStreets",
          minZoom: 6,
          maxZoom: 14,
          animate: {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.75,
          },
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          attribution:
            '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
        }
      ),
      googleHybrid: L.tileLayer(
        "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
        {
          id: "googleHybrid",
          minZoom: 6,
          maxZoom: 14,
          animate: {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.75,
          },
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          attribution:
            '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
        }
      ),
      googleSat: L.tileLayer(
        "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
          id: "googleSat",
          minZoom: 6,
          maxZoom: 14,
          animate: {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.75,
          },
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          attribution:
            '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
        }
      ),
      googleTerrain: L.tileLayer(
        "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        {
          id: "googleTerrain",
          minZoom: 6,
          maxZoom: 14,
          animate: {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.75,
          },
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
          attribution:
            '&copy; <a href="https://www.saferoad.com.sa">Saferoad</a>',
        }
      ),
      Osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        id: "Osm",
        minZoom: 6,
        maxZoom: 14,
        animate: {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.75,
        },
      }),
      Mapbox: L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
          "pk.eyJ1IjoibWhkMjExMSIsImEiOiJjazh6a2x4eWwwc2ZiM21zN2VpN3ByM3NmIn0.SneM6KBzLB1BKhkZdZVnWQ",
        {
          id: "Mapbox",
          minZoom: 6,
          maxZoom: 14,
          animate: {
            animate: true,
            duration: 1.5,
            easeLinearity: 0.75,
          },
        }
      ),
      Streets: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        {
          id: "Streets",
          minZoom: 1,
          maxZoom: 19,
          subdomains: ["server", "services"],
        }
      ),
      Topographic: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        {
          id: "Topographic",
          minZoom: 1,
          maxZoom: 19,
          subdomains: ["server", "services"],
        }
      ),
      DarkGray: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          id: "DarkGray",
          minZoom: 1,
          maxZoom: 16,
          subdomains: ["server", "services"],
        }
      ),
      DarkGrayLabels: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          id: "DarkGrayLabels",
          minZoom: 1,
          maxZoom: 16,
          subdomains: ["server", "services"],
          pane: "esri-labels",
        }
      ),
      Gray: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          id: "Gray",
          minZoom: 1,
          maxZoom: 16,
          subdomains: ["server", "services"],
        }
      ),
      GrayLabels: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        {
          id: "GrayLabels",
          minZoom: 1,
          maxZoom: 16,
          subdomains: ["server", "services"],
          pane: "esri-labels",
        }
      ),
      Imagery: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          id: "Imagery",
          minZoom: 1,
          maxZoom: 22,
          maxNativeZoom: 22,
          downsampled: !1,
          subdomains: ["server", "services"],
        }
      ),
      ImageryLabels: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        {
          id: "ImageryLabels",
          minZoom: 1,
          maxZoom: 19,
          subdomains: ["server", "services"],
          pane: "esri-labels",
        }
      ),
      ImageryTransportation: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
        {
          id: "ImageryTransportation",
          minZoom: 1,
          maxZoom: 19,
          subdomains: ["server", "services"],
          pane: "esri-labels",
        }
      ),
      Terrain: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
        {
          id: "Terrain",
          minZoom: 1,
          maxZoom: 13,
          subdomains: ["server", "services"],
        }
      ),
      TerrainLabels: L.tileLayer(
        "https://{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
        {
          id: "TerrainLabels",
          minZoom: 1,
          maxZoom: 13,
          subdomains: ["server", "services"],
          pane: "esri-labels",
        }
      ),
    },
  },
  map: {},
};

//Saferoad Library Defintion
L.Saferoad = {};
L.Saferoad.version = "1.2.5";

export const Saferoad = L.Saferoad;

//Map Class Defintion
Saferoad.Map = L.Map.extend({
  initGroups: function () {
    this.groups.cluster = L.markerClusterGroup({
      disableClusteringAtZoom: Mapjs.const.options.maxZoom,
      iconCreateFunction: function (cluster) {
        return clustericon(cluster);
      },
    });
    this.groups.noncluster = L.featureGroup();

    console.log("leaflet", L);

    this.groups.markerGroup = L.featureGroup().addTo(this);
    this.groups.geofenceGroup = L.featureGroup().addTo(this);
    this.groups.poiGroup = L.featureGroup().addTo(this);
    this.groups.drawGroup = L.featureGroup().addTo(this);
    this.controls.control = L.featureGroup().addTo(this);

    this.setCluster(true);

    var clustericon = function (cluster) {
      let clusterUrl = "/assets/";

      var count = cluster.getChildCount();
      var img = count < 10 ? 1 : parseInt(Math.log10(count));
      var htmldiv =
        "<img class='icon' src='" +
        clusterUrl +
        "images/map/m" +
        img +
        ".png'>" +
        "<span class='label L" +
        img +
        "'>" +
        count +
        "</span><div class='tip' style='display:none'></div>";
      return L.divIcon({
        html: htmldiv,
        className: "clus-i",
        iconSize: L.point(52, 52),
      });
    };
  },

  groups: {
    cluster: null,
    noncluster: null,
    markerGroup: null,
    geofenceGroup: null,
    poiGroup: null,
    drawGroup: null,
  },
  controls: {
    control: null,
  },
  lists: {
    uservehs: {},
    drawList: [],
    measurePoints: [],
    coordinatePoint: [],
  },
  counters: {
    addrSync: null,
    timerCount: null,
  },
  notifyMsg: "",
  setNotifyMsg: function (selectedGeofenceSpeed, fenceSpeed) {
    return (this.notifyMsg = `your speed for vehcele is ${selectedGeofenceSpeed} and it should be lower than ${fenceSpeed} for the Geofence`);
  },
  getLatLngsOnHoverMap: function () {
    var lat, lng;

    this.addEventListener("mousemove", function (ev) {
      lat = ev?.latlng?.lat;
      lng = ev?.latlng?.lng;
    });

    console.log("lat, lng", lat, lng);
  },
  // addLayerAlt,
  setCluster: function (_enableCluster) {
    if (_enableCluster) {
      this.groups.noncluster.eachLayer((m) => this.groups.cluster.addLayer(m));
      this.removeLayer(this.groups.noncluster);
      this.addLayer(this.groups.cluster);
      this.groups.noncluster.clearLayers();
    } else {
      var vehicles = this.groups.cluster.getLayers();
      vehicles.forEach((m) => this.groups.noncluster.addLayer(m));
      this.removeLayer(this.groups.cluster);
      this.addLayer(this.groups.noncluster);
      this.groups.cluster.clearLayers();
    }
  },
  activeGroup: function () {
    return this.hasLayer(this.groups.cluster)
      ? this.groups.cluster
      : this.groups.noncluster;
  },
  visibleGroup: function () {
    var visible = L.featureGroup();
    this.activeGroup().eachLayer((m) => {
      if (this.getBounds().contains(m.getLatLng())) visible.addLayer(m);
    });
    return visible;
  },
  addVehicle: function (vehicle, options = { doRezoom: true }) {
    this.activeGroup().addLayer(vehicle);
    if (options["doRezoom"]) this.rezoom("visible", vehicle);
  },
  removeVehicle: function (vehicle, options = { doRezoom: true }) {
    this.activeGroup().removeLayer(vehicle);
    if (options["doRezoom"]) this.rezoom();
  },
  rezoom: function (_, _newMark) {
    var group = this.activeGroup();
    if (_newMark instanceof L.Marker) group.addLayer(_newMark);

    var markers = group.getLayers();
    if (markers.length === 1) {
      this.flyTo(
        markers[0].getLatLng(),
        Mapjs.const.options.maxZoom,
        Mapjs.const.options.animate
      );
    } else if (markers.length > 1) {
      group.eachLayer(function (marker) {
        marker.closePopup();
      }); //.vehicles.forEach(vehicle => { vehicle.marker.closePopup(); });
      var bound = group.getBounds();
      var minzoom = this.getBoundsZoom(bound);

      this.flyTo(
        bound.getCenter(),
        minzoom < Mapjs.const.options.maxZoom
          ? minzoom
          : Mapjs.const.options.maxZoom,
        Mapjs.const.options.animate
      );
    } else {
      this.setView(
        Mapjs.const.locs.ksa,
        Mapjs.const.options.minZoom,
        Mapjs.const.options.animate
      );
    }
  },
  deselectAll: function (options = { doRezoom: true }) {
    this.activeGroup().clearLayers();
    if (options["doRezoom"]) this.rezoom();
  },
  inGeofence: function (selectedGeofence) {
    // let Layers = this.activeGroup().getLayers();
    // selectedGeofence;

    var inside = false;

    let Layers = this.groups.drawGroup.getLayers();

    Layers.map((item) => {
      if (item.options.type === "polygon") {
        let vs = item.getLatLngs()[0]?.map((x) => [x.lat, x.lng]);
        // console.log("getLatLngs in polygon", vs);

        var Latitude = selectedGeofence.Latitude,
          Longitude = selectedGeofence.Longitude;

        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          var Latitude_i = vs[i][0],
            Longitude_i = vs[i][1];
          var Latitude_j = vs[j][0],
            Longitude_j = vs[j][1];

          var intersect =
            Longitude_i > Longitude != Longitude_j > Longitude &&
            Latitude <
              ((Latitude_j - Latitude_i) * (Longitude - Longitude_i)) /
                (Longitude_j - Longitude_i) +
                Latitude_i;

          // console.log("selectedGeofence.Speed", selectedGeofence.Speed);
          // console.log("item.options.Speed", item.options.Speed);
          if (intersect && selectedGeofence.Speed >= item.options.Speed) {
            this.setNotifyMsg(selectedGeofence.Speed, item.options.Speed);
            inside = !inside;
          }

          // item.options.Speed
          // selectedGeofence.Speed
        }
      }

      if (item.options.type === "circle") {
        var distance = this.distance(
          {
            lat: selectedGeofence.Latitude,
            lng: selectedGeofence.Longitude,
          },
          item.getLatLng()
        );

        // the marker is inside the circle when the distance is inferior to the radius
        inside = distance < item.getRadius();
        if (inside && selectedGeofence.Speed >= item.options.Speed) {
          this.setNotifyMsg(selectedGeofence.Speed, item.options.Speed);
        }
      }

      if (item.options.type === "rectangle") {
        // var bounds = [item.getBounds()._northEast, item.getBounds()._southWest];

        // let altPath = [
        //   [bounds[0].lat, bounds[0].lng],
        //   [bounds[1].lat, bounds[1].lng],
        // ];

        // console.log("getLatLngs in rectangle", altPath);

        inside = item.getBounds().contains({
          lat: selectedGeofence.Latitude,
          lng: selectedGeofence.Longitude,
        });

        if (inside && selectedGeofence.Speed >= item.options.Speed) {
          this.setNotifyMsg(selectedGeofence.Speed, item.options.Speed);
        }
      }
    });

    return inside;
  },
  UpdateMarker: function (locInfo, options) {
    this.inGeofence(locInfo);

    var m = this.activeGroup()
      .getLayers()
      .find((x) => x?.options?.locInfo?.VehicleID == locInfo?.VehicleID);
    if (m != undefined) {
      this.pin(locInfo, options); //, contentString);
    }

    return m;
  },
  pin: function (_locInfo, options) {
    var latlng = L.latLng(
      _locInfo?.Latitude ? _locInfo?.Latitude : 0,
      _locInfo?.Longitude ? _locInfo?.Longitude : 0
    );
    var newMark = Saferoad.vehicle(latlng, {
      locInfo: _locInfo,
      popupSettings: this.options.popupSettings,
    });
    var oldMark = this.getVehicle(_locInfo?.VehicleID);

    if (typeof oldMark === "undefined") this.addVehicle(newMark, options);
    else if (
      new Date(newMark?.options?.locInfo?.RecordDateTime) >
        new Date(oldMark?.options?.locInfo?.RecordDateTime) ||
      options?.history
    )
      oldMark.animate(this, _locInfo);

    return _locInfo?.VehicleID;
  },
  unpin: function (_VehicleID, options = { doRezoom: true }) {
    var oldMark = this.getVehicle(_VehicleID);
    if (typeof oldMark === "undefined") return;
    this.removeVehicle(oldMark, options);
    //console.log("unpined");
    this.setCluster(true);
  },
  getVehicle: function (_VehicleID) {
    return this.activeGroup()
      .getLayers()
      .find((x) => x?.options?.locInfo?.VehicleID == _VehicleID);
  },
  isExist: function (_VehicleID) {
    return this.groups.cluster
      .getLayers()
      ?.map((x) => x?.options?.locInfo?.VehicleID)
      .includes(_VehicleID);
  },
  addEvents: function () {
    this.on("click", Saferoad.Map.Events.click);
    this.on("mousemove", Saferoad.Map.Events.mousemove);
    this.on("popupopen", function () {
      // var locInfo = e.popup._source?.options?.locInfo;
      // var dur = Math.abs(new Date(locInfo?.RecordDateTime) - Date.now());
      // var _divID = ".pop_V_" + locInfo?.VehicleID + " #Address";
      // if (
      //   $(_divID).length &&
      //   (!isValidAddress(locInfo.Address) || dur > 5 * 6e4)
      // ) {
      //   getAddress(locInfo.SerialNumber, $(_divID));
      // }
    });
    this.on("zoomend", Saferoad.Map.Events.zoomend),
      //  this.on(L.Draw.Event.CREATED, Saferoad.Map.Events.drawCreated); //event for draw geofence and poi

      this.groups.cluster.on("clustermouseover", (a) => {
        var exportUrl = (c) =>
          "/Map/exportClusterVehicles?vehicleIDs=" +
          c?.map((m) => m?.options?.locInfo?.VehicleID).join(",");
        var markers = a.layer.getAllChildMarkers();
        var rows = [];

        markers.every((mark, i) => {
          var loc = mark?.options?.locInfo;
          var row =
            "<tr><td width='155'>" +
            loc.DisplayName +
            "</td><td><div class='Speed'>" +
            loc.Speed +
            "<span>Kmh</span></div></td><td>" +
            Saferoad.Vehicle.Helpers.VStatusToIcon(loc.VehicleStatus) +
            "</td></tr>";
          rows.push(row);
          return !(i > 30);
        });
        var topbar = [
          "<a class='act' onClick='event.stopPropagation()' href='" +
            exportUrl(markers) +
            "'><i class='fas fa-file-download'></i></a>",
          "<a href='#'><i class='fas fa-search-plus'></i></a>",
        ];
        topbar = "<div class='bar'>" + topbar.join("") + "</div>";

        $(a.layer._icon)
          .find(".tip")
          .html(topbar + "<table>" + rows.join("") + "</table>");
        $(a.layer._icon).find(".tip").css("display", "block");
        $(a.layer._icon)
          .find(".tip")
          .bind("mousewheel", ".tip", function (e) {
            e.stopPropagation();
          });
      });
    this.groups.cluster.on("clustermouseout", (a) => {
      $(a.layer._icon).find(".tip").css("display", "none");
      $(a.layer._icon).find(".tip").unbind("mousewheel");
    });
  },
});
Saferoad.Map.addInitHook(function () {
  this.options.layers = Mapjs.const.tiles.googleStreetsJS;
  var tiles = Mapjs.const.tiles;

  var overlayMaps = {};

  var baseMaps = {
    Saferoad: tiles.Saferoad,
    "Google Hybrid": tiles.googleHybridJS,
    "Google Streets": tiles.googleStreetsJS,
    "Google Dark": tiles.googleStreetsDarkJS,
  };

  this.options.animation = this.options.animation ?? "simple";

  L.control.fullscreen().addTo(this);
  L.control
    .layers(baseMaps, overlayMaps, { position: "bottomleft" })
    .addTo(this);
  this.initGroups();
  this.addEvents();
});
Saferoad.Map.Events = {
  click: function (e) {
    var measureActive = $("#Measure").hasClass("imgclicked");
    var coordinatesActive = $("#Coordinates").hasClass("imgclicked");

    if (measureActive) {
      if (Mapjs?.map.lists.measurePoints.length > 0) {
        var points = [Mapjs?.map.lists.measurePoints[0], e.latlng];
        var distance = (points[0].distanceTo(points[1]) / 1000).toFixed(3);

        Mapjs.helpers.geocoding("#fromAddr", points[0]);
        Mapjs.helpers.geocoding("#toAddr", points[1]);
        $("#CoordinatesResultText").html(
          "Distance is " +
            distance +
            " KM" +
            '<BR>From: <span id="fromAddr">' +
            points[0] +
            "</span>" +
            '<BR>To: <span id="toAddr">' +
            points[1] +
            "</span>"
        );
        $("#CopyCoordinates").show();
        Mapjs?.map.lists.measurePoints.pop();
      } else {
        Mapjs?.map.groups.markerGroup.clearLayers();
        Mapjs?.map.lists.measurePoints.push(e.latlng);
      }
      L.marker(e.latlng).addTo(Mapjs?.map.groups.markerGroup);
    }

    if (coordinatesActive) {
      if (Mapjs?.map.lists.coordinatePoint.length > 0) {
        Mapjs?.map.lists.coordinatePoint.pop();
      } else {
        Mapjs?.map.lists.coordinatePoint.push(e.latlng);
        Mapjs.helpers.geocoding("#PointAddr", e.latlng);
        $("#CoordinatesResultText").html(
          "Point: " + e.latlng + '<BR>Address: <span id="PointAddr">'
        );
      }
    }
  },
  mousemove: function (e) {
    var coordinatesActive = $("#Coordinates").hasClass("imgclicked");

    if (coordinatesActive) {
      if (Mapjs?.map.lists.coordinatePoint.length == 0) {
        $("#CoordinatesResultText").html("Point: " + e.latlng);
      }
    }
  },
  drawCreated: function (e) {
    // $("#CircleCenter").val("");
    // $("#CircleRadius").val("");
    // $("#Path").val("");
    // $("#Bounds").val("");
    var layer = e.layer;

    // var location = new L.circleMarker();

    // Mapjs?.map.removeLayer(location);

    switch (e.layerType) {
      case "circle":
        $(`#1234`).val(
          JSON.stringify({
            lat: layer.getLatLng().lat,
            lng: layer.getLatLng().lng,
            rad: layer.getRadius(),
          })
        );
        break;
      case "polygon":
        var paths = "";
        layer.getLatLngs()[0].forEach((x) => {
          paths += "|" + x.lat + "," + x.lng;
        });
        $("#Path").val(paths);
        break;
      case "rectangle":
        var bounds = [
          layer.getBounds()._northEast,
          layer.getBounds()._southWest,
        ];
        bounds =
          "(" +
          bounds[0].lat +
          "," +
          bounds[0].lng +
          ")|(" +
          bounds[1].lat +
          "," +
          bounds[1].lng +
          ")"; // bounds[0] ~ _northEast, bounds[1] ~ _southWest
        $("#Bounds").val(bounds);
        break;
      case "marker":
        $("#POILatitude").val(layer.getLatLng().lat);
        $("#POILongitude").val(layer.getLatLng().lng);
        break;
    }
    this.groups.drawGroup.addLayer(layer);
  },
  zoomend: function () {
    var markers = this.activeGroup().getLayers();
    if (markers.length == 1) {
      if (this.activeGroup() == this.groups.cluster)
        this.groups.cluster.zoomToShowLayer(markers[0], () =>
          markers[0].openPopup()
        );
      else markers[0].openPopup();
    }
  },
};
Saferoad.map = (element, options) => new Saferoad.Map(element, options);
//Icon Class Defintion
Saferoad.Icon = L.Icon.extend({
  options: {
    VehicleStatus: null,
  },
  initialize: function (options) {
    options = L.Util.setOptions(this, options);
    options.iconSize = [15, 33];
    options.iconAnchor = [15, 15];
    options.iconUrl = Saferoad.Icon.Helpers.iconUrl(options.VehicleStatus);
    L.setOptions(this, options);
  },
  refresh: function () {
    this.options.iconUrl = Saferoad.Icon.Helpers.iconUrl(
      this.options.VehicleStatus
    );
  },
});
Saferoad.icon = (options) => new Saferoad.Icon(options);
Saferoad.Icon.Helpers = {
  iconUrl: function (VehicleStatus) {
    let iconUrl = "/assets/images/cars/";
    switch (VehicleStatus) {
      case 0:
      case 1:
      case 2:
      case 5:
      case 100:
      case 101:
        iconUrl += VehicleStatus + ".png";
        break;
      case 600:
        iconUrl += "5.png";
        break;
      default:
        iconUrl += "201.png";
    }
    return iconUrl;
  },
};

//Vehicle Class Defintion
Saferoad.Vehicle = L.Marker.extend({
  options: {
    //Set Default Value before read entered options
    locInfo: {},
    locSync: null,
  },
  initialize: function (latlng, _options) {
    var options = Object.assign({}, _options);
    //Set variable values after getting options
    this.id = options?.locInfo?.VehicleID;
    this._latlng = latlng;
    options = L.Util.setOptions(this, options);
    options.icon = Saferoad.icon({
      VehicleStatus: options?.locInfo?.VehicleStatus,
    });
    options.rotationAngle = options?.locInfo?.Direction ?? 0;
    L.setOptions(this, options);

    this.bindPopup(
      Saferoad.popup({
        locInfo: options?.locInfo,
        popupSettings: this.options.popupSettings,
      })
    );
    this.bindTooltip(options?.locInfo?.DisplayName);
  },

  animate: function (map, _locInfo) {
    if (map.options.animation == "advanced") {
      if (this.slideFinish())
        this.setRotationAngle(this.options?.locInfo?.Direction);
      this.advancedAnimate(_locInfo);
    } else {
      this.setLatLng([_locInfo?.Latitude, _locInfo?.Longitude]);
    }

    this.setIcon(Saferoad.icon({ VehicleStatus: _locInfo?.VehicleStatus }));
    this.setRotationAngle(_locInfo?.Direction);
    this.getPopup().UpdateContent(_locInfo); //_oldVeh._popup.setContent(_newVeh.getPopup().getContent());
    this.options.locInfo = _locInfo;
  },

  advancedAnimate: function (_locInfo) {
    var leastAngleChange = (ang1, ang2) =>
      Math.abs(((ang2 - ang1 + 180) % 360) - 180);
    var oneStep = (_anglDiff, _duration) => {
      var angleSign =
        this.options?.locInfo?.Direction + _anglDiff - _locInfo?.Direction
          ? 1
          : -1;
      this.setRotationAngle(
        this.options?.locInfo?.Direction + 0.5 * _anglDiff * angleSign
      );
      this.slideTo([_locInfo?.Latitude, _locInfo?.Longitude], {
        duration: _duration,
      });
    };
    var multiSteps = (_from, _duration) => {
      var url = `http://40.114.70.142:5000/route/v1/driving/${_from.lng},${_from.lat};${_locInfo?.Longitude},${_locInfo?.Latitude}?steps=true`; //"40.114.70.142:5000" //"router.project-osrm.org"
      var jqxhr = $.ajax({ url: url, cache: true });
      jqxhr.done((data) => {
        var ETA = data.routes[0].duration;
        data.routes[0].legs[0].steps.forEach((step) => {
          if (step.maneuver.type == "arrive") return;

          var stepDur = _duration * (step.duration / ETA);
          var stepDir = step.maneuver.bearing_after;
          var stepTo = step.maneuver.location;
          this.slideTo([stepTo[1], stepTo[0]], { duration: stepDur });
          this.setRotationAngle(stepDir);
        });
        this.slideTo([_locInfo?.Latitude, _locInfo?.Longitude], {
          duration: 100,
        });
      });
      jqxhr.fail(() => {
        this.setLatLng([_locInfo?.Latitude, _locInfo?.Longitude]);
      });
    };

    var fromCoor = this.getLatLng();
    var distDiff = fromCoor.distanceTo([
      _locInfo?.Latitude,
      _locInfo?.Longitude,
    ]);
    var timeDiff = Math.abs(
      new Date(this.options.locInfo?.RecordDateTime) -
        new Date(_locInfo?.RecordDateTime)
    );
    var anglDiff = leastAngleChange(
      this.options.locInfo?.Direction,
      _locInfo?.Direction
    );
    var timedelay = Math.abs(Date.now() - new Date(_locInfo?.RecordDateTime));
    var applyTime = Math.min(
      Math.max(60e3 - timedelay, 10e3),
      (distDiff * 3600) / 80
    );

    if (
      Mapjs?.map.getZoom() >= 13 &&
      Mapjs?.map.getBounds().contains(this.getLatLng())
    ) {
      timeDiff < 120e3 && distDiff < 500 && anglDiff < 25
        ? oneStep(anglDiff, applyTime)
        : multiSteps(fromCoor, applyTime);
    } else {
      this.setLatLng([_locInfo?.Latitude, _locInfo?.Longitude]);
    }
  },
  setTreeNode: function (enable) {
    $("#GroupsList").jstree(
      enable ? "enable_node" : "disable_node",
      "V_" + this.options?.locInfo?.VehicleID
    );
  },
  sync: function () {
    this.options.rotationAngle = this.options?.locInfo?.Direction ?? 0;
    this.options.title = "";
    //this.setIcon();
  },
});
Saferoad.vehicle = (latlng, options) => new Saferoad.Vehicle(latlng, options);
Saferoad.Vehicle.Helpers = {
  VStatusToIcon: (VehicleStatus) => {
    switch (VehicleStatus) {
      case 0:
        return '<i class="fas fa-parking" style="color:#4D413D;"></i>';
      case 1:
        return '<i class="fas fa-play-circle" style="color:#93AC35;"></i>';
      case 2:
        return '<i class="fas fa-pause-circle" style="color:#0B8949;"></i>';

      case 5:
      case 600:
        return '<i class="fas fa-stop-circle" style="color:#B8B2AC;"></i>';
      case 101:
        return '<i class="fas fa-exclamation-circle" style="color:#C03728;"></i>';
      case 100:
        return '<i class="fas fa-exclamation-circle" style="color:#CF7D29;"></i>';
      default:
        return '<i class="fas fa-minus-circle" style="color:#0D6DA6;"></i>';
    }
  },
  VStatusToColor: (VehicleStatus) => {
    switch (VehicleStatus) {
      case 0:
        return "#4D413D";
      case 1:
        return "#93AC35";
      case 2:
        return "#0B8949";
      case 5:
      case 600:
        return "#B8B2AC";
      case 101:
        return "#C03728";
      case 100:
        return "#CF7D29";
      default:
        return "#0D6DA6";
    }
  },
  StatusTypes: {
    isOnline: (VehicleStatus) => ![5, 600].includes(VehicleStatus),
    isOffline: (VehicleStatus) => [5, 600].includes(VehicleStatus),
  },
  WeightVoltToKG: (_locInfo, _settings) => {
    if (_locInfo?.WeightVolt < 0) return _settings.WeightReading;
    if (
      _locInfo?.WeightVolt < _settings.MinVoltage ||
      _settings.MinVoltage == _settings.MaxVoltage
    )
      return Resources.Tips.NA;

    var weight =
      _settings.MaxVoltage == _settings.MinVoltage
        ? 0
        : ((_locInfo?.WeightVolt - _settings.MinVoltage) *
            _settings.TotalWeight) /
          (_settings.MaxVoltage - _settings.MinVoltage);
    weight += _settings.HeadWeight;
    return weight.toFixed(1);
  },
  Date2UTC: (_date) =>
    new Date(
      _date.indexOf("Date") < 0
        ? _date + "+0000"
        : moment.utc(_date).format("YYYY-MM-DDTHH:mm:ss") + "-0300"
    ),
  Date2KSA: (_date, _zone = 3) =>
    moment
      .utc(_date)
      .utcOffset(_zone * 60)
      .format("LL hh:mm:ss a"),
};

// Popup Class Defintion
Saferoad.Popup = L.Popup.extend({
  options: {
    //Set Default Value before read entered options
    locInfo: {},
  },
  initialize: function (options) {
    options = L.Util.setOptions(this, options);
    L.setOptions(this, options);
  },
  addEvents: function () {
    this.on("add", Saferoad.Popup.Events.add);
    this.on("remove", Saferoad.Popup.Events.remove);
  },
  syncContent: function () {
    let { dontShowPopUp } = this.options.popupSettings;
    var row = (content, style = "") => {
      return `<div class="row rowPoi popcol" style="${style}">${content}</div>`;
    };

    var prop = (
      id,
      val = "",
      unit = "",
      style = "",
      align = "l",
      fsize = 0.8
    ) => {
      var tips = Resources.Tips[id] ?? id;
      var icon = Resources.Icons[id] ?? id;
      var icsize = align == "t" ? "3" : fsize * 1.6;
      var value = (align == "t" ? "<BR>" : " ") + val;

      style += val == null ? (style != "" ? ";" : "") + "display: none" : "";
      if (!style.includes("none")) {
        return (
          `<div id="col-${id}" class="col" style="text-align: start; display: flex; align-items: center; padding-left: 0px; padding-right: 0px; ${style}">
              <span title="${tips}" style="font-size:${fsize}rem !important; display: flex; align-items: center;">
                <i class="${icon} pe-1" style="color: rgb(0 67 60);font-size: ${icsize}vh !important;"></i>` +
          `     <span id="${id}" style="width:${
            id === "Address" ? "75%" : "auto"
          }">${value}</span>
              </span>
            <span class="unit">${unit}</span>
          </div>`
        );
      } else {
        return (
          `<div id="col-${id}" class="col" style="text-align: start; padding-left: 0px; padding-right: 0px;"><span title="${tips}" style="font-size:${fsize}rem !important"><i class="${icon} pe-1" style="color: rgb(0 67 60);font-size: ${icsize}vh !important;"></i>` +
          ` <span id="${id}">${value}</span></span><span class="unit">${unit}</span></div>`
        );
      }
    };

    var locInfo = this.options?.locInfo;

    var addr = () =>
      locInfo?.Address && locInfo?.Latitude && locInfo?.Longitude
        ? "(" + locInfo?.Latitude + "," + locInfo?.Longitude + ")"
        : null;
    var driver = () =>
      locInfo?.DriverID > 0 && locInfo?.DriverID != null
        ? `<a href="/Drivers/Index?DriverID=${locInfo?.DriverID}"  target="_blank" > ${locInfo?.DriverName}</a>`
        : Resources.Tips.DriverNA;
    var senscss = !locInfo?.HasSensor ? "display: none" : "";
    var content = '<div class="container">';

    content += row(
      prop("RecordDateTime", locInfo?.RecordDateTime) +
        prop("Speed", locInfo?.Speed + " km/h")
    );

    content += !window.location.href.includes("history?VehID=")
      ? row(
          prop("Direction", locInfo?.Direction ?? "Unknown" + " &deg;") +
            prop(
              "EngineStatus",
              Saferoad.Popup.Helpers.EStatusToStr(locInfo?.EngineStatus) ??
                "Unknown"
            )
        )
      : row(
          prop("Direction", locInfo?.Direction ?? "Unknown" + " &deg;") +
            prop(
              "Latitude , Longitude",
              `${locInfo?.Latitude ?? "Unknown"} , ${
                locInfo?.Longitude ?? "Unknown"
              }`
            )
        );
    content += !window.location.href.includes("history?VehID=")
      ? row(
          prop(
            "VehicleStatus",
            Saferoad.Popup.Helpers.VStatusToStr(locInfo?.VehicleStatus) ??
              "Unknown"
          ) + prop("Mileage", locInfo?.Mileage ?? "Unknown", " KM")
        ) +
        row(
          prop(
            "Duration",
            Saferoad.Popup.Helpers.DurationToStr(locInfo?.Duration) ??
              "Unknown",
            "",
            ""
          ) + prop("DriverUrl", driver())
        ) +
        row(
          prop("GroupName", locInfo?.GroupName ?? "Unknown") +
            prop("PlateNumber", locInfo?.PlateNumber ?? "Unknown")
        ) +
        row(
          prop("SimCardNumber", locInfo?.SimSerialNumber ?? "Unknown") +
            prop("SerialNumber", locInfo?.SerialNumber ?? "Unknown")
        )
      : "";

    content += !window.location.href.includes("history?VehID=")
      ? row(
          prop(
            "IgnitionStatus",
            Saferoad.Popup.Helpers.IgnitionToStr(locInfo?.IgnitionStatus) ??
              "Unknown"
          ) +
            prop(
              "weightreading",
              locInfo?.TotalWeight ?? "Unknown",
              " kg",
              senscss
            )
        )
      : "";
    content += !window.location.href.includes("history?VehID=")
      ? row(
          prop(
            "Temp",
            locInfo?.Temp === null ||
              isNaN(locInfo?.Temp) ||
              locInfo?.Temp === 0 ||
              locInfo?.Temp < 0
              ? "Not Available"
              : locInfo?.Temp,
            " C",
            senscss
          ) +
            prop(
              "HUM",
              locInfo?.HUM === null ||
                isNaN(locInfo?.HUM) ||
                locInfo?.HUM === 0 ||
                locInfo?.HUM < 0
                ? "Not Available"
                : locInfo?.HUM,
              "<i class='fas fa-humidity'></i>",
              senscss
            )
        )
      : "";
    content += !window.location.href.includes("history?VehID=")
      ? row(
          prop(
            "Address",
            addr() === null ? "Not Available" : addr(),
            "",
            "text-align: center;"
          )
        )
      : row(
          prop(
            "VehicleStatus",
            Saferoad.Popup.Helpers.VStatusToStr(locInfo?.VehicleStatus) ??
              "Unknown"
          )
        );
    content += "</div>";

    var container = `<div id="MovePopup" data-VehicleID="${locInfo?.VehicleID}" class="iwcontent pop-up-map-specific pop_V_${locInfo?.VehicleID}">`;
    container += `<div class="iwtitle"><span>${
      !window.location.href.includes("history?VehID=")
        ? locInfo?.DisplayName
        : locInfo?.Address
    }</span></div>`;

    let FullHistoryPlayBackDiv = `
    <button class='btnHPB'>
      <span>
        <a style={color:#FFF !important} href="/history?VehID=${locInfo?.VehicleID}" target="_blank">
          <span >Full History PlayBack</span>
        </a>
      </span>
    </button>
    `;

    container += `<div id="iwcontent"><span class="field2" style="padding:0;border:0;">${content}</span>
    
    <div class='actionsBtnsContainer'>
    <button class='dropbtn'><span>Actions</span></button>
    ${
      !window.location.href.includes("history?VehID=")
        ? FullHistoryPlayBackDiv
        : `
          <button disabled class='btnHPB'>
            <span>
              <span>Full History PlayBack</span>
            </span>
          </button>
          `
    }
    <div class='innerBtns'>
    <div class='btnStyle'>
      <button onclick="getElementById('EditInformationBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('EditInformationBtn').click();"><span>Edit Information</span></button>
      <button onclick="getElementById('CalibrateMileageBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('CalibrateMileageBtn').click();"><span>Calibrate Mileage</span></button>
      <button onclick="getElementById('CalibrateWeightSettingBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('CalibrateWeightSettingBtn').click();"><span>Calibrate Weight Setting</span></button>
      <button onclick="getElementById('ShareLocationBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('ShareLocationBtn').click();"><span>Share Location</span></button>
      <button onclick="getElementById('SubmitACommandBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('SubmitACommandBtn').click();"><span>Submit A Command</span></button>
      <button onclick="getElementById('DisableVehicleBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('DisableVehicleBtn').click();"><span>Disable Vehicle</span></button>
      <button onclick="getElementById('EnableVehicleBtn').setAttribute('data-Id',${
        locInfo?.VehicleID
      });getElementById('EnableVehicleBtn').click();"><span>Enable Vehicle</span></button>

    </div>
      </div>
        
          
      </div>
    </div>
    </div>`;

    if (dontShowPopUp) {
      this.setContent(container);
    }
  },
  getButtons: function () {
    return getmainbuttons(this.options?.locInfo);
  },
  UpdateContent: function (_locInfo) {
    var div = $("#MovePopup.pop_V_" + _locInfo?.VehicleID);
    if (typeof div == "undefined") return;

    this.options.locInfo = _locInfo;
    this.syncContent();
  },
});
Saferoad.Popup.addInitHook(function () {
  this.addEvents();
  this.syncContent();
});
Saferoad.popup = (options) => new Saferoad.Popup(options);
Saferoad.Popup.Helpers = {
  IgnitionToStr: (VehicleStatus) =>
    VehicleStatus == 1
      ? Resources.Status.IgnitionEnabled
      : Resources.Status.IgnitionDisabled,
  EStatusToStr: (EngineStatus) =>
    EngineStatus ? Resources.Status.EngineOn : Resources.Status.EngineOff,
  VStatusToStr: (VehicleStatus) => {
    switch (VehicleStatus) {
      case 600:
      case 5:
        return Resources.Status.VehicleOffline;
      case 101:
        return Resources.Status.VehicleOverSpeed;
      case 100:
        return Resources.Status.VehicleOverStreetSpeed;
      case 0:
        return Resources.Status.VehicleStopped;
      case 1:
        return Resources.Status.VehicleRunning;
      case 2:
        return Resources.Status.VehicleIdle;
      default:
        return Resources.Status.VehicleInvalid;
    }
  },
  DurationToStr: (ms) => {
    var pad = (n, z = 2) => (n < 99 ? ("00" + n).slice(-z) : "+99");
    return `${pad((ms / 8.64e7) | 0)}d:${pad(
      ((ms % 8.64e7) / 3.6e6) | 0
    )}:${pad(((ms % 3.6e6) / 6e4) | 0)}:${pad(((ms % 6e4) / 1e3) | 0)}`;
  },
};
Saferoad.Popup.Events = {
  add: function () {
    //e.target.syncContent();
    //console.log(`${e.target.options.locInfo.VehicleID}: Popup show`);
  },
  remove: function () {
    //console.log(`${e.target.options.locInfo.VehicleID}: Popup hide`);
  },
};
