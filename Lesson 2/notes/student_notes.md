# Student Notes – Lesson 2: Advanced HTML5, Semantic Web, Forms & Validation

## Topics Covered

1. Structuring web pages with advanced HTML5 semantic elements.
2. The importance of semantic HTML for web standards, accessibility, and SEO.
3. Building interactive forms for user input.
4. Implementing basic client-side form validation.

## Key Concepts

### Semantic HTML5 Elements

| Tag              | Purpose                                      |
|------------------|----------------------------------------------|
| `<header>`       | Introductory content, logo, navigation       |
| `<nav>`          | Navigation links                             |
| `<main>`         | Primary content of the page                  |
| `<article>`      | Self-contained content (blog post, story)    |
| `<section>`      | Thematic grouping of content                 |
| `<aside>`        | Tangentially related content (sidebar)       |
| `<footer>`       | Footer content, copyright, links             |
| `<figure>`       | Media with optional caption                  |
| `<figcaption>`   | Caption for a `<figure>`                     |

### HTML Forms Cheat Sheet

```html
<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <button type="submit">Submit</button>
</form>
```

### Common Input Types

| Type       | Usage                          | Example                                    |
|------------|--------------------------------|--------------------------------------------|
| `text`     | General text                   | `<input type="text">`                      |
| `email`    | Email addresses (validated)    | `<input type="email">`                     |
| `password` | Hidden text entry              | `<input type="password">`                  |
| `number`   | Numeric values                 | `<input type="number" min="1" max="100">`  |
| `date`     | Date picker                    | `<input type="date">`                      |
| `checkbox` | Toggle on/off                  | `<input type="checkbox">`                  |
| `radio`    | Select one from a group        | `<input type="radio" name="group">`        |

### Form Validation Attributes

| Attribute     | What It Does                                  |
|---------------|-----------------------------------------------|
| `required`    | Field must be filled in before form submits    |
| `min` / `max` | Minimum and maximum values for number/date     |
| `minlength` / `maxlength` | Min/max character count for text fields |
| `pattern`     | Regular expression the value must match        |

## Activities

1. **Semantic Refactor** → `exercises/01_semantic_refactor.html`
   - Take a page built with `<div>` tags and replace them with semantic elements.

2. **Registration Form** → `exercises/02_registration_form.html`
   - Build a registration form with various input types and labels.

## Post-Session Assignment

**Create a Contact Form** → `assignments/contact_form.html`

Your contact form must include:
- Name (text input)
- Email (email input)
- Subject (select dropdown with at least 3 options)
- Message (textarea)
- A submit button
- Proper `<label>` tags on all fields
- Some fields marked as `required`

## Resources & Links

- **Reading:**
  - [MDN: Semantic HTML](https://developer.mozilla.org/en-US/docs/Glossary/Semantic_HTML)
  - [W3Schools: HTML Forms](https://www.w3schools.com/html/html_forms.asp)
- **Videos:**
  - [Semantic HTML Tutorial](https://www.youtube.com/watch?v=T_C4Njq9z6Q)
  - [HTML Forms Explained](https://www.youtube.com/watch?v=vG_C614y_yQ)
- **Tools:**
  - [Visual Studio Code](https://code.visualstudio.com/)

## Tips

- Always think about the **meaning** of your content when choosing HTML tags.
- Test your forms thoroughly to ensure they behave as expected.
- Pay attention to accessibility — well-structured forms are easier for everyone to use.
