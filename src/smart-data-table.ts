import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "./smart-data-table.styles";

@customElement("smart-data-table")
export class SmartDataTable extends LitElement {
  @property({ type: Array })
  data: Record<string, any>[] = [];

  @property({ type: String })
  api?: string;

  @state()
  private columns: string[] = [];

  @state()
  private selectedObject: any = null;

  @state()
  private modalOpen: boolean = false;

  static readonly styles = styles;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener("keydown", this._handleKeyDown);
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, any>) {
    if (changedProps.has("data")) {
      this._extractColumns();
    }

    if (changedProps.has("api") && this.api) {
      this._fetchData();
    }
  }

  private readonly _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this._closeModal();
    }
  };

  private async _fetchData() {
    if (!this.api) return;

    try {
      const response = await fetch(this.api);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const jsonData = await response.json();

      this.data = Array.isArray(jsonData) ? jsonData : [];
    } catch (error) {
      console.error("Error fetching API data:", error);
      this.data = [];
    }
  }

  private _extractColumns() {
    if (!this.data || this.data.length === 0) {
      this.columns = [];
      return;
    }

    const keys = new Set<string>();
    for (const row of this.data) {
      Object.keys(row).forEach((k) => keys.add(k));
    }

    this.columns = Array.from(keys);
  }

  private _isObject(value: any) {
    return value !== null && typeof value === "object";
  }

  private _renderCell(value: any) {
    if (this._isObject(value)) {
      return html`
        <button
          class="obj-btn"
          @click=${() => this._openModal(value)}
        >
          View object
        </button>
      `;
    }

    return html`${value ?? ""}`;
  }

  private _openModal(obj: any) {
    this.selectedObject = obj;
    this.modalOpen = true;
  }

  private _closeModal() {
    this.modalOpen = false;
    this.selectedObject = null;
  }

  private _renderHeader() {
    return html`
      <thead>
        <tr>
          ${this.columns.map(
            (col) => html`<th>${col}</th>`
          )}
        </tr>
      </thead>
    `;
  }

  private _renderRows() {
    return html`
      <tbody>
        ${this.data.map(
          (row) => html`
            <tr>
              ${this.columns.map(
                (col) => html`
                  <td>
                    ${this._renderCell(row[col])}
                  </td>
                `
              )}
            </tr>
          `
        )}
      </tbody>
    `;
  }

  private _renderModal() {
    if (!this.modalOpen) return null;

    return html`
      <div class="modal-backdrop" @click=${this._closeModal}>
        <div class="modal" @click=${(e: Event) => e.stopPropagation()}>
          <div class="modal-header">
            <span>Object details</span>
            <button class="close" @click=${this._closeModal}>✕</button>
          </div>

          <pre class="modal-body">
${JSON.stringify(this.selectedObject, null, 2)}
          </pre>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.data || this.data.length === 0) {
      return html`<div class="empty">No data available</div>`;
    }

    return html`
      <div class="wrapper">
        <table>
          ${this._renderHeader()}
          ${this._renderRows()}
        </table>
      </div>

      ${this._renderModal()}
    `;
  }
}