# Contributing Guidelines

Some basic conventions for contributing to this project.

### General

* Fork Repo
* Clone repo from your repo
* Make changes in new branch
* Please follow Airbnb style guide : https://github.com/airbnb/javascript

Note : Only make pull requests to the dev branch.

### Linting

Please check your code using `npm run lint` before submitting your pull requests, as the CI build will fail if `eslint` fails.

### Testing

Whether strictly following TDD or not, testing is a good idea. Please consult the 'Unit Tests' section of the README for guidelines.

### Branches

* dev : utilize branch to update, create, and test code on local host
* test : migrate code from dev branch to qa server
* master : migrate code from test branch to production server

### Commit Message Format

Each commit message should include a **type**, a **verb** and a **description**:

```
[type]: <Capitalize present tense verb> add description
Note: Do not add ending puncutation.
```

Lines should not exceed 100 characters.

```
  [refactor]: Create url mapper utility function
  [fix]: Update routes for login
  [docs]: Add information for commiting styles to contributing guide
```

#### Type

Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
  semi-colons, etc)
* **refactor**: A code change that neither fixes a bug or adds a feature
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
  generation

#### Scope

The scope could be anything specifying place of the commit change. For example `webpack`,
`helpers`, `api` etc...

#### Subject

The subject contains succinct description of the change:

* use the present tense: "Update" not "Updated" nor "Updates"
* capitalize first letter
* no dot (.) at the end
