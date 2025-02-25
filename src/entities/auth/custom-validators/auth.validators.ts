import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, distinctUntilChanged, map, Observable, of, switchMap, timer } from 'rxjs';
import { DuplicateEmailDTO } from 'src/entities/user';
import { IValidationService } from 'src/shared/lib/validation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthValidators implements IValidationService {
  // 이메일 중복 검증
  asyncValidateField<T>(api: (value: string) => Observable<T>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || !control.dirty) {
        return of(null);
      }

      return timer(600).pipe(
        distinctUntilChanged(),
        switchMap(() => api(control.value)),
        map((res: any) => (res.isDuplicated ? { duplicateEmail: true } : null)),
        catchError(() => of(null)),
      );
    };
  }

  // 비밀번호 일치 검증
  validateMatchingFields(fieldName1: string, fieldName2: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const parent = control.parent;
      if (!parent) {
        throw Error('부모 폼이 없다 !');
      }

      const value1 = parent.get(fieldName1)?.value;
      const value2 = parent.get(fieldName2)?.value;

      if (value1 !== value2) {
        return of({ fieldMismatch: true }).pipe();
      }

      return of(null).pipe();
    };
  }
}
