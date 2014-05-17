# Angular Treetable

AngularJS module for working with treetables using [jquery-treetable](http://ludo.cubicphuse.nl/jquery-treetable/) under the covers.

## Usage

### Dependencies

```html
<script src="jquery.treetable.js"></script> <!-- See http://plugins.jquery.com/treetable/ -->
<link rel="stylesheet" type="text/css" href="jquery.treetable.css" />
<link rel="stylesheet" type="text/css" href="jquery.treetable.theme.default.css" /> <!-- You'll probably want to change this -->

<script src="angular.min.js"></script>

<script src="angular-treetable.min.js"></script>
```

### Define a template

Define an angular template for rendering your node. Use the `tt-node` directive on the `tr` with the following options:

* `is-branch` - Can this node be expanded (does it have children)? Optional, default=`true`.

You'll also have the `node` variable in the context with your data returned from the `nodes` function below.

```html
<script type="text/ng-template" id="tree_node">
    <tr tt-node is-branch="node.type == 'folder'">
        <td><span ng-bind="node.name"></span></td>
        <td ng-bind="node.type"></td>
        <td ng-bind="node.size"></td>
    </tr>
</script>
```

### Create the table

Add a `tt-table` directive to your table element, with the following options:

* `nodes` - a `function` which takes an optional parent and returns a `promise` for an array of the children of that parent. This will initially be called with `null` to generate the root of the tree and then once again every time a node is expanded.
* `template` - either a `string` or a `function` which returns the template to use for rendering nodes. If a function, the node will be given as an argument.
* `options` = options for the treetable, see [jQuery Treetable Configuration](http://ludo.cubicphuse.nl/jquery-treetable/#configuration)

```html
<table tt-table nodes="get_nodes" template="'tree_node'" after-init="after">
    <thead>
        <tr>
            <th>Filename</th>
            <th>Type</th>
            <th>Size</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
```

#### Example for generating nodes

Here's a simple example for the `nodes` function. Note that since we're using a promise for the return value, you could also
do things like make an HTTP call to fetch the data from an external location.

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

$scope.get_nodes = function(parent) {
    var deferred = $q.defer();
    deferred.resolve(parent ? parent.children : tableData);
    return deferred.promise;
}

```


## More

See the `example` folder for more information.