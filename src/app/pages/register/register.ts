import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  email = '';
   displayName= "";
  password = '';
  confirmPassword = '';

  constructor(private http: HttpClient, private router: Router) {}

  submit() {
    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    this.http.post('http://localhost:8080/api/user', {
      email: this.email,
      displayName: this.displayName,
      password: this.password
    }).subscribe({
      next: () => {
        alert('Compte créé avec succès, vous pouvez vous connecter');
        this.router.navigateByUrl('/login');
      },
      error: () => {
        alert('Erreur lors de l’inscription');
      }
    });
  }
}
