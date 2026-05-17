# Lesson 21 — React Router: Routing & Multi-page Apps

## 🚀 Quick Start
```bash
cd "Lesson 21/examples/react-router-app"
pnpm install   # only needed the first time
pnpm dev       # http://localhost:5173
```

## 📂 Project Structure
```
react-router-app/
├── src/
│   ├── components/
│   │   └── Navbar.jsx         ← NavLink + active styling
│   ├── pages/
│   │   ├── Home.jsx           ← SPA state-persistence demo
│   │   ├── About.jsx          ← Layout pattern explanation
│   │   ├── Products.jsx       ← Product list (Link to details)
│   │   ├── ProductDetail.jsx  ← useParams() demo
│   │   └── NotFound.jsx       ← Catch-all route + useLocation()
│   ├── App.jsx                ← BrowserRouter + Routes setup
│   ├── main.jsx               ← BrowserRouter wrapping the app
│   ├── Quiz.jsx               ← 10-question interactive quiz
│   └── App.css                ← All styles
└── package.json
```

## 🎯 What This Lesson Covers
| Concept | Where to see it |
|:---|:---|
| Client-side routing vs page reload | Home.jsx click counter |
| `<BrowserRouter>` setup | main.jsx |
| `<Routes>` + `<Route>` | App.jsx |
| Navbar outside `<Routes>` (Layout Pattern) | App.jsx |
| `<Link>` vs `<NavLink>` | Navbar.jsx |
| Dynamic routes (`:id`) | App.jsx + Products.jsx |
| `useParams()` | ProductDetail.jsx |
| `useLocation()` | NotFound.jsx |
| `useNavigate()` | Exercise 4 |
| 404 catch-all (`path="*"`) | NotFound.jsx |

## 📚 Reading Order
1. `notes/student_notes.md` — read first
2. Run `pnpm dev`, explore the app
3. `exercises/react_router_practice.md` — do the exercises
4. Click the **📝 Quiz** tab in the app
