import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RagingEchoesSettings } from 'src/app/model/osrs/leagues/raging-echoes.model';

@Component({
  selector: 'app-raging-echoes',
  templateUrl: './raging-echoes.component.html',
})
export class RagingEchoesComponent {
  @Input()
  ragingEchoesSettings: RagingEchoesSettings;

  @Output()
  ragingEchoesSettingsChange = new EventEmitter<RagingEchoesSettings>();

  settingsChange() {
    this.ragingEchoesSettingsChange.emit(this.ragingEchoesSettings);
  }
}
