import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OktaAuthGuard } from '@okta/okta-angular';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent, canActivate: [OktaAuthGuard] },
  { path: 'protected', loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule), canActivate: [OktaAuthGuard] },
  { path: 'login/callback', component: CallbackComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
