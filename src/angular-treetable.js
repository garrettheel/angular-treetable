'use strict';

angular.module('ngTreetable', [])

    .directive('ttTable', ['$compile', '$templateCache', function($compile, $templateCache) {
        return {
            restrict: 'EAC',
            scope: {
                template: '=',
                nodes: '='
            },
            link: function(scope, element) {

                function compileElement(tplName, node) {
                    var template = $templateCache.get(tplName);
                    var template_scope = scope.$new(true);
                    template_scope.node = node;
                    return $compile(template)(template_scope);
                }

                function addChildren(parentElement) {
                    var parentNode = parentElement ? parentElement.data('ttData') : null;
                    scope.nodes(parentNode).then(function(data) {
                        angular.forEach(data, function(node) {
                            var row = compileElement(scope.template, node);
                            row.data('ttData', node);
                            if (parentElement) row.attr('data-tt-parent-id', parentElement.data('ttId'));
                            element.treetable('loadBranch', null, row);
                        });
                    });
                }

                function onNodeExpand() {
                    addChildren(this.row);
                }

                function onNodeCollapse() {
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
                isBranch: '='
            },
            link: function(scope, element, attrs) {
                var branch = angular.isUndefined(scope.isBranch) ? true: scope.isBranch;
                element.attr('data-tt-id', ttNodeCounter++);
                element.attr('data-tt-branch', branch);
            }
        }

    }]);