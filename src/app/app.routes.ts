import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { AuthGuard } from './core/auth/auth-guard';
import { Register } from './pages/register/register';
import { ImageDetail } from './pages/image-detail/image-detail';
import { UserPictures } from './pages/user-pictures/user-pictures';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'picture/:id', component: ImageDetail, canActivate: [AuthGuard] },
  { path: 'my-pictures', component: UserPictures, canActivate: [AuthGuard] },
  { path: '', component: Home, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];