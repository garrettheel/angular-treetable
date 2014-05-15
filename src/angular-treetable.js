'use strict';

angular.module('ngTreetable', [])

    .directive('ttTable', ['$compile', '$templateCache', function($compile, $templateCache) {
        return {
            restrict: 'EAC',
            scope: {
                template: '=',
                nodes: '=',
                afterInit: '='
            },
            link: function(scope, element) {

                function compileElement(node, parentId) {
                    var tpl = angular.isFunction(scope.template) ? scope.template(node) : scope.template;
                    var template = $templateCache.get(tpl);
                    var template_scope = scope.$parent.$new();
                    template_scope.node = node;
                    template_scope.parent = parentId;
                    return $compile(template)(template_scope);
                }

                function addChildren(parentElement) {
                    var parentNode = parentElement ? parentElement.scope().node : null;
                    var parentId = parentElement ? parentElement.data('ttId') : null;

                    if (parentElement) {
                        parentElement.scope().loading = true;
                    }

                    scope.nodes(parentNode).then(function(data) {
                        var newElements = [];
                        angular.forEach(data, function(node) {
                            var row = compileElement(node, parentId);
                            newElements.push(row.get(0));
                        });

                        var parentTtNode = parentId != null ? element.treetable("node", parentId) : null;
                        element.treetable('loadBranch', parentTtNode, newElements);

                        if (parentElement) parentElement.scope().loading = false;

                        if (parentElement == null && angular.isFunction(scope.afterInit)) {
                            scope.afterInit();
                        }
                    });
                }

                function onNodeExpand() {
                    if (this.row.scope().loading) return; // make sure we're not already loading
                    element.treetable('unloadBranch', this); // make sure we don't double-load
                    addChildren(this.row);
                }

                function onNodeCollapse() {
                    if (this.row.scope().loading) return; // make sure we're not already loading
                    element.treetable('unloadBranch', this);
                }

                element.treetable({
                    expandable: true,
                    onNodeExpand: onNodeExpand,
                    onNodeCollapse: onNodeCollapse
                });

                addChildren(null);

            }
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
                var branch = angular.isDefined(scope.isBranch) ? scope.isBranch: true;
                element.attr('data-tt-id', ttNodeCounter++);
                element.attr('data-tt-branch', branch);
                element.attr('data-tt-parent-id', scope.parent);
            }
        }

    }]);