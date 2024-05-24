import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { publicGuard } from './guard/public.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        title: 'Login Page',
        canActivate: [publicGuard],
        loadComponent: ()=> import('./components/login/login.component').then(m=>m.LoginComponent),
    },
    {
        path: 'dashboard',
        title: 'Dashboard Page',
        canActivate: [authGuard],
        loadComponent: ()=> import('./components/dashboard/dashboard.component').then(m=>m.DashboardComponent),
        children:[
            {
                path: '',
                redirectTo: 'repo',
                pathMatch: 'full'
            },
            {
                path: 'repo',
                title: 'Dashboard Page',
                canActivate: [authGuard],
                loadComponent: ()=> import('./components/dashboard/repository/repository.component').then(m=>m.RepositoryComponent)
            },
            {
                path: 'commit',
                title: 'Dashboard Page',
                canActivate: [authGuard],
                loadComponent: ()=> import('./components/dashboard/commit/commit.component').then(m=>m.CommitComponent)
            },
            {
                path: 'size',
                title: 'Dashboard Page',
                canActivate: [authGuard],
                loadComponent: ()=> import('./components/dashboard/size/size.component').then(m=>m.SizeComponent)
            }
        ]
    },
    {
        path: 'profile',
        title: 'Profile Page',
        canActivate: [authGuard],
        loadComponent: ()=> import('./components/profile/profile.component').then(m=>m.ProfileComponent),
    },
    {
        path: '**',
        loadComponent: ()=> import('./components/not-found/not-found.component').then(m=>m.NotFoundComponent)
    }


];
