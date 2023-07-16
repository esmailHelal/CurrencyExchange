import { BreakpointObserver } from '@angular/cdk/layout';
import { Inject, Injectable, Optional } from '@angular/core';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointServiceBase } from './abstracts/breakpoint-service';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService extends BreakpointServiceBase {
  readonly isMobile$: Observable<boolean>;
  readonly isTablet$: Observable<boolean>;
  readonly isLargeScreen$: Observable<boolean>;

  readonly smWidth$: Observable<boolean>;
  readonly lgWidth$: Observable<boolean>;
  readonly xlWidth$: Observable<boolean>;

  constructor(
    private readonly breakpointObserver: BreakpointObserver
  ) {
    super();

    const mobileWidth = '640px';
    const tabletWidth = '1024px';
    const largeScreenWidth = '1024px';

    this.isMobile$ = this.initMaxWidthMatcher(mobileWidth);
    this.isTablet$ = this.initMaxWidthMatcher(tabletWidth);
    this.isLargeScreen$ = this.initMaxWidthMatcher(
      largeScreenWidth,
      'min-width'
    );

    this.smWidth$ = this.isMobile$;
    this.lgWidth$ = this.isTablet$;
    this.xlWidth$ = this.isLargeScreen$;
  }

  private initMaxWidthMatcher(
    width: string,
    rule = 'max-width'
  ): Observable<boolean> {
    return this.breakpointObserver.observe([`(${rule} : ${width})`]).pipe(
      shareReplay(),
      map((result) => result.matches)
    );
  }
}
