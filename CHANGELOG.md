
# Changelog

### v0.3.4 [view commit logs](https://github.com/bq/corbel-js/compare/v0.3.3...v0.3.4)

#### Features

* Merged with 0.2.X, adds `.domain` implementation

### v0.3.3 [view commit logs](https://github.com/bq/corbel-js/compare/v0.3.2...v0.3.3)

#### Features

* Refactor to encode query params in SerializeParams function

### v0.3.2 [view commit logs](https://github.com/bq/corbel-js/compare/v0.3.0...v0.3.2)

#### Features

* Includes updates ACL
* Webfs

### v0.3.0 [view commit logs](https://github.com/bq/corbel-js/compare/v0.2.10...v0.3.0)

#### Features

* Added `blob`, `dataURI`, `stream` serializers to `request.js`

### v0.2.21 [view commit logs](https://github.com/bq/corbel-js/compare/v0.2.10...v0.2.21)

#### Fixes

* Fixes bug with encoded urls
* Support requests in IE 
* Only 1 token refresh at the time
* Fixed events hashmap

#### Features

* Added `.domain` implementation for custom domain requests

### v0.2.10 [view commit logs](https://github.com/bq/corbel-js/compare/v0.2.9...v0.2.10)

#### Features

* Event handler support `addEventListener/on`, `removeEventListener/off` and `dispatch/trigger`


### v0.2.8 [view commit logs](https://github.com/bq/corbel-js/compare/v0.2.0...v0.2.8)

#### Breaking changes

* Assets and notifications' API have changed so now, both modules follow the main syntax

    ```
    corbelDriver.assets(.*).get() -> corbelDriver.assets.asset(.*).get()
    corbelDriver.notifications(.*).get() -> corbelDriver.notifications.notification(.*).get()

    ```


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
