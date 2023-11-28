import { ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Member } from '../models/member';
import { MembersService } from '../services/members.service';
import { inject } from '@angular/core';

// Resolves to a Member type.
export const memberDetailedResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MembersService); // inject the Member service

  // extracts the 'username' parameter from the route using non-null assertion
  return memberService.getMemberByName(route.paramMap.get('username')!);
};
