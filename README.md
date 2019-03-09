# LuckPermsWeb
A collection of web resources for the LuckPerms plugin.

**This branch is a full re-write and not complete.**

**Currently working on:** web editor

**To do:**
- Home page
- Verbose report
- Debug report
- Tree report

A working version of this fork can be used here:  
[https://lpweb.turbotailz.com/#/editor/](https://lpweb.turbotailz.com/#/editor/)`<sessionID>`

Where `<sessionID>` is the 10 digit ID when you generate a new editor session.  

**Example:**

If your link looks like this:

`https://luckperms.github.io/editor/#ewx0HjBMX9`

Then your session ID is `ewx0HjBMX9`  
(The part after the #)

## Project setup
```
npm install
```

### Compile and setup hot-reloads for development
```
npm run serve
```

### Compile and minify for production
```
npm run build
```

### Lint and fix files
```
npm run lint
```