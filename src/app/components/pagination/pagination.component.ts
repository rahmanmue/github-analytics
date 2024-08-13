import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, take } from 'rxjs';
import * as PaginationActions from '../../state/pagination/pagination.actions';
import { AsyncPipe } from '@angular/common';
import { PaginationState } from '../../state/pagination/pagination.reducer';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  paginationState$!: Observable<number>;
  totalItems$!: Observable<number>;

  constructor(private store: Store<{ pagination: PaginationState }>) {
    this.paginationState$ = this.store.select(
      (state) => state.pagination.currentPage
    );
    this.totalItems$ = this.store.select(
      (state) => state.pagination.totalItems
    );
  }
  nextPage() {
    combineLatest([this.paginationState$, this.totalItems$])
      .pipe(take(1))
      .subscribe(([currentPage, totalItems]) => {
        if (totalItems !== 0) {
          this.store.dispatch(
            PaginationActions.setCurrentPage({ currentPage: currentPage + 1 })
          );
        }
      });
  }

  prevPage() {
    this.paginationState$.pipe(take(1)).subscribe((currentPage) => {
      if (currentPage > 1) {
        this.store.dispatch(
          PaginationActions.setCurrentPage({ currentPage: currentPage - 1 })
        );
      }
    });
  }
}
