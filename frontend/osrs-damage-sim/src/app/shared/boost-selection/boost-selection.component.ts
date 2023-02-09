import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { BoostService } from 'src/app/services/boost.service';
import { allBoosts, Boost } from '../../model/osrs/boost.model';
import { BoostModalComponent } from '../boost-modal/boost-modal.component';

@Component({
  selector: 'app-boost-selection',
  templateUrl: './boost-selection.component.html',
  styleUrls: ['./boost-selection.component.css'],
})
export class BoostSelectionComponent implements OnInit, OnDestroy {
  @Input()
  selectedBoosts: Set<Boost>;

  @Output()
  boostToggle = new EventEmitter<Boost>();

  allBoosts = allBoosts;
  quickBoosts: Set<Boost> = new Set(['overload_plus', 'smelling_salts', 'super_combat', 'ranging', 'saturated_heart']);
  quickBoostSelected = true;

  private globalBoostsSubscription: Subscription;

  constructor(private modalService: NgbModal, private boostService: BoostService) {}

  ngOnDestroy(): void {
    this.globalBoostsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.quickBoostSelected = this.isOnlyQuickBoostSelected();
    this.globalBoostsSubscription = this.boostService.globalBoosts$.subscribe((_: Set<Boost>) => {
      this.quickBoostSelected = this.isOnlyQuickBoostSelected();
    });
  }

  open() {
    const boostModal = this.modalService.open(BoostModalComponent, { size: 'sm', animation: false });
    boostModal.componentInstance.selectedBoosts = this.selectedBoosts;
    boostModal.componentInstance.boostToggle.subscribe((boost: Boost) => {
      this.toggleBoost(boost);
    });
  }

  toggleBoost(boost: Boost): void {
    this.boostToggle.emit(boost);
    this.quickBoostSelected = this.isOnlyQuickBoostSelected();
  }

  isOnlyQuickBoostSelected(): boolean {
    for (const selectedBoost of this.selectedBoosts) {
      if (!this.quickBoosts.has(selectedBoost)) {
        return false;
      }
    }
    return true;
  }
}
