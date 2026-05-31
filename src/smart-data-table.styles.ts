import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
      Arial, sans-serif;
    color: #0f172a;
  }

  .wrapper {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    background: #2563eb;
    color: white;
  }

  th {
    text-align: left;
    font-weight: 600;
    padding: 12px 14px;
    font-size: 12px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  td {
    padding: 12px 14px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    color: #334155;
    vertical-align: top;
  }

  tbody tr:nth-child(even) {
    background: #f8fafc;
  }

  tbody tr:hover {
    background: #eff6ff;
    transition: background 0.15s ease;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .empty {
    padding: 28px;
    text-align: center;
    color: #64748b;
    background: #f8fafc;
    font-size: 14px;
  }

  th:first-child,
  td:first-child {
    padding-left: 16px;
  }

  th:last-child,
  td:last-child {
    padding-right: 16px;
  }

  /* OBJECT BUTTON */
  .obj-btn {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 6px;
    border: 1px solid #cbd5e1;
    background: white;
    color: #2563eb;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .obj-btn:hover {
    background: #eff6ff;
    border-color: #93c5fd;
  }

  /* MODAL */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
  }

  .modal {
    width: 520px;
    max-width: 92vw;
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.2);
    border: 1px solid #e2e8f0;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #2563eb;
    color: white;
    font-weight: 600;
  }

  .modal-body {
    padding: 16px;
    font-size: 12px;
    overflow: auto;
    max-height: 60vh;
    background: #0b1220;
    color: #e5e7eb;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", monospace;
  }

  .close {
    background: transparent;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    opacity: 0.9;
  }

  .close:hover {
    opacity: 1;
  }
`;