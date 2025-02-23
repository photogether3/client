import { InjectionToken, Provider, Type } from '@angular/core';
import { AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

/**
 |---------------------------------------------------------------------------------
 | Auth Validators Interface
 |---------------------------------------------------------------------------------
 | FSD 위배되는 부분을 해결하는 방법을 제안드립니다.
 | SOLID 원칙중 의존관계 역전 원칙(DIP:Dependency Inversion Principle) 원칙을 사용하는 방법입니다.
 | 의존관계 역전원칙을 간단히 설명드리면 이란 "추상화에 의존, 구체화에 의존하면 안됨" 입니다.
 | 이 원칙을 무조건 쓰면 개발피로도가 상당하니 이런 부분에 사용할 수 있습니다.
 | 
 | base form은 해당 인터페이스를 참조하기 때문에 FSD 원칙에 위배되지 않습니다.
 | 
 | ## 적용법
 | 1. base form에서 해당 인터페이스 토큰을 참조합니다. 즉 구현체(클래스)를 참조하지 않습니다.
 | 
 | 2. 해당 인터페이스를 구현하는 클래스를 만들어야합니다. 아마 이 클래스가 수정님이 원하는 위치인 
 | src/entities/{domain} 위치에 만들어질 거 같습니다. 
 |
 | 3. base form의 inject(AUTH_VALIDATE) 는 실제 구현체를 참조하는게 아니므로 이대로라면 에러가 발생할겁니다.
 | 앵귤러에게 런타임 시점에 AUTH_VALIDATE라는 토큰에 실제로 작동하는 클래스가 무엇인지 최상위 모듈에서 결정해줄 수 있습니다.
 | 저는 이것을 일단 src/app/app.config 파일에 명시해주도록 하겠습니다.
 | 
 | 4. src/app/app.config.ts 파일에 어떻게 의존성 역전이 마무리 되었는지 참고해주세요.
 |
 | ## 주의사항!!(매우 중요)
 | 해당 작업은 FSD의 원칙을 위반하지 않게 현재 상황을 넘겼지만 수정님은 결국 다시 고민이 생기게 됩니다.
 | 현재 상황에서 인터페이스의 아래 매서드들을 보시면 상당히 구체적입니다. 인터페이스 이름도 Auth라고 대놓고
 | 언급하고 있기 때문에 Auth 도메인에 한해서만 사용될 수 있을것처럼 보입니다.
 | 따라서 추후 다른 도메인들도 shared의 발리데이터를 사용하고 싶다면 인터페이스를 좀 더 추상적이고 모호하게 만들어야합니다.
 | 지금 당장은 방법이 떠오르지않아 제안드리지는 않습니다.
 | 
 | 즉, 이 발리데이터는 인터페이스를 만들고 의존역전할만큼의 트레이드오프할 가치가 있다고는 생각되지 않습니다.
 | 현재 보이는 모습에서는 auth entities에 같이 있는게 더 저렴하기 때문입니다. 하지만 여러 도메인에서 
 | 추후에 사용하려는 의도라면 해당 인터페이스를 좀더 추상적으로 다듬으면 될것도 같습니다..!
 */
export interface IAuthValidators {
  // 이메일 중복 검증
  checkDuplicateEmail(api: (email: string) => Observable<any /** 제네릭 부분은 생각을 좀 더 해봐야해서 일단 any 타입 */>): AsyncValidatorFn;

  // 비밀번호 일치 검증
  checkPasswordMatch(): AsyncValidatorFn;
}

export const AUTH_VALIDATORS = new InjectionToken<IAuthValidators>('AUTH_VALIDATOR');

/**
 | ---------------------------------------------------------------------------------
 | 일단 신경 안써도되는 부분입니다.
 | app.config 파일을 보는 시점에 이해가 될겁니다.
 | ---------------------------------------------------------------------------------
 */
export const provideAuthValidator = (authValidatorImpl: Type<IAuthValidators>): Provider => {
  return {
    provide: AUTH_VALIDATORS,
    useClass: authValidatorImpl,
  };
};
