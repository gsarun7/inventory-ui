# Inventory Manager UI - AI Coding Instructions

## Project Overview
React + Vite inventory management application with Material-UI components. Connects to backend API for product, category, sales, and dashboard data. Multi-page app with invoice generation, stock tracking, and sales analytics.

**Key Tech Stack**: React 19, Vite, Material-UI (MUI), Recharts, React Router DOM 7, Axios

## Architecture

### Page Structure
- **App.jsx**: Route definitions and navigation wrapper (uses BrowserRouter)
- **Pages** (`src/pages/`): Dashboard, Sales, InvoicePage - each manages own state and data fetching
- **Components** (`src/components/`): Reusable UI pieces (InventoryTable, AddItem, CategoryChart, StatsCard)
- **Layout** (`src/layout/`): Header and Sidebar (currently minimal usage)

### Data Flow
1. **API Layer** (`src/services/api.js`): Centralized Fetch-based HTTP client
   - Base URL: `https://ims-backend-9y9x.onrender.com/api`
   - Endpoints: `/items`, `/categories`, `/recent-activity`, `/dashboard`, `/sales`
   - Pattern: Single async function per operation (e.g., `getProducts()`, `addProduct(data)`)
   
2. **State Management**: React hooks (`useState`, `useEffect`) at component level
   - No global state library; state lifted up to pages/components as needed
   - Example: `InvoicePage` manages complex multi-item form state with `updateItem(index, key, value)`

3. **Component Data Integration**:
   - Components fetch data on mount via `useEffect(() => { fetchData(); }, [])`
   - Loading states managed with `loading` boolean and `CircularProgress` spinner
   - No error boundaries; use alert() for user feedback

### Styling Conventions
- **MUI System**: Use `sx` prop for responsive styles (e.g., `sx={{ display: { xs: "none", md: "flex" } }}`)
- **CSS Modules**: Some components have `.css` files (CategoryChart.css, StatsCard.css, Layout.css)
- **Inline Styles**: Acceptable in JSX for quick adjustments (e.g., `style={{ padding: "20px" }}`)
- **Responsive**: MUI Grid system with `xs`, `sm`, `md` breakpoints; `PageContainer` handles layout centering

## Component Patterns

### Functional Components
- All components are functional (hooks-based)
- Props are destructured directly (e.g., `export default function StatsCard({ title, value })`)

### Common Patterns
- **InventoryTable**: Pagination with `TablePagination`, delete confirmation with `window.confirm()`, icon buttons from MUI
- **AddItem**: Form state as object with `handleChange` spread update pattern
- **InvoicePage**: Central state object, derived calculations in `useEffect`, separate child components for form/preview
- **CategoryChart**: Dummy data arrays (not fetched yet); uses Recharts `PieChart` with colored cells

### Layout Wrapper
- **PageContainer**: Wraps centered content with responsive padding, max-width constraint
- **Navbar**: Responsive mobile drawer using MUI Drawer, responsive button display with `sx={{ display: { xs: "none", md: "flex" } }}`

## Key Implementation Details

### Forms & Validation
- Use simple form objects: `{ fieldName: "", ... }`
- Manual validation with early returns (e.g., check `if (!form.categoryId)` then alert)
- Submit patterns: collect state, transform payload (e.g., convert strings to Numbers), send to API, reset form

### Tables
- Use MUI Table, TableContainer, TablePagination for pagination logic
- Row conditional styling for warnings (e.g., red text for low stock `p.stock <= 10`)
- Delete actions require confirmation: `if (!window.confirm(...)) return;`

### Currency & Formatting
- Indian Rupee symbol: `₹` (literal character, not coded)
- Numbers: Use `parseFloat()` for calculations, `.toFixed(2)` for display
- Example from InvoicePage: `gstAmount = ((subtotal * gstPercent) / 100).toFixed(2)`

### Conditional Rendering
- Use ternary for simple UI (e.g., show "Low" warning or stock number)
- Use `&&` for optional elements that need multiple conditions
- Use `.map()` for lists; include unique `key` prop

## Development Commands
```bash
npm run dev      # Start Vite dev server (HMR enabled)
npm run build    # Production build to dist/
npm run lint     # ESLint check
npm run preview  # Preview production build locally
```

## ESLint Rules & Conventions
- React hooks rules enforced (`eslint-plugin-react-hooks`)
- No unused variables allowed (except uppercase/underscore prefixed)
- React Refresh rules for HMR compatibility
- JSX allowed in `.jsx` files; `parserOptions.ecmaVersion: 'latest'`

## Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| Forgot to add `key` to `.map()` | Always use unique `key={item.id}` in lists to avoid React warnings |
| Forgot `useEffect` dependency array | Add dependencies: `useEffect(() => {...}, [dependency])` or `[]` for mount-only |
| State not updating from API | Remember async: `const data = await getProducts(); setProducts(data)` |
| Mobile menu not responsive | Use `sx={{ display: { xs: "none", md: "flex" } }}` for breakpoint control |
| Form not resetting after submit | Call `setForm({ ...initialState })` explicitly after successful submit |

## Files to Review for Examples
- **InventoryTable.jsx**: Table pagination, delete confirmation, data fetching pattern
- **AddItem.jsx**: Form state management, category dropdown, payload transformation
- **InvoicePage.jsx**: Complex form state, derived calculations with `useEffect`, child component composition
- **Navbar.jsx**: Responsive design with MUI, mobile drawer implementation
- **CategoryChart.jsx**: Recharts integration, dummy data structure
