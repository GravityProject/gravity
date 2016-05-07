# Contributing
Please review this guideline when contributing to the Gravity repository.

## Issues
Issues should include a descriptive title and a description which briefly describes what the issue is all about.
Issues can be anything such as bugs, features, enhancements, discussions...

Before opening a new issue please search through all the existing ones so that we don't introduce duplicates.

## Pull Requests
Each pull request should close / fix an issue so that the community can discuss the functionality
before a line of code is written.

We need to define some standards in order to keep code quality high.
Pull requests who don't match the following standards won't be merged.

We stick to the [Meteor Style Guides](https://github.com/meteor/meteor/wiki/Meteor-Style-Guide) as close as possible.

Just read through the code a little bit to get an idea of the used coding conventions.

Here are some important examples you should keep an eye on:
- Use the new ES6 syntax as often as possible (especially try to avoid `var`)
- camelCase syntax for variables (e.g. `userProfile`)
- underscores for file names (e.g. `example_file.html`)
- Each file should have an empty newline at the bottom ("Ensure line feed at end of file")
- Use two level space indentation (no tab indentation)
- Indent your code so that it's readable and sticks to the indentation of the overall project
- Remove all `console.log` statements / unnecessary code
- Try to avoid committing commented out code
- Remove dead code
- Useful variable names (e.g. `let user;` instead of `let u;`)
- Shared partials should have an underscore in front of them and be placed in a folder called `shared` (e.g. `profiles/shared/_button.html`)
-2 space indents (setq js-indent-level 2)
- Spaces, not literal tabs (setq-default indent-tabs-mode nil)
- No trailing whitespace (setq-default show-trailing-whitespace t)
