# Promiser

`promiser` is a simple manager of deferreds by name. Rather than creating and maintaining references to `jQuery.Deferred` objects, simply register a handler by name and resolve or reject is by name.

```javascript
promiser.done('test', function() {
    console.log('hello world');
});

promiser.resolve('test');

promiser.isResolved('test'); // true
```

The promiser API includes all the methods on the [jQuery Deferred](http://api.jquery.com/category/deferred-object/) object.

Chaining works as expected:

```javascript
promiser
    .done('test1', function() { ... })
    .done('test2, function() { ... })
    .done('test3, function() { ... });
```

For a more elegant approach, an object can be passed:

```javascript
promiser.done({
    test1: function() { ... },
    test2: function() { ... },
    test3: function() { ... }
});
```

It supports the `when` method:

```javascript
promiser.when('test1', 'test2', 'test3', function() {
    console.log('all done!');
});
```

You can even reset a deferred after it has been resolved or rejected. This provides a clean alternative to passing around references to deferred objects:

```javascript
promiser.reset('test1');
```


## Install

```bash
bower install promiser
```

## Setup

promiser.js works in the browser as well as the Node and AMD environments.

## Usage

The `promiser` object can be used three ways:

**As Is**

```javascript
// It itself implements the promiser API
promiser.done('foo', function() { ... });
```

**Constructor**

```javscript
// Create promiser objects
var p1 = new promiser;
p1 instanceof promiser; // true
```

**Function**

```javascript
// Create a new plain object
var p1 = promiser();

// Extend an existing object
var p2 = promiser({});
```
