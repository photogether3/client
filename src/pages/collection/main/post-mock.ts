import { PostType } from 'src/entities/post';
import { CategoriesGetDTO } from 'src/entities/category';

// 카테고리 mock 데이터
const mockCategories: CategoriesGetDTO[] = [
  { id: 1, name: '여행' },
  { id: 2, name: '일상' },
  { id: 3, name: '음식' },
  { id: 4, name: '풍경' },
  { id: 5, name: '인물' },
];

// 가짜 포스트 데이터 생성 함수
export function generateMockPosts(collectionId: string): PostType[] {
  const posts: PostType[] = [];
  
  for (let i = 1; i <= 30; i++) {
    // 랜덤 카테고리 선택 (null도 가능하게)
    const randomCategory = Math.random() > 0.2 
      ? mockCategories[Math.floor(Math.random() * mockCategories.length)]
      : null;

    // 랜덤 메타데이터 개수 생성 (0-3개)
    const metadataCount = Math.floor(Math.random() * 4);
    const metadataList = [];
    
    for (let j = 0; j < metadataCount; j++) {
      metadataList.push({
        content: `메타데이터 ${j+1} for 포스트 ${i}`,
        isPublic: Math.random() > 0.3,
      });
    }
    
    // 이미지 크기를 다양하게 (마소니 레이아웃을 위해)
    const width = 300 + Math.floor(Math.random() * 300);
    const height = 200 + Math.floor(Math.random() * 400);
    
    posts.push({
      id: i,
      title: `포스트 제목 ${i}`,
      content: `포스트 내용 ${i}입니다. 이것은 포스트 ${i}의 상세 내용입니다.`,
      imageUrl: `https://picsum.photos/id/${i + 10}/${width}/${height}`,
      category: randomCategory,
      collectionId: Number(collectionId),
      collection: {
        collectionId: collectionId,
        title: `사진첩 ${collectionId}`
      },
      metadataList: metadataList
    });
  }
  
  return posts;
}