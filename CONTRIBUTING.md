Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/toondaey/nestjs-pdf/pulls) for an open or closed PR
   that relates to your submission. You don't want to duplicate effort.
1. Fork the toondaey/nestjs-pdf.
1. Make your changes in a new git branch:

    ```shell
    git checkout -b my-fix-branch master
    ```

1. Create your patch, **including appropriate test cases**.
1. Follow our [Coding Rules](#rules).
1. Run the tests scripts specified in `package.json` and ensure that all tests pass.
1. Commit your changes using a descriptive commit message that follows our
   [commit message conventions](#commit). Adherence to these conventions
   is necessary because release notes are automatically generated from these messages.

    ```shell
    git commit -a
    ```

    Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

1. Push your branch to GitHub:

    ```shell
    git push origin my-fix-branch
    ```

1. In GitHub, send a pull request to `toondaey/nestjs-pdf:master`.

-   If we suggest changes then:

    -   Make the required updates.
    -   Re-run the Nest test suites to ensure tests are still passing.
    -   Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

        ```shell
        git rebase master -i
        git push -f
        ```

That's it! Thank you for your contribution!

## <a name="rules"></a> Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

<!--
// We're working on auto-documentation.
* All public API methods **must be documented**. (Details TBC). -->

-   All features or bug fixes **must be tested** by one or more specs (unit-tests).
-   We follow [Google's JavaScript Style Guide][js-style-guide], but wrap all code at
    **100 characters**. An automated formatter is available (`npm run format`).

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the Nest change log**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples: (even more [samples](https://github.com/toondaey/nestjs-pdf/commits/master))

```
docs(changelog): update change log to beta.5
bugfix(core): need to depend on latest rxjs and zone.js
```

[js-style-guide]: https://google.github.io/styleguide/jsguide.html
