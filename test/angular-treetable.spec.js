'use strict';

describe('Angular Treetable', function() {

    beforeEach(module('ngTreetable'));

    it('should', inject(function($rootScope, $controller, $timeout, $q) {

        var node = {name: 'Some node'};

        var table = $('<table></table>');
        var $scope = {
            nodes: function(parent) {
                var q = $q.defer();
                q.resolve([node]);
                return q.promise;
            },
            template: function() { return 'TestTemplate' }
        }

        var ctrl = $controller('TreetableController', {
            $scope: $scope,
            $element: table
        });

        $rootScope.$apply();
        $timeout.flush();

        var treetableData = table.data("treetable");

    }));
});