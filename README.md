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
[https://luckperms.turbotailz.com/#/editor/](https://luckperms.turbotailz.com/#/editor/)`<sessionID>`

Where `<sessionID>` is the 10 digit ID when you generate a new editor session.  

**Example:**

If your link looks like this:

`https://luckperms.github.io/editor/#ewx0HjBMX9`

Then your session ID is `ewx0HjBMX9`  
(The part after the #)

## Project setup
Setting up the project locally is simple, all you need is Node installed on your computer, then you can clone the repo and run:
```
npm install
```

### Compile and setup hot-reloads for development
Once you've installed the dependencies, you can run the project locally easily by running:
```
npm run serve
```

### Compile and minify for production
If you want to build the project to a folder that can be access via a webserver, running this command will build the project in the `dist` folder:
```
npm run build
```
