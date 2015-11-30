
# Changelog

### v0.2.10 [view commit logs](https://github.com/bq/corbel-js/compare/v0.2.9...v0.2.10)

#### Features

* Event handler support `addEventListener/on`, `removeEventListener/off` and `dispatch/trigger`

### v0.2.0 [view commit logs](https://github.com/bq/corbel-js/compare/v0.1.2...v0.2.0)

#### Breaking changes

* In users in module IAM, the existing methods `sendResetPasswordEmail`, `create`, `get` and `getProfiles` now require the constructor `users()` instead of `user()`

    ```
    corbelDriver.iam.users().create(data)

    ```
* It's important to note that `get` method exist also with constructor `user()`, but is equivalent to write `user('me')`, and if you had it implemented in previous version, now you must use `users()`


### v0.1.0 [view commit logs](https://github.com/bq/corbel-js/compare/v0.0.10...v0.1.0)

#### Breaking changes

* Pagination change in query, `size` renamed to `pageSize`

    ```
    {
      pagination : {
        page : 1,
        pageSize : 10
      }
    }

    ```

#### Fixes

* Response errornow it responds with an object instead of a string.





## Changelog template

### vX.Y.Z [view commit logs](https://github.com/marionettejs/backbone.marionette/compare/vX.Y.Z...vX.Y.[Z-1])

#### Breaking changes

* ...

#### Fixes

* ...

#### Docs

* ...

#### Misc

* ...
