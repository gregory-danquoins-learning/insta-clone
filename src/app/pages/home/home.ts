import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PictureService, Picture } from '../../core/picture';
import { LikeButton } from '../../shared/like-button/like-button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatPaginatorModule, LikeButton],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  pictures = signal<Picture[]>([]);
  totalElements = 0;
  pageSize = 5;
  pageIndex = 0;

  constructor(private router: Router, private pictureService: PictureService) {}

  ngOnInit() {
    this.loadPictures(0, this.pageSize);
  }

  goToDetail(id: number) {
  this.router.navigate(['/picture', id]);
}

  loadPictures(page: number, size: number) {
    this.pictureService.getPictures(page, size).subscribe(res => {
      this.pictures.set(res.content);
      this.totalElements = res.totalElements;
      this.pageIndex = res.number;
    });
  }

  onPageChange(event: PageEvent) {
    this.loadPictures(event.pageIndex, event.pageSize);
  }

  getLikesCount(p: Picture): number {
    return p.likes?.length || 0;
  }
}
