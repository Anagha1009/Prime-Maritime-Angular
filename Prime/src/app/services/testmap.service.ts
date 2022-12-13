import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TestmapService {
  BASE_URL = environment.BASE_URL;


  constructor() { }
}
