import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, distinctUntilChanged, map, Observable, of, switchMap, timer } from 'rxjs';
import { DuplicateEmailDTO } from 'src/entities/user';

@Injectable({
  providedIn: 'root',
})
export class AuthValidators {
  // 이메일 중복 검증
  checkDuplicateEmail(api: (email: string) => Observable<DuplicateEmailDTO>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || !control.dirty) {
        return of(null);
      }

      return timer(600).pipe(
        distinctUntilChanged(),
        switchMap(() => api(control.value)),
        map((res: DuplicateEmailDTO) => (res.isDuplicated ? { duplicateEmail: true } : null)),
        catchError(() => of(null)),
      );
    };
  }

  // 비밀번호 일치 검증
  checkPasswordMatch(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const parent = control.parent;
      if (!parent) {
        throw Error('부모 폼이 없다 !');
      }

      const password = parent.get('password')?.value;
      const confirmPassword = parent.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        return of({ passwordMismatch: true }).pipe();
      }

      return of(null).pipe();
    };
  }
}
