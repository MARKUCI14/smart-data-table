# smart-data-table

A lightweight, framework-agnostic **data table Web Component** built with [Lit](https://lit.dev). Provides sorting, pagination, search, column visibility control, CSV export, and modal object inspection — all configurable via HTML attributes.

---

## Features

- Render data from a static JSON array or a remote API endpoint
- Automatic column extraction from your data shape
- Pagination with configurable page size
- Column sorting (opt-in per column)
- Global search filtering across all visible columns
- Hide specific columns via attribute
- CSV export of the current filtered/sorted view
- Object inspector modal for nested values
- Keyboard support (Escape closes modal)
- Fully framework-agnostic — works with React, Vue, Angular, or vanilla JS

---

## Installation

```bash
npm install smart-data-table
```

---

## Usage

### Basic

```html
<smart-data-table></smart-data-table>

<script type="module">
  import 'smart-data-table';
</script>
```

### With static data

```html
<smart-data-table id="table"></smart-data-table>

<script type="module">
  import 'smart-data-table';

  const table = document.querySelector('#table');
  table.data = [
    { id: 1, name: 'Alice', age: 22, role: 'Developer' },
    { id: 2, name: 'Bob', age: 25, role: 'Designer' },
  ];
</script>
```

### With an API endpoint

```html
<smart-data-table api="https://jsonplaceholder.typicode.com/users"></smart-data-table>
```

---

## Attributes

| Attribute        | Type    | Default | Description                              |
| ---------------- | ------- | ------- | ---------------------------------------- |
| `page-size`      | Number  | `10`    | Number of rows per page                  |
| `sortable`       | String  | `""`    | Comma-separated list of sortable columns |
| `show-search`    | Boolean | `false` | Enables the global search input          |
| `hidden-columns` | String  | `""`    | Comma-separated list of columns to hide  |
| `export-csv`     | Boolean | `false` | Enables the CSV export button            |

### Attribute examples

**Pagination size**

```html
<smart-data-table page-size="5"></smart-data-table>
```

**Sorting** — only listed columns are sortable:

```html
<smart-data-table sortable="age,role"></smart-data-table>
```

**Search** — adds a search input in a toolbar bubble above the table:

```html
<smart-data-table show-search></smart-data-table>
```

**Hide columns** — removes columns from the header, rows, and CSV export:

```html
<smart-data-table hidden-columns="id,email,password"></smart-data-table>
```

**CSV export** — adds an Export CSV button next to the search input:

```html
<smart-data-table export-csv show-search></smart-data-table>
```

**Combined example**

```html
<smart-data-table page-size="3" sortable="age,role" show-search hidden-columns="id" export-csv></smart-data-table>
```

---

## JavaScript API

| Property          | Type                    | Description                      |
| ----------------- | ----------------------- | -------------------------------- |
| `data`            | `Record<string, any>[]` | Input dataset                    |
| `api`             | `string`                | Fetch data from an API endpoint  |
| `pageSize`        | `number`                | Pagination size                  |
| `sortableColumns` | `string`                | Comma-separated sortable columns |
| `hiddenColumns`   | `string`                | Comma-separated hidden columns   |
| `exportCSV`       | `boolean`               | Enables CSV export               |
| `showSearch`      | `boolean`               | Enables search UI                |

---

## Features in detail

### Sorting

Click a column header to cycle through sort states:

1. First click → ascending
2. Second click → descending
3. Third click → reset (unsorted)

Only columns listed in `sortable` are clickable.

### Search

Filters across all visible columns. For example, entering `"john"` matches any row where any visible cell contains that string.

### Column visibility

Columns listed in `hidden-columns` are fully removed from the header, all rows, and CSV export.

### CSV export

Exports the currently filtered and sorted dataset. Example output:

```
name,age,role
Alice,22,Developer
Bob,25,Designer
```

---

## Events

| Event           | Fired when           |
| --------------- | -------------------- |
| `row-click`     | A row is clicked     |
| `sort-change`   | Sorting changes      |
| `page-change`   | Page changes         |
| `search-change` | Search input updates |

---

## Keyboard shortcuts

| Key      | Action                           |
| -------- | -------------------------------- |
| `Escape` | Close the object inspector modal |

---

## Framework usage

### React

```jsx
import 'smart-data-table';

export default function App() {
  return <smart-data-table show-search sortable="age,role" page-size="5" />;
}
```

### Vue

```vue
<script setup>
import 'smart-data-table';
</script>

<template>
  <smart-data-table show-search sortable="age,role" />
</template>
```

### Angular

```ts
// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import 'smart-data-table';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
```

```html
<!-- template -->
<smart-data-table show-search sortable="age,role"></smart-data-table>
```

---

## Architecture

```
Attributes / Properties
        ↓
Lit reactive state
        ↓
Pipeline:
  1. Column extraction
  2. Filtering (search)
  3. Sorting
  4. Pagination
        ↓
UI rendering (table + toolbar + modal)
```

### Design goals

- Framework-agnostic Web Component
- Fully configurable via HTML attributes
- Reactive rendering via Lit
- Drop-in usage with no required dependencies

## License

MIT © Portik Márk-Krisztián
