'use strict';

angular.module('ngTreetable', [])

    .controller('TreetableController', ['$scope', '$element', '$compile', '$templateCache', function($scope, $element, $compile, $templateCache) {

        $scope.compileElement = function(node, parentId) {
            var tpl = angular.isFunction($scope.template) ? $scope.template(node) : $scope.template;
            var template = $templateCache.get(tpl);
            var template_scope = $scope.$parent.$new();
            template_scope.node = node;
            template_scope._ttParent = parentId;
            return $compile(template)(template_scope);
        }

        $scope.addChildren = function(parentElement) {
            var parentNode = parentElement ? parentElement.scope().node : null;
            var parentId = parentElement ? parentElement.data('ttId') : null;

            if (parentElement) {
                parentElement.scope().loading = true;
            }

            $scope.nodes(parentNode).then(function(data) {
                var newElements = [];
                angular.forEach(data, function(node) {
                    var row = $scope.compileElement(node, parentId);
                    newElements.push(row.get(0));
                });

                var parentTtNode = parentId != null ? $element.treetable("node", parentId) : null;
                $element.treetable('loadBranch', parentTtNode, newElements);

                if (parentElement) parentElement.scope().loading = false;

                if (parentElement == null && angular.isFunction($scope.afterInit)) {
                    $scope.afterInit();
                }
            });
        }

        $scope.onNodeExpand = function() {
            if (this.row.scope().loading) return; // make sure we're not already loading
            $element.treetable('unloadBranch', this); // make sure we don't double-load
            $scope.addChildren(this.row);
        }

        $scope.onNodeCollapse = function() {
            if (this.row.scope().loading) return; // make sure we're not already loading
            $element.treetable('unloadBranch', this);
        }

        $element.treetable({
            expandable: true,
            onNodeExpand: $scope.onNodeExpand,
            onNodeCollapse: $scope.onNodeCollapse
        });

        $scope.addChildren(null);


    }])

    .directive('ttTable', [function() {
        return {
            restrict: 'EAC',
            scope: {
                template: '=',
                nodes: '=',
                afterInit: '='
            },
            controller: 'TreetableController'
        }
    }])

    .directive('ttNode', [function() {
        var ttNodeCounter = 0;
        return {
            restrict: 'EAC',
            scope: {
                isBranch: '=',
                parent: '='
            },
            link: function(scope, element, attrs) {
                var branch = angular.isDefined(scope.isBranch) ? scope.isBranch : true;

                // Look for a parent set by the tt-tree directive if one isn't explicitly set
                var parent = angular.isDefined(scope.parent) ? scope.parent : scope.$parent._ttParent;

                element.attr('data-tt-id', ttNodeCounter++);
                element.attr('data-tt-branch', branch);
                element.attr('data-tt-parent-id', parent);
            }
        }

    }]);