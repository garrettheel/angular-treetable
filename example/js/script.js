var app = angular.module('example', ['ngTreetable']);

app.controller('ExampleCtrl', ['$scope', '$q' ,function($scope, $q) {

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

}]);