import "./smart-data-table";

const data = [
  { id: 1, name: "Alice", age: 22, role: "Dev" },
  { id: 2, name: "Bob", age: 25, role: "Designer" },
  { id: 3, name: "Charlie", age: 30, role: "Manager" },
  { id: 4, name: "David", age: 28, role: "Dev" },
  { id: 5, name: "Eve", age: 26, role: "QA" },
];

document.querySelector("#app")!.innerHTML = `
  <smart-data-table
    .data=${data}
    title="Employees"
  ></smart-data-table>
`;