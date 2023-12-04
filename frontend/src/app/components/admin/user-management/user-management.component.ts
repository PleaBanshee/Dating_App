import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  // Initializes modal ref of the roles modal component
  bsModalRef: BsModalRef<RolesModalComponent> =
    new BsModalRef<RolesModalComponent>();
  availableRoles = ['Admin', 'Moderator', 'Member'];

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

  private arrayIsEqual(arr1: any[], arr2: any[]): boolean {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) => {
        this.users = users;
      },
    });
  }

  openRolesModal(user: User) {
    // data passed down to the modal
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles], // creates shallow copy of roles array
      },
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        if (!this.arrayIsEqual(selectedRoles!, user.roles)) {
          this.adminService
            .updateUserRole(user.username, selectedRoles!)
            .subscribe({
              next: (roles) => {
                user.roles = roles;
              },
            });
        }
      },
    });
  }
}
