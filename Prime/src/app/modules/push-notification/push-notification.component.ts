import { Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  vapidKeys: string = `BADdk_vfLNd_UFgkCv2Ip12luBjcOP_iAg1RU490Te2-XQlKNWNdB-STSHBfOzSBFH2zW99jixVbA3mvvL7Povc`;
  // readonly VAPID_KEY = 'BNtm-GAQ8YJdZUniE2kM5g1QysrQw0HZSdCuu9RSqIrGlrpi82eYi3pRa9Lhj1Hn3Lspc-ANq2v-zwS34X1zca4';
  payload = JSON.stringify({
    "notification": {
      "title": "Web Mail Notification",
      "body": "New Mail Received!",
      "icon": "images/bell.jpg",
      "vibrate": [100, 50, 100], //will cause the device to vibrate for 100 ms, be still for 50 ms, and then vibrate for 100 ms
      "requireInteraction": true,
      "data": { "dateOfArrival": Date.now(), },
      "actions": [{ "action": "inbox", "title": "Go to Web Mail", }]
    }
  })

  constructor
    (
      private swUpdate: SwUpdate,
      private swPush: SwPush,
      private service: NotificationService
    ) {
    swUpdate.available.subscribe(swUpdate => {
      console.log("update available");

    })
  }
  triggerMessage() {
    this.service.triggerMessage(this.payload).subscribe(x => console.log(x), err => console.log(err));
  }

  subscribeToNotifications() {
    if (this.swPush.isEnabled) {
      this.swPush.notificationClicks.subscribe(x => console.log(x)); this.swPush.requestSubscription({
        serverPublicKey: this.vapidKeys
      })
        .then(sub => { this.service.subscribe(sub).subscribe(x => console.log(x), err => console.log(err)) })
        .catch(err => console.error("Could not subscribe to notifications", err));
    }
  }


  ngOnInit(): void {
  }

}
