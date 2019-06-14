import { CellEditor, CellEditorProps, ListItemOptions } from './types';
import { CellValue } from '../store/types';

export class SelectEditor implements CellEditor {
  private el: HTMLSelectElement;

  public constructor(props: CellEditorProps) {
    const el = document.createElement('select');
    const { listItems } = props.columnInfo.editor!.options as ListItemOptions;

    listItems.forEach(({ text, value }) => {
      el.appendChild(this.createOptions(text, value));
    });
    el.value = String(props.value);

    this.el = el;
  }

  private createOptions(text: string, value: CellValue) {
    const option = document.createElement('option');
    option.setAttribute('value', String(value));
    option.innerText = text;

    return option;
  }

  public getElement() {
    return this.el;
  }

  public getValue() {
    return this.el.value;
  }

  public mounted() {
    this.el.focus();
  }
}