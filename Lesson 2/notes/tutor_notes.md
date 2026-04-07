# Tutor Notes – Lesson 2: Advanced HTML5, Semantic Web, Forms & Validation

## Learning Objectives

By the end of this session, the student will be able to:

- Utilize advanced HTML5 elements for better page structure and functionality.
- Understand and apply semantic HTML to improve accessibility and SEO.
- Create various types of HTML forms with different input fields.
- Implement basic HTML5 form validation.

## Materials Needed

- Computer with internet access
- VS Code
- Web browser (Chrome or Firefox recommended)

## Preparation Checklist

- [ ] Review the purpose and usage of common HTML5 semantic tags.
- [ ] Familiarize yourself with different HTML form input types and attributes.
- [ ] Open the example files in `examples/` to walk through during the session.
- [ ] Ensure the student has their `my_first_page.html` from Lesson 1 available.

## Session Outline

### Part 1: Semantic HTML5 (≈30 min)

1. **Why Semantics Matter**
   - Explain the difference between `<div>` soup and semantic markup.
   - Benefits: accessibility (screen readers), SEO (search engines understand structure), maintainability.

2. **Walk Through Semantic Tags**
   - Open `examples/semantic_page.html` and explain each tag:
     - `<header>` – introductory content, logo, navigation
     - `<nav>` – navigation links
     - `<main>` – primary content of the page
     - `<article>` – self-contained content (blog post, news story)
     - `<section>` – thematic grouping of content
     - `<aside>` – tangentially related content (sidebar)
     - `<footer>` – footer content, copyright, links
     - `<figure>` / `<figcaption>` – images with captions

3. **Activity: Semantic Refactor**
   - Have the student open `exercises/01_semantic_refactor.html`.
   - Guide them to replace generic `<div>` tags with appropriate semantic elements.

### Part 2: HTML Forms (≈30 min)

4. **Form Basics**
   - Explain `<form>`, `action`, and `method` attributes.
   - Demonstrate how form data is submitted (show in DevTools Network tab).

5. **Input Types & Labels**
   - Walk through `examples/form_examples.html`.
   - Emphasize the importance of `<label>` for accessibility (`for` attribute).
   - Cover: `text`, `email`, `password`, `number`, `date`, `checkbox`, `radio`.

6. **Activity: Registration Form**
   - Have the student open `exercises/02_registration_form.html`.
   - Build out the form step by step.

### Part 3: Form Validation (≈15 min)

7. **HTML5 Built-in Validation**
   - Demonstrate `required`, type-based validation (`email`, `number`).
   - Show `min`, `max`, `minlength`, `maxlength`, `pattern`.
   - Let the student try submitting incomplete forms to see browser messages.

8. **Wrap-Up & Assignment**
   - Introduce the post-session assignment: `assignments/contact_form.html`.
   - Encourage experimentation with new input types.

## Tips for Tutor

- Explain the benefits of semantic HTML **beyond** just visual presentation.
- Demonstrate how form data is submitted and the role of `action` and `method`.
- Highlight the importance of `<label>` tags for accessibility.
- Encourage the student to experiment with different input types and validation rules.
- Use browser DevTools to show how semantic elements appear in the accessibility tree.
