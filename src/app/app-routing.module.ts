import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['tabs/tab1']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'modal',
    loadChildren: () => import('./modal/modal/modal.module').then( m => m.ModalPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadChildren: () => import('./logins/login/login.module').then(m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'register',
    loadChildren: () => import('./logins/register/register.module').then(m => m.RegisterPageModule),
    ...canActivate(redirectLoggedInToHome)
  },
  {
    path: 'tab4',
    loadChildren: () => import('./tab4/tab4.module').then( m => m.Tab4PageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'event',
    loadChildren: () => import('./modal/event/event.module').then( m => m.EventPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'comunicado',
    loadChildren: () => import('./new-comunicado/new-comunicado.module').then( m => m.NewComunicadoPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'evento',
    loadChildren: () => import('./evento/evento.module').then( m => m.EventoPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'galleries',
    loadChildren: () => import('./galleries/galleries.module').then(m => m.GalleriesPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'galleryload',
    loadChildren: () => import('./modal/galleryload/galleryload.module').then(m => m.GalleryloadPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'gallery',
    loadChildren: () => import('./modal/gallery/gallery.module').then(m => m.GalleryPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '**',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
