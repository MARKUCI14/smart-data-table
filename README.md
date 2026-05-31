# smart-data-table

A lightweight, framework-agnostic **data table Web Component** built with [Lit](https://lit.dev). Provides sorting, pagination, search, column visibility control, CSV export, and modal object inspection — all configurable via HTML attributes.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Attributes](#attributes)
- [JavaScript API](#javascript-api)
- [Events](#events)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Features in Detail](#features-in-detail)
- [Framework Usage](#framework-usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

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

## Requirements

- A browser with [Web Components support](https://caniuse.com/custom-elementsv1) (all modern browsers)
- Node.js **≥ 16** (for local development or bundling)
- If loading via `<script type="module">` directly in the browser, no bundler is required

---

## Installation

### npm

```bash
npm install smart-data-table
```

### CDN (no bundler required)

```html
<script type="module" src="https://unpkg.com/smart-data-table/dist/smart-data-table.js"></script>
```

---

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>smart-data-table demo</title>
  </head>
  <body>
    <smart-data-table id="table" show-search export-csv page-size="5"></smart-data-table>

    <script type="module">
      import 'smart-data-table';

      document.querySelector('#table').data = [
        { id: 1, name: 'Alice', age: 22, role: 'Developer' },
        { id: 2, name: 'Bob', age: 25, role: 'Designer' },
        { id: 3, name: 'Carol', age: 30, role: 'Manager' },
      ];
    </script>
  </body>
</html>
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

The component sends a `GET` request to the provided URL and expects a JSON response of type `Record<string, any>[]`. Columns are automatically extracted from the first object in the returned array.

---

## Attributes

| Attribute        | Type    | Default | Description                                      |
| ---------------- | ------- | ------- | ------------------------------------------------ |
| `page-size`      | Number  | `10`    | Number of rows per page                          |
| `sortable`       | String  | `""`    | Comma-separated list of sortable columns         |
| `show-search`    | Boolean | `false` | Enables the global search input                  |
| `hidden-columns` | String  | `""`    | Comma-separated list of columns to hide          |
| `export-csv`     | Boolean | `false` | Enables the CSV export button                    |
| `api`            | String  | `""`    | URL of a remote JSON endpoint to fetch data from |

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

### Properties

| Property          | Type                    | Description                          |
| ----------------- | ----------------------- | ------------------------------------ |
| `data`            | `Record<string, any>[]` | Input dataset (set programmatically) |
| `api`             | `string`                | Fetch data from an API endpoint      |
| `pageSize`        | `number`                | Pagination size                      |
| `sortableColumns` | `string`                | Comma-separated sortable columns     |
| `hiddenColumns`   | `string`                | Comma-separated hidden columns       |
| `exportCSV`       | `boolean`               | Enables CSV export                   |
| `showSearch`      | `boolean`               | Enables search UI                    |

### Setting data programmatically

```js
const table = document.querySelector('smart-data-table');

// Replace the entire dataset
table.data = newArray;

// Update options at runtime
table.pageSize = 20;
table.hiddenColumns = 'id,createdAt';
```

### Listening to events

```js
const table = document.querySelector('smart-data-table');

table.addEventListener('row-click', (e) => {
  console.log('Clicked row data:', e.detail);
});

table.addEventListener('sort-change', (e) => {
  console.log('Sort state:', e.detail); // { column: 'age', direction: 'asc' }
});
```

---

## Events

| Event           | Fired when           | `e.detail` shape                                         |
| --------------- | -------------------- | -------------------------------------------------------- |
| `row-click`     | A row is clicked     | The full row object                                      |
| `sort-change`   | Sorting changes      | `{ column: string, direction: 'asc' \| 'desc' \| null }` |
| `page-change`   | Page changes         | `{ page: number, pageSize: number }`                     |
| `search-change` | Search input updates | `{ query: string }`                                      |

---

## Keyboard Shortcuts

| Key      | Action                           |
| -------- | -------------------------------- |
| `Escape` | Close the object inspector modal |

---

## Features in Detail

### Sorting

Click a column header to cycle through sort states:

1. First click → ascending
2. Second click → descending
3. Third click → reset (unsorted)

Only columns listed in the `sortable` attribute are clickable. Columns not listed render as plain, non-interactive headers.

### Search

Filters across all visible columns. For example, entering `"john"` matches any row where any visible cell contains that string (case-insensitive). Hidden columns (via `hidden-columns`) are excluded from the search.

### Pagination

Rows are split into pages of `page-size` rows each. Navigation controls are rendered below the table. Pagination resets to page 1 whenever the search query or sort order changes.

### Column visibility

Columns listed in `hidden-columns` are fully removed from the header, all rows, and CSV export. To toggle visibility at runtime, update the `hiddenColumns` property:

```js
table.hiddenColumns = 'email,phone';
```

### CSV export

Exports the currently filtered and sorted dataset. Only visible columns are included. Example output:

```
name,age,role
Alice,22,Developer
Bob,25,Designer
```

### Object inspector modal

When a cell contains a nested object or array, clicking it opens a modal with a formatted JSON view of the value. Press `Escape` or click outside the modal to close it.

---

## Framework Usage

### Vanilla JS / HTML

```html
<smart-data-table show-search sortable="age,role" page-size="5"></smart-data-table>
<script type="module" src="node_modules/smart-data-table/dist/smart-data-table.js"></script>
```

### React

```jsx
import 'smart-data-table';

export default function App() {
  return <smart-data-table show-search sortable="age,role" page-size="5" />;
}
```

> **Note:** To pass `data` as an array from React, use a `ref`:
>
> ```jsx
> import { useEffect, useRef } from 'react';
> import 'smart-data-table';
>
> export default function App() {
>   const ref = useRef(null);
>
>   useEffect(() => {
>     ref.current.data = [{ id: 1, name: 'Alice', age: 22 }];
>   }, []);
>
>   return <smart-data-table ref={ref} show-search />;
> }
> ```

### Vue

```vue
<script setup>
import 'smart-data-table';
import { ref, onMounted } from 'vue';

const tableRef = ref(null);

onMounted(() => {
  tableRef.value.data = [{ id: 1, name: 'Alice', age: 22 }];
});
</script>

<template>
  <smart-data-table ref="tableRef" show-search sortable="age,role" />
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

```ts
// component.ts — passing data via ViewChild
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent implements AfterViewInit {
  @ViewChild('table') tableRef!: ElementRef;

  ngAfterViewInit() {
    this.tableRef.nativeElement.data = [{ id: 1, name: 'Alice', age: 22 }];
  }
}
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

### Project structure

```
smart-data-table/
├── src/
│   ├── index.css
│   ├── smart-data-table.styles.ts
│   └── smart-data-table.ts
├── dist/
│   └── smart-data-table.js
├── package.json
└── README.md
```

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository and clone it locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run tests:
   ```bash
   npm test
   ```
5. Build for production:
   ```bash
   npm run build
   ```

Please open an issue before submitting a pull request for significant changes. All pull requests should include relevant tests and an update to this documentation if applicable.

---

## Changelog

### v1.0.0

- Initial release
- Static data and API endpoint support
- Sorting, pagination, search, hidden columns, CSV export
- Object inspector modal
- Event system: `row-click`, `sort-change`, `page-change`, `search-change`
- Framework guides for React, Vue, and Angular

---

## License

MIT © Portik Márk-Krisztián

MIT © Portik Márk-Krisztián
