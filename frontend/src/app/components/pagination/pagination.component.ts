import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from 'src/app/models/pagination';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() pagination: Pagination | undefined;
  @Output() pageChangedEmitter = new EventEmitter<number>();

  constructor() {}

  pageChanged(event: any) {
    // Emit the page change event through the service
    if (this.pagination && this.pagination?.currentPage !== event.page) {
      this.pagination.currentPage = event.page;
      this.pageChangedEmitter.emit(event.page);
    }
  }
}
