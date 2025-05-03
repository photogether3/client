import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StepService {
  /** -------------------------------------------------------
   * PRIVATE PROPERTIES
   * -------------------------------------------------------*/

  private readonly _components = signal<any[]>([]);
  private readonly _currentStep = signal<number>(0);

  private readonly extraData = new Map<string, any>();

  /** -------------------------------------------------------
   * PUBLIC PROPERTIES
   * -------------------------------------------------------*/

  readonly components = this._components.asReadonly();
  readonly currentStep = computed(() => this._currentStep() + 1);
  readonly currentComponent = computed(() => this._components()[this._currentStep()]);
  readonly totalSteps = computed(() => this._components().length);

  /** -------------------------------------------------------
   * PUBLIC METHODS
   * -------------------------------------------------------*/

  addComponent(component: any) {
    this._components.update((prev) => [...prev, component]);
  }

  getExtraData(type: string) {
    return this.extraData.get(type);
  }

  setExtraData(type: string, data: any) {
    this.extraData.set(type, data);
    return this;
  }

  nextStep() {
    if (this._currentStep() >= this._components().length - 1) {
      return;
    }
    this._currentStep.update((prev) => prev + 1);
  }
}
