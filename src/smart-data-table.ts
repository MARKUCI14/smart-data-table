import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
// import litLogo from './assets/lit.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

type Row = Record<string, any>

@customElement('smart-data-table')
export class SmartDataTable extends LitElement {
  // ======================
  // INPUT PROPERTIES
  // ======================
  @property({type: Array})
  data: Row[] = [];

  @property({type: Array})
  columns: string[] = [];

  @property({type: String})
  title = '';
  // ======================
  // INTERNAL STATE
  // ======================
  @state() private sortKey: string = "";
  @state() private sortDir: "asc" | "desc" = "asc";
  @state() private query: string = "";
  @state() private page: number = 1;
  @state() private pageSize: number = 5;
  @state() private selected: Set<any> = new Set();

  static readonly styles = css`
{
  display: block;
  font-family: inherit;
}

.container {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
}

header {
  padding: 10px;
  font-weight: 600;
  background: var(--header-bg);
}

.controls {
  display: flex;
  gap: 10px;
  padding: 10px;
  background: var(--controls-bg);
}

input {
  flex: 1;
  padding: 6px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid var(--border);
  text-align: left;
}

th {
  cursor: pointer;
  background: var(--controls-bg);
}

tr:hover {
  background: var(--row-hover);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 10px;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  border-radius: 6px;
}

.selected {
  background: var(--selected-bg);
}

`;

// ======================
// DATA PROCESSING
// ======================
private get processedData() {
let d = [...this.data];

// FILTER
if (this.query) {
  d = d.filter(row =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(this.query.toLowerCase())
  );
}

// SORT
if (this.sortKey) {
  d.sort((a, b) => {
    const valA = a[this.sortKey];
    const valB = b[this.sortKey];

    if (valA > valB) return this.sortDir === "asc" ? 1 : -1;
    if (valA < valB) return this.sortDir === "asc" ? -1 : 1;
    return 0;
  });
}

return d;

}

private get paginatedData() {
const start = (this.page - 1) * this.pageSize;
return this.processedData.slice(start, start + this.pageSize);
}

private get totalPages() {
return Math.ceil(this.processedData.length / this.pageSize);
}

// ======================
// EVENTS
// ======================
private toggleSort(col: string) {
if (this.sortKey === col) {
this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
} else {
this.sortKey = col;
this.sortDir = "asc";
}
}

private toggleSelect(index: number) {
const globalIndex = (this.page - 1) * this.pageSize + index;

const newSet = new Set(this.selected);
newSet.has(globalIndex)
  ? newSet.delete(globalIndex)
  : newSet.add(globalIndex);

this.selected = newSet;

}

// ======================
// RENDER
// ======================
render() {
const cols =
this.columns.length > 0
? this.columns
: Object.keys(this.data[0] || {});

return html`
  <div class="container">
    <header>${this.title || "Smart Data Table"}</header>

    <div class="controls">
      <input
        placeholder="Search..."
        @input=${(e: any) => (this.query = e.target.value)}
      />
    </div>

    <table>
      <thead>
        <tr>
          <th></th>
          ${cols.map(
            col => html`
              <th @click=${() => this.toggleSort(col)}>
                ${col}
                ${this.sortKey === col
                  ? this.sortDir === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
            `
          )}
        </tr>
      </thead>

      <tbody>
        ${this.paginatedData.map(
          (row, i) => html`
            <tr
              class=${this.selected.has(
                (this.page - 1) * this.pageSize + i
              )
                ? "selected"
                : ""}
            >
              <td>
                <input
                  type="checkbox"
                  @change=${() => this.toggleSelect(i)}
                />
              </td>

              ${cols.map(
                col => html`<td>${row[col]}</td>`
              )}
            </tr>
          `
        )}
      </tbody>
    </table>

    <div class="pagination">
      <button
        ?disabled=${this.page === 1}
        @click=${() => (this.page--)}
      >
        Prev
      </button>

      <span>${this.page} / ${this.totalPages || 1}</span>

      <button
        ?disabled=${this.page === this.totalPages}
        @click=${() => (this.page++)}
      >
        Next
      </button>
    </div>
  </div>
`;

}
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': SmartDataTable
  }
}
