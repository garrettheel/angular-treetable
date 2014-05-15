# Angular Treetable

AngularJS module for working with treetables using [jquery-treetable](http://ludo.cubicphuse.nl/jquery-treetable/) under the covers.

## Usage


### Define a template

Define an angular template for rendering your node. Use the `tt-node` directive on the `tr` with the following options:

* `is-branch` - Can this node be expanded (does it have children)? Optional, default=true.
* `parent` - Used for placing nodes under the correct parent. This is already set in the scope as `parent`, so just pass it along.

You'll also have the `node` variable in the context with your data returned from the `nodes` function below.

```html
<script type="text/ng-template" id="tree_node">
    <tr tt-node is-branch="node.type == 'folder'" parent="parent">
        <td><span ng-bind="node.name"></span></td>
        <td ng-bind="node.type"></td>
        <td ng-bind="node.size"></td>
    </tr>
</script>
```

### Create the table

Add a `tt-table` directive to your table element, with the following options:

* `nodes` - a `function` which takes an optional parent and returns a `promise` for an array of the children of that parent. This will initially be called with `null` to generate the root of the tree and then again every time a node is expanded.
* `template` - either a `string` or a `function` which returns the template to use for rendering nodes. If a function, the node will be given as an argument.
* `after-init` - an optional `function` to be called after the table has finished loading the root nodes.

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