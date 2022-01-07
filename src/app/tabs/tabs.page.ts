import { NavigationEnd, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy{

  closed$ = new Subject<any>();
  showTabs = true; // <-- show tabs by default

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      takeUntil(this.closed$)
    ).subscribe((event: NavigationEnd) => {

      const searchUrl=event.url.split(';').shift();

      if (searchUrl === '/tabs/tabs/search') {
        this.showTabs = false; // <-- hide tabs on specific pages
      }
    });
  }

  ngOnDestroy() {
    this.closed$.next(); // <-- close subscription when component is destroyed
  }

}
