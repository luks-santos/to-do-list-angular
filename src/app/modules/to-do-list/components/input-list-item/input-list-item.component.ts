import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iListItems } from '../../interfaces/iListItems.interface';

@Component({
  selector: 'app-input-list-item',
  standalone: true,
  imports: [],
  templateUrl: './input-list-item.component.html',
  styleUrl: './input-list-item.component.scss',
})
export class InputListItemComponent {
  @Input({ required: true }) public inputListItems: iListItems[] = [];

  @Output() public outputUpdatedItemCheckbox = new EventEmitter<{
    id: string;
    checked: boolean;
  }>();
  public updateItemCheckbox(id: string, checked: boolean) {
    this.outputUpdatedItemCheckbox.emit({ id, checked });
  }

  @Output() public outputUpdatedItemText = new EventEmitter<{
    id: string;
    value: string;
  }>();
  public updateItemText(id: string, value: string) {
    this.outputUpdatedItemText.emit({ id, value });
  }

  @Output() public outputDeleteItem = new EventEmitter<string>();
  public deleteItem(id: string) {
    this.outputDeleteItem.emit(id);
  }
}
