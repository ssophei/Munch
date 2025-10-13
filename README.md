## tech stack resources

in case you need to look at documentation when completing your weekly tasks, this project is built with **react native**, **expo**, **typescript**, and **nativewind**.

### react native
[documentation](https://react.dev/reference/react)

**definition:** provides a framework for building mobile applications using JavaScript and React components, allowing developers to write code once and run it on both ios and android.

### expo
[documentation](https://docs.expo.dev/)

**definition:** builds on react native by simplifying configuration and development workflows. it handles native builds, dependencies, and deployment automatically, and provides built-in tools for routing, asset management, icons, and api integration.

### nativewind
[documentation](https://www.nativewind.dev/)

**tailwind** replaces traditional css rules with small, reusable classes applied directly in your markup. it simplifies development by eliminating separate style sheets.

example:

traditional CSS:
```css
button {
  padding: 12px 20px;
  background-color: #2563eb;
  color: white;
  border-radius: 6px;
}
```
```html
<button class="button">Click Me</button>
```

tailwind:
```html
<button class="px-5 py-3 bg-blue-600 text-white rounded-md">Click Me</button>
```
**nativewind** simply allows us to use tailwind's utility classes in our react native project. 

### typescript
[documentation](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

**typescript** adds static typing to javascript, ensuring that variables, props, and functions conform to defined types. this helps catch errors before runtime, provides better autocompletion and refactoring tools, and enforces clear data structures across the codebase.
