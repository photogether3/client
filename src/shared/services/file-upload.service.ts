import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable } from 'rxjs';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface FileResult {
  file: File | null;
  dataUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private fileResult = new BehaviorSubject<FileResult | null>(null);
  
  constructor(private platform: Platform) {}

  /**
   * 갤러리 접근 권한 확인
   */
  private async checkCameraPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true; // 웹에서는 권한이 필요 없음
    }

    try {
      // 카메라 권한 확인
      const permissionStatus = await Camera.checkPermissions();
      
      if (permissionStatus.photos === 'granted') {
        return true;
      } else if (permissionStatus.photos === 'prompt') {
        // 권한 요청
        const requestResult = await Camera.requestPermissions({
          permissions: ['photos']
        });
        return requestResult.photos === 'granted';
      } else if (permissionStatus.photos === 'denied') {
        alert('갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.');
        return false;
      }
      
      return false;
    } catch (e) {
      console.error('권한 확인 중 오류 발생:', e);
      return false;
    }
  }

  /**
   * 플랫폼에 맞는 파일 선택 방법 제공
   * 웹: 파일 선택 다이얼로그
   * 모바일: 갤러리 접근
   */
  public async selectFile(): Promise<FileResult | null> {
    if (this.platform.ANDROID || this.platform.IOS) {
      // 권한 확인 먼저 수행
      const hasPermission = await this.checkCameraPermission();
      if (!hasPermission) {
        console.log('갤러리 접근 권한이 없습니다.');
        return null;
      }
      
      return this.selectFileFromMobile();
    } else {
      return this.selectFileFromWeb();
    }
  }

  /**
   * 웹 환경에서 파일 선택
   */
  private selectFileFromWeb(): Promise<FileResult | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0] || null;
        
        if (!file) {
          resolve(null);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const result: FileResult = { file, dataUrl };
          this.fileResult.next(result);
          resolve(result);
        };
        
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      };
      
      // 파일 선택 취소 처리
      input.oncancel = () => resolve(null);
      input.click();
    });
  }

  /**
   * 모바일 환경에서 갤러리 접근
   */
  private async selectFileFromMobile(): Promise<FileResult | null> {
    try {
      // 카메라 권한 요청 및 갤러리 접근
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos, // 갤러리만 사용
      });

      if (!image || !image.webPath) {
        return null;
      }

      // 가져온 이미지의 URI를 Blob으로 변환
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      
      // Blob을 File 객체로 변환
      const fileName = `image_${new Date().getTime()}.jpeg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      
      // 웹용 dataUrl 생성
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          const result: FileResult = { file, dataUrl };
          this.fileResult.next(result);
          resolve(result);
        };
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('갤러리에서 이미지 선택 중 오류 발생:', error);
      return null;
    }
  }

  /**
   * 현재 선택된 파일 정보를 Observable로 제공
   */
  public getFileResult(): Observable<FileResult | null> {
    return this.fileResult.asObservable();
  }
}