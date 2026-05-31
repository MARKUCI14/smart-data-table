import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styles } from './smart-data-table.styles';

@customElement('smart-data-table')
export class SmartDataTable extends LitElement {
  // Data to display
  @property({ type: Array })
  data: Record<string, any>[] = [];

  // API endpoint
  @property({ type: String })
  api?: string;

  // Page size (Pagination)
  @property({ type: Number, attribute: 'page-size' })
  pageSize: number = 10;

  // Sortable columns
  @property({ type: String, attribute: 'sortable' })
  sortableColumns: string = '';

  // Show search input
  @property({ type: Boolean, attribute: 'show-search' })
  showSearch: boolean = false;

  // Columns
  @state()
  private columns: string[] = [];

  // For Object modal
  @state()
  private selectedObject: any = null;

  // For Object modal status
  @state()
  private modalOpen: boolean = false;

  // Current Page
  @state()
  private currentPage: number = 1;

  @state()
  private sortColumn: string | null = null;

  @state()
  private sortDirection: 'none' | 'asc' | 'desc' = 'none';

  @state()
  private search: string = '';

  static readonly styles = styles;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._handleKeyDown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleKeyDown);
    super.disconnectedCallback();
  }

  updated(changedProps: Map<string, any>) {
    if (changedProps.has('data')) {
      this._extractColumns();
      this.currentPage = 1; // Reset to first page when data changes
    }

    if (changedProps.has('api') && this.api) {
      this._fetchData();
      this.currentPage = 1; // Reset to first page when API changes
    }
  }

  private readonly _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
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
      console.error('Error fetching API data:', error);
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
    return value !== null && typeof value === 'object';
  }

  private _renderCell(value: any) {
    if (this._isObject(value)) {
      return html` <button class="obj-btn" @click=${() => this._openModal(value)}>View object</button> `;
    }

    return html`${value ?? ''}`;
  }

  private _openModal(obj: any) {
    this.selectedObject = obj;
    this.modalOpen = true;
  }

  private _closeModal() {
    this.modalOpen = false;
    this.selectedObject = null;
  }

  private get _processedData() {
    const sorted = this._sortData([...this._filteredData()]);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;

    return sorted.slice(start, end);
  }

  private _totalPages() {
    const totalItems = this._filteredData().length;
    const size = this.pageSize > 0 ? this.pageSize : 1;
    return Math.max(1, Math.ceil(totalItems / size));
  }

  private _nextPage() {
    if (this.currentPage < this._totalPages()) {
      this.currentPage++;
    }
  }

  private _prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  private _isSortable(column: string) {
    if (!this.sortableColumns) return false;

    return this.sortableColumns
      .split(',')
      .map((c) => c.trim())
      .includes(column);
  }

  private _sortData(data: Record<string, any>[]) {
    const sorted = [...data];

    if (!this.sortColumn || this.sortDirection === 'none') {
      return sorted;
    }

    sorted.sort((a, b) => {
      const valA = a[this.sortColumn!];
      const valB = b[this.sortColumn!];

      if (valA == null && valB == null) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      const numA = Number(valA);
      const numB = Number(valB);

      const bothNumeric = !Number.isNaN(numA) && !Number.isNaN(numB);

      if (bothNumeric) {
        return numA - numB;
      }

      return String(valA).localeCompare(String(valB));
    });

    if (this.sortDirection === 'desc') {
      sorted.reverse();
    }

    return sorted;
  }

  private _toggleSort(column: string) {
    if (!this._isSortable(column)) return;

    if (this.sortColumn !== column) {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    } else {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else if (this.sortDirection === 'desc') {
        this.sortDirection = 'none';
        this.sortColumn = null;
      } else {
        this.sortDirection = 'asc';
      }
    }

    this.currentPage = 1;
    this.requestUpdate();
  }

  private _filteredData() {
    const q = this.search.trim().toLowerCase();

    if (!q) {
      return this.data;
    }

    return this.data.filter((row) => {
      return Object.values(row).some((val) => {
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }

  private _onSearchChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.search = input.value;
    this.currentPage = 1;
  }

  private _renderHeader() {
    return html`
      <thead>
        <tr>
          ${this.columns.map((col) => {
            const sortable = this._isSortable(col);

            const indicator =
              this.sortColumn === col
                ? this.sortDirection === 'asc'
                  ? ' ▲'
                  : this.sortDirection === 'desc'
                    ? ' ▼'
                    : ''
                : '';

            return html`
              <th @click=${() => this._toggleSort(col)} style=${sortable ? 'cursor: pointer;' : 'cursor: default;'}>
                ${col}${sortable ? indicator : ''}
              </th>
            `;
          })}
        </tr>
      </thead>
    `;
  }

  private _renderRows() {
    return html`
      <tbody>
        ${this._processedData.map(
          (row) => html`
            <tr>
              ${this.columns.map((col) => html` <td>${this._renderCell(row[col])}</td> `)}
            </tr>
          `,
        )}
      </tbody>
    `;
  }

  private _renderSearch() {
    return html`
      <div class="search-bubble">
        <input type="text" placeholder="Search..." .value=${this.search} @input=${this._onSearchChange} />
      </div>
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
          </pre
          >
        </div>
      </div>
    `;
  }

  private _renderPagination() {
    const total = this._totalPages();

    if (total <= 1) {
      return null;
    }

    return html`
      <div class="pagination">
        <button @click=${this._prevPage} ?disabled=${this.currentPage === 1}>Prev</button>

        <span> Page ${this.currentPage} / ${total} </span>

        <button @click=${this._nextPage} ?disabled=${this.currentPage === total}>Next</button>
      </div>
    `;
  }

  render() {
    if (!this.data || this.data.length === 0) {
      return html`<div class="empty">No data available</div>`;
    }

    return html`
      <div class="table-shell">
        ${this.showSearch ? this._renderSearch() : null}

        <div class="wrapper">
          <table>
            ${this._renderHeader()} ${this._renderRows()}
          </table>
        </div>

        ${this._renderModal()} ${this._renderPagination()}
      </div>
    `;
  }
}
