import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public notificationURL = 'http://localhost:4200/subscribe';

  constructor(private http: HttpClient) { }

  subscribe(subscription: any) {
    return this.http.post('/app/' + 'subscribe', subscription).pipe(map(res => res));
  }
  triggerMessage(message: any) {
    return this.http.post('/app/' + 'message', JSON.parse(message)).pipe(map(res => res));
  }

  addPushSubscriber(sub: PushSubscription) {
    return this.http.post(this.notificationURL, sub).pipe(map(res => res));
  }

  send() {
    return this.http.post('/api/newsletter', null);
  }


}
