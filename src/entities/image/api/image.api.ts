import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { convertToFormData } from 'src/shared/utils';
import { environment } from 'src/shared/environments';

import { ImgTextExtractReqDTO, ImgTextExtractResDTO } from '../model';

@Injectable({ providedIn: 'root' })
export class ImageApi {
  private readonly http = inject(HttpClient);

  extractImgText(ImgTextExtractReqDto: ImgTextExtractReqDTO): Observable<ImgTextExtractResDTO> {
    const formData = convertToFormData(ImgTextExtractReqDto);
    return this.http.post<ImgTextExtractResDTO>(`${environment.serverUrl}/v1/images/preview`, formData, {
      headers: {},
    });
  }
}
