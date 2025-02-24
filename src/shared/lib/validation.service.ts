import { InjectionToken, Provider, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export interface IValidationService {
  /**
   * 비동기 검증을 실행하는 범용 메서드
   * @param api 해당 필드 검증을 위한 API (Promise 또는 Observable)
   */
  asyncValidateField<T>(api: (value: string) => Observable<T>): AsyncValidatorFn;

  /**
   * 두 개의 필드가 일치하는지 검증 (ex: 비밀번호 확인)
   * @param fieldName1 첫 번째 필드명
   * @param fieldName2 두 번째 필드명
   */
  validateMatchingFields(fieldName1: string, fieldName2: string): AsyncValidatorFn;
}

export const VALIDATION_SERVICE = new InjectionToken<IValidationService>('VALIDATION_SERVICE');

export const provideValidationService = (validatorImpl: Type<IValidationService>): Provider => {
  return {
    provide: VALIDATION_SERVICE,
    useClass: validatorImpl,
  };
};
