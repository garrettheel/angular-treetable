Angular Treetable
=================

AngularJS module for working with treetables using [jquery-treetable](http://ludo.cubicphuse.nl/jquery-treetable/) under the covers.

Usage
-----

```html
<script type="text/ng-template" id="tree_node">
    <tr tt-node is-branch="node.type == 'folder'">
        <td><span ng-bind="node.name"></span></td>
        <td ng-bind="node.type"></td>
        <td ng-bind="node.size"></td>
    </tr>
</script>

<table id="table" tt-table nodes="get_nodes" template="'tree_node'">
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

See `example` for more information.