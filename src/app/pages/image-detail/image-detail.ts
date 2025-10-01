import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { LikeButton } from '../../shared/like-button/like-button';
import { Auth } from '../../core/auth/auth';
import { Picture } from '../../core/picture';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    LikeButton
  ],
  templateUrl: './image-detail.html',
  styleUrls: ['./image-detail.css']
})
export class ImageDetail implements OnInit {
  picture: any = null;
  comments = signal<any[]>([]);
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: Auth
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPicture(+id);
      this.loadComments(+id);
    }
  }

  loadPicture(id: number) {
    this.http.get(`http://localhost:8080/api/picture/${id}`, { withCredentials: true })
      .subscribe(p => this.picture = p);
  }

  loadComments(id: number) {
    this.http.get<any[]>(`http://localhost:8080/api/picture/${id}/comment`, { withCredentials: true })
      .subscribe(comments => this.comments.set(comments));
  }

  postComment() {
    const userId = this.auth.userId;
    if (!userId) {
      alert('Vous devez être connecté pour commenter');
      return;
    }
    if (!this.picture) return;

    const payload = {
      author: { id: userId },      
      content: this.newComment,
      picture: { id: this.picture.id }
    };

    this.http.post('http://localhost:8080/api/comment', payload, { withCredentials: true })
      .subscribe({
        next: () => {
          this.newComment = '';
          this.loadComments(this.picture.id);
        },
        error: () => alert('Erreur lors de l’envoi du commentaire')
      });
  }

  getLikesCount(p: Picture): number {
      return p.likes?.length || 0;
    }

  

}
