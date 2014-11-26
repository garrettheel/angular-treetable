describe('Angular Treetable', function() {

    'use strict';

    beforeEach(module('ngTreetable'));

    describe('TreetableController', function() {
        var table, rootScope, scope, createCtrl, ctrl, simpleParams;
        var simpleTemplate = '<tr tt-node><td>{{ node }}</td></tr>';

        beforeEach(inject(function ($rootScope, $controller, $templateCache, ngTreetableParams) {
            table = $('<table></table>');
            rootScope = $rootScope;
            scope = $rootScope.$new();

            simpleParams = new ngTreetableParams({
                getNodes: function(parent) { return []; },
                getTemplate: function(node) { return 'Node'; }
            });

            createCtrl = function(treetableParams) {
                scope.ttParams = treetableParams;
                ctrl = $controller('TreetableController', {$scope: scope,
                                                           $element: table});
            }

            $templateCache.put('Node', simpleTemplate);
        }));


        afterEach(inject(function($httpBackend) {
            $httpBackend.verifyNoOutstandingRequest();
            $httpBackend.verifyNoOutstandingExpectation();
        }));

        it("should allow treetable options to be passed in", function() {
            simpleParams.options = {expandable: false};
            createCtrl(simpleParams);

            var opts = scope.getOptions();
            expect(opts.expandable).toBe(false);
        });

        it("should generate the tree root when initialised", function() {
            simpleParams.getNodes = function(parent) {
                return ["node1", "node2"];
            }
            createCtrl(simpleParams);
            rootScope.$digest();

            var treetableData = table.data("treetable");

            expect(treetableData).toBeDefined();
            expect(treetableData.nodes.length).toBe(2);

            var tds = table.find("td");

            expect(tds.length).toBe(2);
            expect(tds[0].innerText).toContain('node1');
            expect(tds[1].innerText).toContain('node2');
        });

        it("should make the node and parent available in the td scope", function() {
            simpleParams.getNodes = function(parent) {
                return parent ? ["node2"] : ["node1"];
            }
            createCtrl(simpleParams);
            rootScope.$digest();

            expect(table.find("td").scope().node).toBe("node1");

            table.find('a').click();
            rootScope.$digest();

            var tds = table.find('td');
            expect($(tds[1]).scope().node).toBe("node2");
            expect($(tds[1]).scope().parentNode).toBe("node1");

        });

        it("should allow a promise to be returned from getNodes", inject(function($q) {
            simpleParams.getNodes = function(parent) {
                var deferred = $q.defer();
                deferred.resolve(["node1"]);
                return deferred.promise;
            }

            createCtrl(simpleParams);
            rootScope.$digest();

            expect(table.find('td')[0].innerText).toContain('node1');
        }));

        it("should allow the table to be refreshed", function() {
            simpleParams.getNodes = function(parent) { return ["node1"]; }

            createCtrl(simpleParams);
            rootScope.$digest();

            expect(table.find('td')[0].innerText).not.toContain('node2');

            simpleParams.getNodes = function(parent) { return ["node2"]; }
            simpleParams.refresh();

            rootScope.$digest();
            expect(table.find('td')[0].innerText).toContain('node2');
        });

        it("should allow templates to be loaded via templateCache", inject(function($templateCache) {
            simpleParams.getNodes = function(parent) { return ["node1"]; }
            simpleParams.getTemplate = function(node) { return '/path/to/some/template.html'; }

            $templateCache.put('/path/to/some/template.html', simpleTemplate);

            createCtrl(simpleParams);
            rootScope.$digest();

            expect(table.find('td')[0].innerText).toContain('node1');

        }));

        it("should allow templates to be loaded over HTTP", inject(function($httpBackend) {
            simpleParams.getNodes = function(parent) { return ["node1"]; }
            simpleParams.getTemplate = function(node) { return '/path/to/some/template.html'; }

            $httpBackend.expectGET('/path/to/some/template.html').respond(simpleTemplate);

            createCtrl(simpleParams);
            rootScope.$digest();
            $httpBackend.flush();

        }));

        it("should fully expand the table when initialState is 'expanded'", function() {
            simpleParams.options = {initialState: 'expanded'};
            simpleParams.getNodes = function(parent) {
                return parent == 'child' ? [] : (parent ? ['child'] : ['parent']);
            }

            createCtrl(simpleParams);
            rootScope.$digest();

            expect(table.find('td').length).toBe(2);

        });

    });


    describe('ttNode directive', function() {
        var $scope, compile;

        beforeEach(inject(function($rootScope, $compile) {
            $scope = $rootScope.$new();
            compile = $compile;
        }));

        it("should add treetable attributes", function() {
            var template = compile("<tr tt-node></tr>")($scope);
            $scope.$digest();
            expect(template.attr('data-tt-id')).toBeDefined();
        });

        it("should use is-branch attribute to determine whether a node can be expanded", function() {
            var template = compile('<tr tt-node is-branch="false"></tr>')($scope);
            $scope.$digest();
            expect(template.attr('data-tt-branch')).toBe('false');
        });

        it("should default is-branch to true", function() {
            var template = compile("<tr tt-node></tr>")($scope);
            $scope.$digest();
            expect(template.attr('data-tt-branch')).toBe('true');
        });

        it("should use parent attribute to specify a parent id", function() {
            var template = compile('<tr tt-node parent="1"></tr>')($scope);
            $scope.$digest();
            expect(template.attr('data-tt-parent-id')).toBe('1');
        });

        it("should discover parent automatically from parent scope", function() {
            $scope._ttParentId = "1";
            var template = compile('<tr tt-node></tr>')($scope.$new());
            $scope.$digest();
            expect(template.attr('data-tt-parent-id')).toBe('1');
        });

    });

});