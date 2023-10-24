import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: ``, component: HomeComponent }, // default route: home
  { path: `members`, component: MemberListComponent, canActivate: [authGuard] }, // canActivate: route protection
  { path: `members/:id`, component: MemberDetailsComponent },
  { path: `lists`, component: ListsComponent },
  { path: `messages`, component: MessagesComponent },
  { path: `**`, component: HomeComponent, pathMatch: `full` }, // WildCard Route: doesn't match defined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
