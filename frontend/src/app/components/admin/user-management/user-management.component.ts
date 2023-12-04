import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService
  ) {}

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

  fetchRoles(username: string): string[] {
    const arrRoles: string[] = [];
    this.users
      .filter((user) => user.username === username)
      .forEach((user) => {
        user.roles.map((role) => arrRoles.push(role.name));
      });
    return arrRoles;
  }

  openRolesModal() {
    const initialState: ModalOptions = {
      initialState: {
        list: ['Do thing', 'Someting Else', 'La la la'],
        title: 'Test Modal',
      },
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, initialState);
  }
}
