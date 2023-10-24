import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService); // inject service into class
  const toaster = inject(ToastrService);

  return accountService.currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      } else {
        toaster.error("Sorry, you're not allowed to view this page!", 'ERROR');
        return false;
      }
    })
  );
};
