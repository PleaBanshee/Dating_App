import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

// Guard to detect if users can access certain pages or functionality
export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toaster = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (!user) return false;
      if (user.roles.includes('Admin') || user.roles.includes('Moderator')) {
        return true;
      } else {
        toaster.error('You do not have admin permissions!', 'ERROR');
        return false;
      }
    })
  );
};
