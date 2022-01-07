import { LocalStoreService } from './../../service/localstore.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { Subscription } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { log } from 'console';

declare let google: any;

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.page.html',
  styleUrls: ['./geolocation.page.scss'],
})
export class GeolocationPage implements OnInit {

  @ViewChild('map',{read:ElementRef,static:false}) mapView: ElementRef;

  map: any;
  marker: any;
  infowindow = new google.maps.InfoWindow();
  cityName;
  stateName;
  address;

  infoWindows: any=[];

  watchID;
  currentMapTrack =null;
  isTracking=false;
  trackedRoute=[];
  previousTracks=[];

  positionSubscription: Subscription;

  markers=[{
            name:'ICA Nära Gribbylund',
            latitude:59.462263,
            longitude:18.089484
          },
          {name:'Ängsholmsparken Lekplats',
          latitude:59.461461,
          longitude:18.095393
          },
  ];

  options= {
    center:{lat:0,lng:0},
    zoom:10,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl:false,
    streetViewControl:false,
    fullscreenControl:false
    // disableDefaultUI: true
  };



  constructor(public navCtrl: NavController,
              private plt: Platform,
              private localStoreService: LocalStoreService,
              private alertController: AlertController) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){

    const coordinates = await Geolocation.getCurrentPosition();
    this.options.center.lat=  coordinates.coords.latitude;
    this.options.center.lng= coordinates.coords.longitude;

    this.createMap();
  }

   createMap(){

    // const boundingRect= this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    // console.log('create map1',boundingRect);

    // CapacitorGoogleMaps.create({
    //   width: Math.round(boundingRect.width),
    //   height: Math.round(boundingRect.height),
    //   x: Math.round(boundingRect.x),
    //   y: Math.round(boundingRect.y),
    //   zoom: 5
    // });

    this.map = new google.maps.Map(this.mapView.nativeElement,this.options);

    // this.addMarkersToMap(this.markers);

    // Configure the click listener.
    this.map.addListener('click', (mapsMouseEvent) => {
      // Close the current InfoWindow.
      this.infowindow.close();
      this.options.center.lat= mapsMouseEvent.latLng.toJSON().lat;
      this.options.center.lng= mapsMouseEvent.latLng.toJSON().lng;
      this.geocodeLatLng(this.options.center);
      // Create a new InfoWindow.
      // this.infowindow = new google.maps.InfoWindow({
      //   position: mapsMouseEvent.latLng.toJSON(),
      // });
      // this.infowindow.setContent(this.address);
      // this.infowindow.open(this.map);
    });

    this.geocodeLatLng(this.options.center);

    }

    // reverse geocoding
    geocodeLatLng(position){

      const geocoder= new google.maps.Geocoder();
      geocoder.geocode({ location: position })
        .then((response) => {
            if (response.results[0]) {
              console.log(response.results[0]);
              this.address=response.results[0].formatted_address;

             if(response.results[0].address_components.length>0){
                response.results[0].address_components.forEach(element => {
                  if(element.types.includes('administrative_area_level_1')){
                        this.cityName=element.short_name;
                  }
                  if(element.types.includes('country')){
                    this.stateName=element.short_name;
                  }
                });
             }

              this.map.setZoom(15);

              if(this.marker !== undefined){
                   this.marker.setMap(null);
              }

               this.marker = new google.maps.Marker({
                position,
                map: this.map,
              });
              this.infowindow.setContent(response.results[0].formatted_address);
              this.infowindow.open(this.map, this.marker);
            } else {
              window.alert('No results found');
            }
      }).catch((e) => window.alert('Geocoder failed due to: ' + e));

    }



    addMarkersToMap(markers) {
      for(const marker of markers) {
        const position = new google.maps.LatLng(marker.latitude, marker.longitude);
        const dogwalkMarker = new google.maps.Marker({
          position,
          title: marker.name,
          latitude:marker.latitude,
          longitude:marker.longitude
          });
        dogwalkMarker.setMap(this.map);
        this.addInfoWindowToMarker(dogwalkMarker);
      }
    }

    addInfoWindowToMarker(marker) {
      const infoWindowContent = '<div id="content"><h2 id="firstHeading" class="firstHeading">'
                                 + marker.title +'</h2>'+
                                 '<ion-button id="navigate" size="small">Navigation</ion-button></div>';
      const infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
      });
      marker.addListener('click', () => {
        this.closeAllInfoWindows();
        infoWindow.open(this.map, marker);

        google.maps.event.addListenerOnce(infoWindow, 'domready',()=>{
          document.getElementById('navigate').addEventListener('click',()=>{
            console.log('------------');
            window.open('https://www.google.com/maps/dir/?api=1&destination='+marker.latitude+','+marker.longitude)
          });
       });

      });
      this.infoWindows.push(infoWindow);
    }

    closeAllInfoWindows() {
      for(const window of this.infoWindows) {
        window.close();
      }
    }



    startTracking() {

      this.isTracking = true;
      this.trackedRoute = [];
      // this.positionSubscription =
      Geolocation.watchPosition(
        {},
        (coordinates)=>{
            if(coordinates !== undefined )
              {
                console.log(coordinates);
                setTimeout(() => {
                  this.trackedRoute.push({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude });
                  this.redrawPath(this.trackedRoute);
                }, 0);
              }
        }
      ).then(
        id=> this.watchID =id
      );


    }

    redrawPath(path) {
      if (this.currentMapTrack) {
        this.currentMapTrack.setMap(null);
      }

      if (path.length > 1) {
        this.currentMapTrack = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: '#ff00ff',
          strokeOpacity: 1.0,
          strokeWeight: 3
        });
        this.currentMapTrack.setMap(this.map);
      }
    }

    stopTracking() {

      Geolocation.clearWatch(this.watchID);

      const newRoute = { finished: new Date().getTime(), path: this.trackedRoute };
      this.previousTracks.push(newRoute);
      this.localStoreService.saveToLocalStorage('routes', this.previousTracks);
      this.isTracking = false;
      // this.positionSubscription.unsubscribe();
      this.currentMapTrack.setMap(null);
    }


    loadHistoricRoutes() {
      this.localStoreService.getFromLocalStorage('routes').then(data => {
        if (data) {
          this.previousTracks = data;
        }
      });
    }

    showHistoryRoute(route) {
        this.redrawPath(route);
    }

  }

