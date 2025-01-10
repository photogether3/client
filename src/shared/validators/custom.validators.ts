import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, debounceTime, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomValidators {
  // 이메일 중복 검증
  checkDuplicateEmail(api: (email: string) => Observable<{ isDuplicate: boolean }>): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(300),
        switchMap((email) => api(email)),
        map((res: { isDuplicate: boolean }) => (res.isDuplicate ? { duplicateEmail: true } : null)),
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
