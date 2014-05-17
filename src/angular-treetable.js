'use strict';

angular.module('ngTreetable', [])

    .controller('TreetableController', ['$scope', '$element', '$compile', '$templateCache', function($scope, $element, $compile, $templateCache) {

        var table = $element;

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

                var parentTtNode = parentId != null ? table.treetable("node", parentId) : null;
                $element.treetable('loadBranch', parentTtNode, newElements);

                if (parentElement) parentElement.scope().loading = false;

                if (parentElement == null && angular.isFunction($scope.afterInit)) {
                    $scope.afterInit();
                }
            });
        }

        $scope.onNodeExpand = function() {
            if (this.row.scope().loading) return; // make sure we're not already loading
            table.treetable('unloadBranch', this); // make sure we don't double-load
            $scope.addChildren(this.row);
        }

        $scope.onNodeCollapse = function() {
            if (this.row.scope().loading) return; // make sure we're not already loading
            table.treetable('unloadBranch', this);
        }

        $scope.treetableOptions = angular.extend({
            expandable: true,
            onNodeExpand: $scope.onNodeExpand,
            onNodeCollapse: $scope.onNodeCollapse
        }, $scope.options);

        if ($scope.options) {
            // Inject event handlers before custom ones
            angular.forEach(['onNodeCollapse', 'onNodeExpand'], function(event) {
                if ($scope.options[event]) {
                    $scope.treetableOptions[event] = function() {
                        $scope[event].apply(this, arguments);
                        $scope.options[event].apply(this, arguments);
                    }
                }
            });
        }

        table.treetable($scope.treetableOptions);

        $scope.addChildren(null);

    }])

    .directive('ttTable', [function() {
        return {
            restrict: 'AC',
            scope: {
                template: '=',
                nodes: '=',
                options: '='
            },
            controller: 'TreetableController'
        }
    }])

    .directive('ttNode', [function() {
        var ttNodeCounter = 0;
        return {
            restrict: 'AC',
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