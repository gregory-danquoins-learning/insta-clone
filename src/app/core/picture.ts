import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Picture {
  id: number;
  image: string;
  description: string;
  title: string;
  createdAt: string;
  author: { id: number; displayName: string; email: string };
  likes: any[];
  imageLink: string;
  thumbnailLink: string;
}

export interface PicturePage {
  content: Picture[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class PictureService {
  private apiUrl = 'http://localhost:8080/api/picture';

  constructor(private http: HttpClient) {}

  getPictures(pageNumber: number, pageSize: number) {
    return this.http.get<PicturePage>(
      `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      { withCredentials: true }
    );
  }
}
