import{i as c,l,v as s}from"./chunk-PWXOGFPV.js";import{X as p,ba as i,s as n}from"./chunk-4S75Y5RT.js";var m=class a{http=i(l);getCollection(e){let t=new c({fromObject:{page:1,perPage:10,sortOrder:"desc",sortBy:"created_at",collectionId:e}});return this.http.get(`${s.serverUrl}/v1/posts`,{params:t})}getPost(e,t){return this.getCollection(e).pipe(n(r=>r?.items.find(o=>o.postId===t)))}createPost(e){let t=this.convertToFormData(e);return this.http.post(`${s.serverUrl}/v1/posts`,t,{headers:{}})}updatePost(e,t){return this.http.put(`${s.serverUrl}/v1/posts/${e}`,t)}deletePost(e){return this.http.delete(`${s.serverUrl}/v1/posts`,{body:{postIds:e}})}movePost(e){return this.http.patch(`${s.serverUrl}/v1/posts/move`,e)}convertToFormData(e){let t=new FormData;return console.log(t),Object.keys(e).forEach(r=>{let o=e[r];console.log(r,o),o instanceof File?t.append(r,o):Array.isArray(o)?t.append(r,JSON.stringify(o)):t.append(r,o)}),console.log("\u{1F4CC} FormData \uCD9C\uB825:"),t.forEach((r,o)=>{console.log(`${o}:`,r)}),t}static \u0275fac=function(t){return new(t||a)};static \u0275prov=p({token:a,factory:a.\u0275fac,providedIn:"root"})};export{m as a};
