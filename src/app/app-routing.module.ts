import { NgModule } from '@angular/core';
import { SigninComponent } from './pages/signin/signin.component';
import { AuthGuard } from './service/auth/auth.guard';
import { LoginGuard } from './service/auth/login.guard';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: SigninComponent,
    canLoad: [LoginGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
    canLoad: [AuthGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
