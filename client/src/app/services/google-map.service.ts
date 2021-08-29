import { Injectable } from '@angular/core';
import { Component,ViewChild, ElementRef, OnInit  } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { google } from "google-maps";
import { Route } from '../../models/route';
import { Comment } from '../../models/comment';
import { RouteService } from '../../services/route.service';
import { CommentService } from '../../services/comment.service';
import {TokenStorageService} from "../../services/token-storage.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  constructor() { }
}
