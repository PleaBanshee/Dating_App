import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { take } from 'rxjs';

// This structural directive allows one to view the admin panel if the user has admin role
@Directive({
  selector: '[appHasRole]', // *appHasRole=["Admin","Role"]
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];
  user: User | undefined;

  // ViewContainerRef: A reference to the container where the embedded views should be attached or detached.
  // TemplateRef<any>: A reference to the template to be returned when the condition is true.
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        if (user) this.user = user;
      },
    });
  }
  ngOnInit(): void {
    if (this.user?.roles.some((r) => this.appHasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
