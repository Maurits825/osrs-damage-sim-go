import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  booleanOperators,
  comparisonOperators,
  Condition,
  conditionVariables,
} from '../../../model/shared/condition.model';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
})
export class ConditionComponent {
  @Input()
  conditions: Condition[] = [];

  booleanOperators = booleanOperators;
  comparisonOperators = comparisonOperators;
  conditionVariables = conditionVariables;

  @Output() conditionsChanged = new EventEmitter<Condition[]>();

  maxConditions = 5;

  addCondition(): void {
    this.conditions.push({
      variable: 'NPC_HITPOINTS',
      comparison: 'EQUAL',
      value: 0,
      nextComparison: 'AND',
    });

    this.conditionsChanged.emit(this.conditions);
  }

  removeCondition(condition: Condition): void {
    const index = this.conditions.indexOf(condition);
    if (index >= 0) {
      this.conditions.splice(index, 1);
    }

    this.conditionsChanged.emit(this.conditions);
  }
}
