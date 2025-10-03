# Code Assessment

## Validate form inputs properly

Use the correct types and patterns (min="0"):

```js
<input type="number" name="salary" min="0" ... />
```
## Avoid using id as e.target.id in generic handleChange

This assumes all inputs have id that matches form keys exactly. Use name instead (which is standard form practice).

Update all form fields to use name:

```js
<input name="title" ... />
```

Then your handler becomes:

```js
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};
```

## Replace console.error with proper UI feedback (e.g., a toast or inline error message).

Even a basic useState for error:

```js
const [error, setError] = useState("");

...

catch (error) {
  setError("Something went wrong. Please try again.");
  console.error(error);
}

...

{error && <p className="error">{error}</p>}
```

## Sanitize or validate input before sending (especially requirements)

You could trim whitespace or filter out empty entries:


```js
const postData = {
  ...form,
  requirements: form.requirements.filter(r => r.trim() !== ""),
  ...
}

```
