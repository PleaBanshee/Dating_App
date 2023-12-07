import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';
import { ConfirmService } from '../services/confirm.service';
import { inject } from '@angular/core';

// This guard prevents users from navigating to a route without unsaved changes
export const navigationGuard: CanDeactivateFn<MemberEditComponent> = (
  component
) => {
  const confirmService = inject(ConfirmService);

  if (component.editForm?.dirty) {
    return confirmService.confirm();
  }
  return true;
};
