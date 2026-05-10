# Practice Exercises — Lesson 19: Intro to React

## ⚙️ Setup
Open the provided Vite project for this lesson:
```bash
cd "Lesson 19/examples/react-intro-app"
pnpm install   # only needed the first time
pnpm dev       # starts the dev server at http://localhost:5173
```
All exercises should be done inside this project. You can open `src/App.jsx` and the files inside `src/components/` in VS Code.

---

## Part 1: Spot the JSX Errors

React will throw errors if your JSX isn't perfect. Look at the components below and identify what is wrong with them. (Do not run the code yet — try to find the errors by eye).

### Exercise 1
```jsx
function Header() {
    return (
        <h1>Welcome to my website</h1>
        <p>I hope you like it here.</p>
    );
}
```
**Error:** ______________________________________________________________
**Fix:** ________________________________________________________________

<details>
<summary>✅ Answer — Exercise 1</summary>

**Error:** Returning multiple sibling elements. React components must return a single root element.
**Fix:** Wrap the `<h1>` and `<p>` in a `<div>` or a Fragment (`<> ... </>`).
</details>

---

### Exercise 2
```jsx
function Profile() {
    return (
        <div class="profile-container">
            <img src="avatar.png">
            <h2>User Profile</h2>
        </div>
    );
}
```
**Error 1:** ______________________________________________________________
**Error 2:** ______________________________________________________________

<details>
<summary>✅ Answer — Exercise 2</summary>

**Error 1:** Used `class` instead of `className`. `class` is a reserved JavaScript keyword.
**Error 2:** The `<img>` tag is not closed. In JSX, all tags must close (e.g., `<img src="..." />`).
</details>

---

### Exercise 3
```jsx
function ScoreBoard(props) {
    const score = 100;
    return (
        <div>
            <h2>Player: props.name</h2>
            <p>Score: score</p>
        </div>
    );
}
```
**Error:** ______________________________________________________________

<details>
<summary>✅ Answer — Exercise 3</summary>

**Error:** Forgot curly braces `{}` around variables. This will literally print the words "props.name" and "score" on the screen.
**Fix:** `<h2>Player: {props.name}</h2>` and `<p>Score: {score}</p>`
</details>

---

## Part 2: Building Components

### Exercise 4: Destructuring Props
Rewrite the `Greeting` component so that it uses **object destructuring** in the function parameters instead of `props`.

```jsx
// CHANGE THIS:
function Greeting(props) {
    return (
        <div className="greeting-box">
            <h3>Hello, {props.firstName} {props.lastName}!</h3>
            <p>Your role is: {props.role}</p>
        </div>
    );
}

// TO THIS:
function Greeting( /* TODO: Destructure here */ ) {
    return (
        <div className="greeting-box">
            {/* TODO: Use the destructured variables here */}
        </div>
    );
}
```

---

### Exercise 5: Building a Product Card
Create a reusable `Product` component that accepts `name`, `price`, and `isSoldOut` as props.

**Requirements:**
1. Display the `name` in an `<h3>`.
2. Display the `price` formatted with a dollar sign (e.g., `$29.99`).
3. If `isSoldOut` is `true`, render a `<button disabled>Sold Out</button>`.
4. If `isSoldOut` is `false`, render a `<button>Add to Cart</button>`.

*(Hint: Use the ternary operator `{condition ? trueJSX : falseJSX}`)*

```jsx
function Product({ name, price, isSoldOut }) {
    // TODO: Return the JSX
}

// Render test (put this in App)
<Product name="Wireless Mouse" price={29.99} isSoldOut={false} />
<Product name="Mechanical Keyboard" price={120.00} isSoldOut={true} />
```

---

### Exercise 6: Mapping over an Array
You rarely type out 50 components manually. Usually, you loop over an array of data and return a component for each item. 

Use the `.map()` array method to render a `<Product />` (from Exercise 5) for every item in the array.

```jsx
const inventory = [
    { id: 1, name: "Monitor", price: 199.99, isSoldOut: false },
    { id: 2, name: "Mousepad", price: 15.00, isSoldOut: false },
    { id: 3, name: "Webcam", price: 45.99, isSoldOut: true }
];

function StoreFront() {
    return (
        <div>
            <h1>My Tech Store</h1>
            <div className="product-grid">
                {/* TODO: Map over 'inventory' array here */}
                {/* Remember to pass the 'key' prop! */}
            </div>
        </div>
    );
}
```

<details>
<summary>💡 Hint for Exercise 6</summary>

```jsx
{inventory.map(item => (
    <Product 
        key={item.id} 
        name={item.name} 
        price={item.price} 
        isSoldOut={item.isSoldOut} 
    />
))}
```
*Note: In React, whenever you map over an array to create elements, you must give each root element a unique `key` prop (usually the database ID). This helps React keep track of the elements efficiently.*
</details>

---

### Exercise 7: Extend a Real Component — `avatarUrl` Prop

Open `src/components/UserCard.jsx` in the Vite project.

**Your Task:**
1. Add `avatarUrl` to the destructured props list at the top of the function.
2. Render an `<img>` tag *above* the `.card-name` heading:
   ```jsx
   <img src={avatarUrl} alt={`${name} avatar`} className="card-avatar-img" />
   ```
3. Open `src/App.jsx`. Find the `teamMembers` array and add an `avatarUrl` field to each member. Use this free avatar API (change `?u=` for unique images):
   ```
   https://i.pravatar.cc/80?u=1
   https://i.pravatar.cc/80?u=2
   https://i.pravatar.cc/80?u=3
   ```
4. Pass the new prop in the `.map()` call: `<UserCard ... avatarUrl={member.avatarUrl} />`

**Predict before running:**
```
// What happens if you forget to pass avatarUrl and it receives `undefined`?
// Will React throw an error, or will the <img> just show a broken image icon?
// Answer: _______________________________________________
```

<details>
<summary>✅ Answer</summary>

React will NOT throw an error. `<img src={undefined} />` renders a broken image icon — React silently ignores it. This is why default prop values (`avatarUrl = ''`) or conditional rendering (`{avatarUrl && <img ... />}`) are good practices.
</details>
