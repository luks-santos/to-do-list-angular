import { Component, signal } from '@angular/core';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { iListItems } from '../../interfaces/iListItems.interface';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalStorage } from '../../enum/ELocalStorage';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  public addItem = signal(true);

  #setListItems = signal<iListItems[]>(this.#parseItems());
  public getListItems = this.#setListItems.asReadonly();

  #parseItems() {
    return JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]');
  }

  #updateLocalStorage() {
    return localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify(this.#setListItems())
    );
  }

  public getInputAndAddItem(value: iListItems) {
    localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify([...this.#setListItems(), value])
    );

    return this.#setListItems.set(this.#parseItems());
  }

  public listItemStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((res: iListItems) => {
      if (value === 'pending') {
        return !res.checked;
      }

      if (value === 'completed') {
        return res.checked;
      }

      return res;
    });
  }

  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: iListItems[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }
        return res;
      });
      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItems.update((oldValue: iListItems[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }
        return res;
      });
      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public deleteItem(id: string) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter essa ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar item!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deletado!',
          text: 'Item removido.',
          icon: 'success',
        });
        this.#setListItems.update((oldValue: iListItems[]) => {
          return oldValue.filter((res) => res.id !== id);
        });

        return this.#updateLocalStorage();
      }
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter essa ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar tudo!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deletado!',
          text: 'Todos os itens foram removidos.',
          icon: 'success',
        });
        localStorage.removeItem(ELocalStorage.MY_LIST);
        return this.#setListItems.set(this.#parseItems());
      }
    });
  }
}
