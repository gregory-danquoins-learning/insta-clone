import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PictureService, Picture } from '../../core/picture';
import { LikeButton } from '../../shared/like-button/like-button';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-user-pictures',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    LikeButton
  ],
  templateUrl: './user-pictures.html',
  styleUrls: ['./user-pictures.css']
})
export class UserPictures implements OnInit {
  pictures = signal<Picture[]>([]);
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;

  // Formulaire d’upload
  title = '';
  description = '';
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private pictureService: PictureService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.auth.userId;
    if (userId) {
      this.loadPictures(userId, 0, this.pageSize);
    }
  }

  loadPictures(userId: number, page: number, size: number) {
    this.http
      .get<any>(`http://localhost:8080/api/picture/user/${userId}?pageNumber=${page}&pageSize=${size}`, { withCredentials: true })
      .subscribe(res => {
        this.pictures.set(res.content);
        this.totalElements = res.totalElements;
        this.pageIndex = res.number;
      });
  }

  onPageChange(event: PageEvent) {
    const userId = this.auth.userId;
    if (userId) {
      this.loadPictures(userId, event.pageIndex, event.pageSize);
    }
  }

  getLikesCount(p: Picture): number {
    return p.likes?.length || 0;
  }

  goToDetail(id: number) {
    this.router.navigate(['/picture', id]);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

 
  uploadAndCreatePicture() {
    if (!this.selectedFile || !this.title) {
      alert('Veuillez choisir un fichier et renseigner un titre.');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

   
    this.http.post('http://localhost:8080/api/picture/upload', formData, { withCredentials: true, responseType: 'text' })
      .subscribe({
        next: (fileName: string) => {
          const userId = this.auth.userId;
          if (!userId) return;

          const payload = {
            title: this.title,
            description: this.description,
            image: fileName,        
            author: { id: userId }
          };

          this.http.post('http://localhost:8080/api/picture', payload, { withCredentials: true })
            .subscribe({
              next: () => {
                this.title = '';
                this.description = '';
                this.selectedFile = null;
                this.loadPictures(userId, 0, this.pageSize);
              },
              error: () => alert('Erreur lors de la création de l’image')
            });
        },
        error: () => alert('Erreur lors de l’upload de l’image')
      });
  }


}
