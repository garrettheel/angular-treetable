# Angular Treetable

AngularJS module for working with treetables using [jquery-treetable](http://ludo.cubicphuse.nl/jquery-treetable/) under the covers.

## Usage

### Dependencies

```html
<script src="jquery.treetable.js"></script> <!-- See http://plugins.jquery.com/treetable/ -->
<link rel="stylesheet" type="text/css" href="jquery.treetable.css" />
<link rel="stylesheet" type="text/css" href="jquery.treetable.theme.default.css" /> <!-- You'll probably want to modify this -->

<script src="angular.min.js"></script>

<script src="angular-treetable.min.js"></script>
```

### Configuration

Create an `ngTreetableParams` object containing your configuration. Applicable keys are:

* `getNodes(parent)` - a `function` which takes a parent (or `null` for the root) and returns an array of the children of that parent. May also return a `promise` resolving to the children.
* `getTemplate(node)` - a `function` which returns the path to a template to use for rendering a single node. 
* `options` - options for the underlying treetable, see [jQuery Treetable Configuration](http://ludo.cubicphuse.nl/jquery-treetable/#configuration)

```js
app.controller('MyController', function($scope, ngTreetableParams) {
    $scope.params = new ngTreetableParams({
        getNodes: function(parent) {
            return [{name: 'foo', value: 'bar'}];
        },
        getTemplate: function(node) {
            return 'TreeNode.html';
        },
        options: {
            onNodeExpand: function() {
                console.log('A node was expanded!');
            }
        }
    });
}
```

Note that you can also call `refresh()` on the `ngTreetableParams` instance to rebuild the entire table.

### Define node template(s)

Use the `tt-node` directive in your templates to define your table row. The optional `is-branch` attribute indicates whether
the branch can be expanded.

You can define your template on the same page as the table:

```html
<script type="text/ng-template" id="TreeNode.html">
    <tr tt-node is-branch="node.name == 'foo'">
        <td><span ng-bind="node.name"></span></td>
        <td ng-bind="node.type"></td>
    </tr>
</script>
```

or in a separate file to be loaded over an HTTP call:
```html
<!-- TreeNode.html -->
<tr tt-node is-branch="node.name == 'foo'">
    <td><span ng-bind="node.name"></span></td>
    <td ng-bind="node.type"></td>
</tr>
```

Note: Be wary of doing an `ng-bind` to the first `td` in your template, as this causes issues with jquery-treetable's indentation.


### Create the table

Add a `tt-table` directive to your table element and pass in the parameters via `tt-params`.

```html
<table tt-table tt-params="params">
    <thead>
        <tr>
            <th>Name</th>
            <th>Value</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
```

## Examples

### Generating nodes

Here's a really simple example for the `getNodes` function, which returns data directly from the scope. 

```javascript
var tableData = [
    {
        name: 'Some Folder',
        type: 'folder',
        size: '',
        children: [
            {
                name: 'some file.pdf',
                type: 'file',
                size: '500KB'
            },
            {
                name: 'another_file.doc',
                type: 'file',
                size: '344KB'
            }
        ]
    }
];

$scope.params = new ngTreetableParams({
    getNodes: function(parent) {
        return parent ? parent.children : data;
    },
    // ...
});

```

You can also return a promise from `getNodes`. This is useful when you need to fetch data externally, like from `$http`. For example:

```js
$scope.params = new ngTreetableParams({
    getNodes: function(parent) {
        var deferred = $q.defer();
        $http.get('/get-nodes').success(function(data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    },
    // ...
});
```


### More

See the `example` folder to learn more.