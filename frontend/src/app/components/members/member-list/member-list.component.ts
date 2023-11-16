import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member } from 'src/app/models/member';
import { PaginatedResults, Pagination } from 'src/app/models/pagination';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]> | undefined;
  pagination: Pagination | undefined;
  pageNumber: number = 1;
  pageSize: number = 5;

  constructor(private memberService: MembersService) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
      next: (res: PaginatedResults<Member[]>) => {
        if (res.result && res.pagination) {
          this.members$ = of(res.result ?? []);
          this.pagination = res.pagination;
        }
      },
    });
  }
}
