var app = angular.module('example', ['ngTreetable']);

app.controller('ExampleCtrl', function($scope, $q, treetableParams) {

    var data = [
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

    $scope.params = new treetableParams({
        getNodes: function(parent) {
            return parent ? parent.children : data;
        },
        getTemplate: function(node) {
            return 'tree_node';
        },
        options: {
            onNodeExpand: function() {
                console.log('A node was expanded!');
            }
        }
    });

});