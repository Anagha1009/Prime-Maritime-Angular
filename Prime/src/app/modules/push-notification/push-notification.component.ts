import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-push-notification',
  templateUrl: './push-notification.component.html',
  styleUrls: ['./push-notification.component.scss']
})
export class PushNotificationComponent implements OnInit {

  readonly VAPID_KEY = 'BNtm-GAQ8YJdZUniE2kM5g1QysrQw0HZSdCuu9RSqIrGlrpi82eYi3pRa9Lhj1Hn3Lspc-ANq2v-zwS34X1zca4';
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

  constructor(private swPush: SwPush, private service: NotificationService) { }
  triggerMessage() {
    this.service.triggerMessage(this.payload).subscribe(x => console.log(x), err => console.log(err));
  }

  // subscribeToNotifications() {
  //   //this.requestSubscription();
  //   console.log(Notification.permission);
  //   console.log(this.vapidKeys);
  //   if (this.swPush.isEnabled) {
  //     this.swPush.notificationClicks.subscribe(x => console.log(x));
  //     this.swPush.requestSubscription({
  //       serverPublicKey: this.vapidKeys
  //     })
  //       .then(sub => { this.service.subscribe(sub).subscribe(x => console.log(x), err => console.log(err)) })
  //       .catch(err => console.error("Could not subscribe to notifications", err));
  //   }
  // }

  async requestSubscription() {
    try {
      debugger
      const sub = await this.swPush.requestSubscription({ serverPublicKey: this.VAPID_KEY });
      console.log("subscription object ", sub);
    } catch (e) {
      //this._floatNotifications.makeToast.next({header: "Task failed", text: "failed to get subscription object"+e, DurationsEnum: DurationsEnum.MEDIUM, type: "danger"});
    }
  }





  subscribeToNotifications() {
    if(this.swPush.isEnabled){
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_KEY
      })
      .then(sub => {
        this.service.addPushSubscriber(sub).subscribe();
      })
    }
  }



  ngOnInit(): void {
  }

}
