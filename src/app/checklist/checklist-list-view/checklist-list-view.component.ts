import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ChecklistFilter, ChecklistItem } from '../models/checklist';
import { ApplicationState } from '../state';
import { ToggleFavorite, CheckAll, SetCategoriesFilter, Toggle, UncheckAll } from '../state/checklist.actions';
import { ChecklistQueries } from '../state/checklist.reducer';

@Component({
  selector: 'app-list-view',
  templateUrl: './checklist-list-view.component.html',
  styleUrls: ['./checklist-list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  items$: Observable<any>;
  filter$: Observable<ChecklistFilter>;
  showActionButtons$: Observable<boolean>;

  constructor(private store: Store<ApplicationState>, private breakPointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.items$ = this.store.pipe(select(ChecklistQueries.getItemsFromSelectedCategory));
    this.filter$ = this.store.pipe(select(ChecklistQueries.getCategroriesFilter));

    this.showActionButtons$ = this.breakPointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map((result: BreakpointState) => !result.matches));
  }

  toggleItem(item: ChecklistItem) {
    this.store.dispatch(new Toggle(item));
  }

  setFilter(filter: ChecklistFilter) {
    this.store.dispatch(new SetCategoriesFilter(filter));
  }

  checkAllItems() {
    this.getSelectedCategory().subscribe(category => this.store.dispatch(new CheckAll(category)));
  }

  uncheckAllItems() {
    this.getSelectedCategory().subscribe(category => this.store.dispatch(new UncheckAll(category)));
  }

  toggleFavorite(item: ChecklistItem) {
    this.store.dispatch(new ToggleFavorite({ id: item.id, category: item.category }));
  }

  trackById(index, item: ChecklistItem) {
    return item.id;
  }

  private getSelectedCategory() {
    return this.store.pipe(
      select(ChecklistQueries.getSelectedCategory),
      take(1),
      map(({ slug: category }) => category)
    );
  }
}
