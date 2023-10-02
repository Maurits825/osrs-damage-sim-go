import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { DamageSimService } from 'src/app/services/damage-sim.service';

@Component({
  selector: 'app-ng-select-lazy-load',
  templateUrl: './ng-select-lazy-load.component.html',
  styleUrls: ['./ng-select-lazy-load.component.css'],
})
export class NgSelectLazyLoadComponent<T> implements OnInit, OnDestroy, OnChanges {
  @Input()
  valueType: T;

  @Input()
  allValues: T[];

  @Input()
  selectedValue: T;

  @Input()
  searchProperty: string;

  @Input()
  placeholder: string;

  @Input()
  clearable = true;

  @ContentChild('dropdownLabel') dropdownLabel: TemplateRef<unknown>;
  @ContentChild('dropdownOptions') dropdownOptions: TemplateRef<unknown>;

  @Output()
  valueChanged = new EventEmitter<T>();

  valuesBuffer: T[];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;

  input$ = new Subject<string>();

  private abbreviations: Record<string, string[]>;

  private destroyed$ = new Subject();

  constructor(private damageSimService: DamageSimService) {}

  ngOnInit(): void {
    this.valuesBuffer = this.allValues.slice(0, this.bufferSize);
    this.damageSimService.abbreviations$.subscribe((abbreviations) => (this.abbreviations = abbreviations));
    this.onSearch();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['allValues']) {
      this.valuesBuffer = this.allValues.slice(0, this.bufferSize);
    }
  }

  selectedValueChange(value: T): void {
    this.valueChanged.emit(value);
  }

  onScrollToEnd(searchTerm: string): void {
    this.fetchMore(searchTerm);
  }

  fetchMore(searchTerm: string): void {
    const len = this.valuesBuffer.length;
    const more = this.allValues
      .filter((value: T) => this.valueFilter(value, searchTerm))
      .slice(len, this.bufferSize + len);

    // TODO timeout is needed because otherwise the onScrollToEnd only triggers once, can maybe use OnScroll instead
    setTimeout(() => {
      this.valuesBuffer = this.valuesBuffer.concat(more);
    }, 1);
  }

  onSearch(): void {
    this.input$.pipe(takeUntil(this.destroyed$), distinctUntilChanged()).subscribe((searchTerm) => {
      this.valuesBuffer = this.allValues
        .filter((value: T) => this.valueFilter(value, searchTerm))
        .slice(0, this.bufferSize);
    });
  }

  valueFilter(value: T, searchTerm: string): boolean {
    if (!searchTerm) return true;

    const name = value[this.searchProperty as keyof T] as string;
    const abbreviations = this.abbreviations[name];

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name
        .replace(/[^0-9a-z]/gi, '')
        .toLowerCase()
        .includes(searchTerm.replace(/[^0-9a-z]/gi, '').toLowerCase()) ||
      abbreviations?.some((abb: string) => abb.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }
}
