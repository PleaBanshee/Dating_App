import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member } from 'src/app/models/member';
import { PaginatedResults, Pagination } from 'src/app/models/pagination';
import { UserParams } from 'src/app/models/user-params';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]> | undefined;
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (res: PaginatedResults<Member[]>) => {
          if (res.result && res.pagination) {
            this.members$ = of(res.result);
            this.pagination = res.pagination;
          }
        },
      });
    }
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
}
