import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
@Component({
    selector: 'sm-breadcrumb'
    , template: `
     <div class="sm-breadcrumb-container">
        <ng-container *ngFor="let breadcrumb of breadcrumbs; last as last">
            <span class="sm-breadcrumb-item-title" *ngIf="last">{{breadcrumb.title}}</span>
        </ng-container>
        <ul  class="sm-breadcrumb-content">
            <li class="sm-breadcrumb-item" *ngFor="let breadcrumb of breadcrumbs; last as last">
                <span class="sm-breadcrumb-item-label" 
                [class.breadcrumb-active]="isActive(breadcrumb.url)"  (click)="navigateByUrl(breadcrumb)">
                    {{breadcrumb.title}}
                    <sm-icon *ngIf="!last">keyboard_arrow_right</sm-icon>
                </span>
            </li>
        </ul>
        </div>
    `
    , host: {
        '[class.overlay-orange-background]': '_isOverlayOrange'
    }
    , encapsulation: ViewEncapsulation.None
    , styleUrls: ['./breadcrumb.scss']
})
export class Breadcrumb implements OnInit {
    _isOverlayOrange: boolean;
    breadcrumbs: IBreadcrumb[];
    constructor(
        private activeRouter: ActivatedRoute
        , private router: Router
    ) { }

    ngOnInit() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
            , distinctUntilChanged()
        ).subscribe(() => this.breadcrumbs = this.resolver(this.activeRouter.root));
    }

    private resolver(router: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []) {
        let title = router.routeConfig
            && router.routeConfig.data
            ? router.routeConfig.data.title
            : "";
        let path = router.routeConfig
            && router.routeConfig.data
            ? router.routeConfig.path
            : "";
        let params = null;
        if (router.snapshot && Object.keys(router.snapshot.queryParams).length > 0) {

            params = Object.keys(router.snapshot.queryParams).reduce((prev, curr, index) => {
                return prev + `${curr}=` + (router.snapshot.queryParams as { [key: string]: string })[curr] + (index + 1 >= Object.keys(router.snapshot.queryParams).length ? '' : '&');
            }, '');
        }
        const nextUrl = path ? `${url}/${path}` : url;

        const breadcrumb: IBreadcrumb = {
            title: title,
            url: nextUrl
        };
        if (params != null) {
            const compare = `${nextUrl}?${params}`;
            // create new params
            if (this.isActive(compare)) {
                params = { ...router.snapshot.queryParams };
                breadcrumb["params"] = params;
            }

        }

        this._isOverlayOrange = false
        if (router.routeConfig && router.routeConfig.data)
            this._isOverlayOrange = router.routeConfig.data.overlayOrange !== undefined;

        const newBreadcrumb = breadcrumb.title ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
        if (router.firstChild)
            return this.resolver(router.firstChild, nextUrl, newBreadcrumb);

        return newBreadcrumb;
    }

    navigateByUrl(item: IBreadcrumb) {
        this.router.navigate([item.url], { queryParams: { ...item.params } })
    }


    isActive(url) {
        return this.router.isActive(url, true);
    }
}

export interface IBreadcrumb {
    title: string;
    url: string;
    params?: { [key: string]: any };
}