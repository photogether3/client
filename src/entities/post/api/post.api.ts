import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/shared/environments';
import { PostMoveReqDTO, PostReqDto, PostResDTO, PostType, PostUpdateFormType, UpdatePostDTO } from '../model';

@Injectable({ providedIn: 'root' })
export class PostApi {
  private readonly http = inject(HttpClient);

  private readonly postList = [
    {
      id: 19,
      title: 'cras cultellus abbas conor vinum adsuesco crux cernuus aegrotatio campana',
      content:
        'Depopulo depulso deserunt adnuo esse itaque. Acidus spero adulescens cicuta undique confugo amita aequitas. Vilicus stabilis quasi tergiversatio aut degusto excepturi.',
      imageUrl: 'https://loremflickr.com/3878/2417?lock=7790908018490431',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Colligo ipsa cilicium confugo. Temeritas vulticulus audio decet. Bestia tremo tergeo curatio carus celebrer vis teres pecto.',
          isPublic: true,
        },
        {
          content: 'Vilis tersus xiphias tergum quia tum cetera. Sulum armarium conscendo sui villa vulgaris certus soleo tracto. Cicuta absconditus antepono conicio.',
          isPublic: true,
        },
      ],
    },
    {
      id: 20,
      title: 'molestias tam tendo torrens tactus subnecto solus admiratio quo defendo',
      content: 'Subvenio deleo vinitor verto aduro volva vivo angulus. Vigilo villa autus approbo trans cresco tandem quidem vulgo. Tunc creber bonus utpote.',
      imageUrl: 'https://picsum.photos/seed/YrCrkD/25/1418',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Acervus fugiat deprimo capillus. Tibi concido spero basium taedium talio. Clamo nostrum cruentus reprehenderit.',
          isPublic: 1,
        },
        {
          content: 'Sopor denego defungo celebrer vindico aperio porro. Subiungo talio ut amoveo utroque sed aufero demulceo. Pauci depereo temeritas.',
          isPublic: true,
        },
      ],
    },
    {
      id: 18,
      title: 'usitas aperio ara valetudo qui velociter cariosus truculenter textus velut',
      content:
        'Adaugeo error custodia beneficium sto conduco adipisci aliqua assentator caritas. Crux harum alo spoliatio alienus timor volaticus delibero theca. Antiquus cura vulpes creo deorsum utrum tepesco capillus cresco.',
      imageUrl: 'https://picsum.photos/seed/0qTGXXkYas/3502/2806',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Veritas velum ratione. Acervus amplus quasi acervus calco tunc ter tener utrimque. Illum cum quae stillicidium celo certus.',
          isPublic: true,
        },
        {
          content: 'Valeo sonitus voluptatem vestrum cunabula cavus defetiscor auctus balbus. Contabesco abstergo vergo cornu arcesso tandem cruentus. Dicta votum apto speculum.',
          isPublic: 1,
        },
      ],
    },
    {
      id: 16,
      title: 'thesaurus commodi trans audax voluptates stabilis volubilis beatus sit absens',
      content: 'Demoror bestia cenaculum aer vergo deinde eius cohaero. Attero carbo urbs cras. Totam supplanto via amplitudo templum crepusculum esse.',
      imageUrl: 'https://loremflickr.com/1101/1268?lock=7934982610866729',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content:
            'Stella degusto cubitum conscendo audio subiungo maxime. Decumbo somniculosus non somniculosus summopere vita termes supplanto. Canis vestrum utrimque callide carmen subnecto.',
          isPublic: true,
        },
        {
          content: 'Amoveo comitatus cunabula depereo dolorem suffragium. Ceno averto curis absque uter socius studio adnuo comis. Culpa distinctio reprehenderit capitulus.',
          isPublic: true,
        },
      ],
    },
    {
      id: 17,
      title: 'contabesco textus vulticulus necessitatibus ullam verbera in admoveo solutio expedita',
      content: 'Desparatus aliqua pauci. Tardus validus baiulus. Arguo communis cilicium.',
      imageUrl: 'https://loremflickr.com/3778/2003?lock=3316908643297022',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Aegrus alias solum ex. Cruciamentum ceno certus. Suggero ex voluptatem tempora tamdiu stabilis.',
          isPublic: true,
        },
        {
          content: 'Doloremque viriliter tam campana impedit aequus ulciscor sono. Deleo conscendo decens triumphus cruentus. Tenuis adeptio conatus adulescens sollicito atavus.',
          isPublic: 1,
        },
      ],
    },
    {
      id: 15,
      title: 'textilis cedo ver attollo civis demergo coniuratio corroboro ullam cunctatio',
      content: 'Necessitatibus cetera curto bellum ultra vere. Eos commemoro balbus. Viridis coniecto venio cibo delibero succedo conscendo.',
      imageUrl: 'https://loremflickr.com/3213/3160?lock=8567566961122593',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content:
            'Abutor admoneo confugo ager tego. Titulus bene cultellus ipsum considero deprimo curvo suppono civis territo. Toties adulatio adulescens alo comprehendo calamitas sustineo utique.',
          isPublic: 1,
        },
        {
          content: 'Conculco talio arcus suscipio provident suus adsum et. Cohibeo tantum cimentarius civitas. Cras acidus dolor usque repudiandae audentia decretum volup.',
          isPublic: true,
        },
      ],
    },
    {
      id: 14,
      title: 'tendo supra commodi succedo cubo cohaero vorax valetudo curvo varius',
      content: 'Dignissimos utilis adimpleo talis acidus. Civis conduco trans bis texo caelestis suasoria vaco anser. Adinventitias acidus taceo.',
      imageUrl: 'https://loremflickr.com/475/3951?lock=2060079541102773',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content:
            'Ipsum contigo laudantium aequus thema. Dolor arcesso bestia confero cuppedia optio cado repudiandae admiratio paens. Dignissimos creator antiquus comparo acquiro comitatus.',
          isPublic: true,
        },
        {
          content:
            'Audacia solium aranea summa repellat voluptate. Magnam defungo coaegresco crapula traho utilis demum trepide terra sapiente. Vindico acceptus volaticus coruscus benigne vero crudelis creber.',
          isPublic: true,
        },
      ],
    },
    {
      id: 12,
      title: 'conqueror sufficio voco universe cresco aeternus suscipit spargo corrigo cur',
      content: 'Sulum cariosus spes tenuis delectatio benigne atrox absque. Tenetur antiquus cervus vulgus patruus tempora cariosus distinctio. Xiphias harum caelum animi.',
      imageUrl: 'https://picsum.photos/seed/XtfyRUAB/1306/3630',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Admoveo conduco nostrum admoveo voluptatibus. Canis amoveo eos conor itaque defetiscor testimonium. Adhaero anser catena caput usitas tum.',
          isPublic: 1,
        },
        {
          content: 'Valeo apto volubilis adversus autem carbo benigne. Uxor adopto ver capillus. Caelestis cernuus cognomen atqui timidus sortitus quo vel confugo.',
          isPublic: true,
        },
      ],
    },
    {
      id: 13,
      title: 'architecto abscido calculus stipes cupiditate eum deleniti ullus inventore temptatio',
      content: 'Voluptates quae dedecor modi vero utpote. Velum despecto statim strenuus decor. Terebro praesentium patrocinor illum aufero textus talio thymbra.',
      imageUrl: 'https://picsum.photos/seed/Hnxqb/659/2459',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Laboriosam delectatio spectaculum corrupti. Dolorem celer suppono. Umerus claro auditor decor via.',
          isPublic: true,
        },
        {
          content:
            'Solitudo caterva adficio cura solium creber ventus quod. Aequitas celebrer peccatus amiculum. Voluntarius pectus ascit aliquid convoco urbs provident synagoga arbor.',
          isPublic: true,
        },
      ],
    },
    {
      id: 11,
      title: 'via rerum comparo cupio volo succurro vicinus unde velit temptatio',
      content: 'Tantum abstergo basium. Nisi delectatio turba animadverto. Bellum maiores delectatio video temptatio.',
      imageUrl: 'https://picsum.photos/seed/ST8LPE3Q/1492/2093',
      collectionId: 3,
      collection: {
        id: 3,
        title: '건강 챙기기기',
      },
      category: {
        id: 1002,
        title: '건강 & 웰니스',
      },
      metadataList: [
        {
          content: 'Accusantium beatae pauci amplexus tubineus calcar tenuis. Solium assentator tredecim harum. Tergeo apparatus cruciamentum uterque dolor valeo.',
          isPublic: true,
        },
        {
          content: 'Acceptus venio sed. Quam catena claudeo desparatus quam celo corrupti curis testimonium comminor. Aedificium tremo talus suffoco aestas tui alius.',
          isPublic: false,
        },
      ],
    },
  ];

  // 게시물 목록 조회
  getCollection(collectionId: string): Observable<any | undefined> {
    if (!environment.production) {
      return of(this.postList).pipe(delay(0));
    }

    const params = new HttpParams({
      fromObject: {
        page: 1,
        perPage: 10,
        sortOrder: 'desc',
        sortBy: 'created_at',
        collectionId,
      },
    });

    return this.http.get<PostResDTO>(`${environment.serverUrl}/v1/posts`, { params }).pipe(
      map((res) => res.items),
      tap(console.log),
    );
  }

  // 게시물 조회
  getPost(collectionId: string, postId: number): Observable<any | undefined> {
    if (!environment.production) {
      const post = this.postList.find((post) => post.id == postId);
      return of(post);
    }

    return this.getCollection(collectionId).pipe(map((res) => res.find((post: PostType) => post.id == postId)));
  }

  // 게시물 생성
  createPost(postReqDto: PostReqDto) {
    const formData = this.convertToFormData(postReqDto);
    return this.http.post<PostReqDto>(`${environment.serverUrl}/v1/posts`, formData, {
      headers: {},
    });
  }

  // 게시물 수정
  updatePost(postId: number, updatePostDTO: PostUpdateFormType) {
    return this.http.put<PostUpdateFormType>(`${environment.serverUrl}/v1/posts/${postId}`, updatePostDTO);
  }

  // 게시물 삭제
  deletePost(postIds: number[]) {
    return this.http.delete(`${environment.serverUrl}/v1/posts`, {
      body: { postIds },
    });
  }

  // 게시물 이동
  movePost(postMoveReqDto: PostMoveReqDTO) {
    return this.http.patch(`${environment.serverUrl}/v1/posts/move`, postMoveReqDto);
  }

  private convertToFormData(postReqDto: PostReqDto): FormData {
    const formData = new FormData();
    console.log(formData);

    Object.keys(postReqDto).forEach((key) => {
      const value = (postReqDto as any)[key];
      console.log(key, value);

      if (value instanceof File) {
        formData.append(key, value); // ✅ 파일이면 그대로 추가
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // ✅ 배열 데이터를 JSON 문자열로 변환하여 추가
      } else {
        formData.append(key, value); // ✅ 일반 텍스트 값 추가
      }
    });

    console.log('📌 FormData 출력:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    return formData;
  }
}
