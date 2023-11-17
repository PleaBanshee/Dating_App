import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from 'src/app/models/pagination';
import { UserParams } from 'src/app/models/user-params';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() pagination: Pagination | undefined;
  @Input() userParams: UserParams | undefined;
  @Output() pageChangedEmitter = new EventEmitter<number>();

  constructor() {}

  pageChanged(event: any) {
    // Emit the page change event through the service
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.userParams.pageNumber = event.page;
      this.pageChangedEmitter.emit(this.userParams.pageNumber);
    }
  }
}
