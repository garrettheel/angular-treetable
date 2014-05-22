'use strict';

angular.module('ngTreetable', [])

    /**
     * @ngdoc service
     */
    .factory('ngTreetableParams', ['$log', function($log) {
        var params = function(baseConfiguration) {
            var self = this;

            /**
             * @ngdoc method
             * @param {<any>} parent A parent node to fetch children of, or null if fetching root nodes.
             */
            this.getNodes = function(parent) {}

            /**
             * @ngdoc method
             * @param {<any>} node A node returned from getNodes
             */
            this.getTemplate = function(node) {}

            /**
             * @ngdoc property
             */
            this.options = {};

            /**
             * @ngdoc method
             */
            this.refresh = function() {}


            if (angular.isObject(baseConfiguration)) {
                angular.forEach(baseConfiguration, function(val, key) {
                    if (['getNodes', 'getTemplate', 'options'].indexOf(key) > -1) {
                        self[key] = val;
                    } else {
                        $log.warn('Ignoring unexpected property "' + key + '" in ngTreetableParams.');
                    }
                });
            }

        }
        return params;
    }])

    .controller('TreetableController', ['$scope', '$element', '$compile', '$templateCache', '$q', '$http', function($scope, $element, $compile, $templateCache, $q, $http) {

        var params = $scope.ttParams;
        var table = $element;

        $scope.compileElement = function(node, parentId, parentNode) {
            var tpl = params.getTemplate(node);

            var templatePromise = $http.get(params.getTemplate(node), {cache: $templateCache}).then(function(result) {
                return result.data;
            });

            return templatePromise.then(function(template) {
                var template_scope = $scope.$parent.$new();
                angular.extend(template_scope, {
                    node: node,
                    parentNode: parentNode
                });
                template_scope._ttParentId = parentId;
                return $compile(template)(template_scope);
            })

        }

        $scope.addChildren = function(parentElement) {
            var parentNode = parentElement ? parentElement.scope().node : null;
            var parentId = parentElement ? parentElement.data('ttId') : null;

            if (parentElement) {
                parentElement.scope().loading = true;
            }

            $q.when(params.getNodes(parentNode)).then(function(data) {
                var newElements = [];
                var elementPromises = [];
                angular.forEach(data, function(node) {
                    var rowPromise = $scope.compileElement(node, parentId, parentNode).then(function(row) {
                        newElements.push(row.get(0));
                    });
                    elementPromises.push(rowPromise);
                });

                $q.all(elementPromises).then(function() {
                    var parentTtNode = parentId != null ? table.treetable("node", parentId) : null;
                    $element.treetable('loadBranch', parentTtNode, newElements);

                    if (parentElement) parentElement.scope().loading = false;
                });

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

        $scope.refresh = function() {
            $scope.configureOptions();

            var rootNodes = table.data('treetable').nodes;
            while (rootNodes.length > 0) {
                table.treetable('removeNode', rootNodes[0].id);
            }
            $scope.addChildren(null);
        }
        params.refresh = $scope.refresh;

        $scope.configureOptions = function() {
            $scope.treetableOptions = angular.extend({
                expandable: true,
                onNodeExpand: $scope.onNodeExpand,
                onNodeCollapse: $scope.onNodeCollapse
            }, params.options);

            if (params.options) {
                // Inject required event handlers before custom ones
                angular.forEach(['onNodeCollapse', 'onNodeExpand'], function(event) {
                    if (params.options[event]) {
                        $scope.treetableOptions[event] = function() {
                            $scope[event].apply(this, arguments);
                            params.options[event].apply(this, arguments);
                        }
                    }
                });
            }
        }

        $scope.configureOptions();
        table.treetable($scope.treetableOptions);
        $scope.addChildren(null);

    }])

    .directive('ttTable', [function() {
        return {
            restrict: 'AC',
            scope: {
                ttParams: '='
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
                var parent = angular.isDefined(scope.parent) ? scope.parent : scope.$parent._ttParentId;

                element.attr('data-tt-id', ttNodeCounter++);
                element.attr('data-tt-branch', branch);
                element.attr('data-tt-parent-id', parent);
            }
        }

    }]);