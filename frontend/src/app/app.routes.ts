import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './services/auth.guard';
import { UserComponent } from './pages/user/user.component';
import { SallerComponent } from './pages/saller/saller.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductComponent } from './pages/product/product.component';
import { ShoppingComponent } from './pages/shopping/shopping.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: { allowedTypes: ['seller'] },
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: { allowedTypes: ['seller'] },
  },
  {
    path: 'sallers',
    component: SallerComponent,
    canActivate: [AuthGuard],
    data: { allowedTypes: ['seller'] },
  },
  {
    path: 'categories',
    component: CategoryComponent,
    canActivate: [AuthGuard],
    data: { allowedTypes: ['seller'] },
  },
  {
    path: 'products',
    component: ProductComponent,
    canActivate: [AuthGuard],
    data: { allowedTypes: ['seller'] },
  },
  {
    path: 'shopping',
    component: ShoppingComponent,
    canActivate: [AuthGuard],
    data: { allowedTypes: ['user'] },
  },
  { path: 'forbidden', component: ForbiddenComponent },
];
