import{a as G}from"./chunk-LPABG7ES.js";import{a as v}from"./chunk-5VEL7C3W.js";import{c as s,d as h,e as F,h as D,i as A,k as _,n as b,p as x,t as S}from"./chunk-MJMJ6QEK.js";import{Cb as d,Db as y,Ia as u,Ta as p,Xa as c,fb as n,mb as t,nb as l,ob as f,qb as a,sa as C,ta as r,yb as g}from"./chunk-4S75Y5RT.js";var O=o=>[o],E=()=>[],I=class o extends v{submitForm=C();mode=r.required();title=r();category=r();constructor(){super()}ngOnInit(){this.mode()==="update"&&this.title()&&this.category()&&this.form.patchValue({title:this.title(),categoryId:this.category()?.id})}initForm(){this.form=this.fb.group({title:["",s.required],categoryId:[0,s.required]})}toggleCategory(m){this.form.patchValue({categoryId:m[0].id})}onSubmit(){this.submitForm.emit(this.form)}static \u0275fac=function(i){return new(i||o)};static \u0275cmp=p({type:o,selectors:[["app-collection-form"]],inputs:{mode:[1,"mode"],title:[1,"title"],category:[1,"category"]},outputs:{submitForm:"submitForm"},features:[c],decls:7,vars:8,consts:[[1,"flex","flex-col","flex-1","h-full","gap-4","p-4",3,"formGroup"],["formControlName","title","label","\uC0AC\uC9C4\uCCA9 \uC81C\uBAA9","placeholder","\uC0AC\uC9C4\uCCA9 \uC81C\uBAA9\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."],[1,"flex","flex-col","flex-1","gap-2"],[1,"flex-1",3,"selectedCategoryListChange","isMultiSelect","selectedCategoryList"],[3,"click","text","isDisabled"]],template:function(i,e){i&1&&(t(0,"form",0),f(1,"app-input",1),t(2,"label",2)(3,"span"),g(4,"\uAD00\uC2EC\uC0AC \uC120\uD0DD"),l(),t(5,"app-category-selector",3),a("selectedCategoryListChange",function(N){return e.toggleCategory(N)}),l()(),t(6,"app-button",4),a("click",function(){return e.onSubmit()}),l()()),i&2&&(n("formGroup",e.form),u(5),n("isMultiSelect",!1)("selectedCategoryList",e.category()?y(5,O,e.category()):d(7,E)),u(),n("text",e.mode()==="create"?"\uC0AC\uC9C4\uCCA9 \uC0DD\uC131\uD558\uAE30":"\uC0AC\uC9C4\uCCA9 \uC218\uC815\uD558\uAE30")("isDisabled",e.form.invalid))},dependencies:[b,D,h,F,A,_,S,x,G],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;flex-grow:1;height:100%}"]})};export{I as a};
