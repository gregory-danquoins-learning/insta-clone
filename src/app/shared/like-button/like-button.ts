import { Component, Input, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './like-button.html',
  styleUrls: ['./like-button.css']
})
export class LikeButton implements OnInit {
  @Input() pictureId!: number;
  @Input() initialCount = 0;
  @Input() likes: any[] = [];  // tableau des likes (utilisateurs ayant liké)

  count = signal(0);
  liked = signal(false);

  constructor(private http: HttpClient, private auth: Auth) {}

  ngOnInit() {
    this.count.set(this.initialCount);

    const userId = this.auth.userId;
    if (userId && this.likes.some(u => u.id === userId)) {
      this.liked.set(true);
    }
  }

  toggleLike(event: MouseEvent) {
    event.stopPropagation();

    const userId = this.auth.userId;
    if (!userId) {
      alert('Vous devez être connecté pour liker une image.');
      return;
    }

    this.http.patch(`http://localhost:8080/api/picture/${this.pictureId}/like`,
      { userId },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        if (this.liked()) {
          this.count.set(this.count() - 1);
          this.liked.set(false);
        } else {
          this.count.set(this.count() + 1);
          this.liked.set(true);
        }
      },
      error: () => {
        alert('Erreur lors du like');
      }
    });
  }
}
