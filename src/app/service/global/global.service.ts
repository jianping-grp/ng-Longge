import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }
  private _globalLoading = new Subject<boolean>();
  private _nextStep = new Subject<number>();
  nextStepValue$ = this._nextStep.asObservable();
  loadingStatus$ = this._globalLoading.asObservable();

  setNextStepValue(value: number) {
    this._nextStep.next(value);
  }

  setLoading(status: boolean): void {
    this._globalLoading.next(status);
  }
}
