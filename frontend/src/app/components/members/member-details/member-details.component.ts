import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute // get route parameters
  ) {}

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    // extracting the 'username' route parameter from current route: /api/users/{username}
    let username: string | null = this.route.snapshot.paramMap.get('username');
    if (!username) return;
    this.memberService.getMemberByName(username).subscribe({
      next: (member) => {
        this.member = member;
      },
    });
  }
}
