import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guards/auth.guard';
import { ErrorComponent } from './errors/error/error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { navigationGuard } from './guards/navigation.guard';
import { memberDetailedResolver } from './resolvers/member-detailed.resolver';

const routes: Routes = [
  { path: ``, component: HomeComponent }, // default route: home
  {
    path: ``,
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard], // canActivate: route protection
    children: [
      { path: `members`, component: MemberListComponent },
      // map resolver to get username from query params
      {
        path: `members/:username`,
        component: MemberDetailsComponent,
        resolve: { member: memberDetailedResolver },
      },
      {
        path: `member/edit`,
        component: MemberEditComponent,
        canDeactivate: [navigationGuard], // prevents user from navigating without saved changes
      },
      { path: `lists`, component: ListsComponent },
      { path: `messages`, component: MessagesComponent },
    ],
  },
  { path: 'errors', component: ErrorComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: `**`, component: NotFoundComponent, pathMatch: `full` }, // WildCard Route: doesn't match defined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
