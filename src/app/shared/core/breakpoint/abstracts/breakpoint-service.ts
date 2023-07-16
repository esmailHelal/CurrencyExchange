import { BehaviorSubject, Observable } from 'rxjs';

export abstract class BreakpointServiceBase {
  abstract isMobile$: Observable<boolean>;
  abstract isTablet$: Observable<boolean>;

  abstract smWidth$: Observable<boolean>;
  abstract lgWidth$: Observable<boolean>;
  abstract xlWidth$: Observable<boolean>;
}
