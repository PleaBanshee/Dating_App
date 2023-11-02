import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../components/members/member-edit/member-edit.component';

// This guard prevents users from navigating to a route without unsaved changes
export const navigationGuard: CanDeactivateFn<MemberEditComponent> = (
  component
) => {
  if (component.editForm?.dirty) {
    return confirm(
      'Are you sure you want to continue? Any unsaved changes will be lost.'
    );
  }
  return true;
};
