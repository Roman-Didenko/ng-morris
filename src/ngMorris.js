'use strict';

angular.module('ngMorris', [])
.directive('barChart', [function () {
    return {
        restrict: 'A',
        scope: {
            x: '@barX',
            y: '@barY',
            labels: '@labels',
            barData: '=',
            barColors: '@'
        },
        link: function (scope, elem, attrs) {

            function createChartIfNotExists() {
                if (scope.objBar)
                    return false;

                scope.objBar = new Morris.Bar({
                    element: elem,
                    data: scope.barData,
                    xkey: scope.x,
                    ykeys: scope.y ? angular.fromJson(scope.y) : [],
                    labels: scope.labels ? angular.fromJson(scope.labels) : null,
                    xLabelMargin: 2,
                    stacked: true,
                    hideHover: true,
                    barColors: angular.fromJson(scope.barColors),
                    numLines: 5
                });

                return true;
            }

            function tryRedraw() {
                if(scope.objBar && scope.objBar.xkey && scope.objBar.ykeys.length)
                    scope.objBar.redraw();
            }

            scope.$watch('y', function (newValue, oldValue) {
                if (newValue || newValue !== oldValue)
                    if (!createChartIfNotExists()) {
                        scope.objBar.options.ykeys = scope.y ? angular.fromJson(scope.y) : [];
                        tryRedraw();
                    }
            });

            scope.$watch('x', function (newValue, oldValue) {
                if (newValue || newValue !== oldValue)
                    if (!createChartIfNotExists()) {
                        scope.objBar.options.xkey = scope.x;
                        tryRedraw();
                    }
            });

            scope.$watch('labels', function (newValue, oldValue) {
                if (newValue || newValue !== oldValue)
                    if (!createChartIfNotExists()) {
                        scope.objBar.options.labels = scope.labels ? angular.fromJson(scope.labels): null;
                        tryRedraw();
                    }
            });

            scope.$watch('barData', function (newValue, oldValue) {
                if (newValue || newValue !== oldValue)
                    if (!createChartIfNotExists())
                        scope.objBar.setData(scope.barData);
            });
        }
    }
}])
.directive('donutChart', function () {
    return {
        restrict: 'A',
        scope: {
            donutData: '='
        },
        link: function (scope, elem, attrs) {
            scope.$watch('donutData', function () {
                if (scope.donutData) {
                    if (!scope.objDonut) {
                        scope.objDonut = new Morris.Donut({
                            element: elem,
                            data: scope.donutData
                        });
                    } else {
                        scope.objDonut.setData(scope.donutData);
                    }
                }
            });
        }
    }
})
.directive('lineChart', function () {

    return {
        restrict: 'A',
        scope: {
            lineData: '=',
            lineXkey: '@',
            lineYkeys: '@',
            lineLabels: '@',
            lineColors: '@'
        },
        link: function (scope, elem, attrs) {
            var colors;
            if (scope.lineColors === void 0 || scope.lineColors === '') {
                colors = null;
            } else {
                colors = JSON.parse(scope.lineColors);
            }
            scope.$watch('lineData', function () {
                if (scope.lineData) {
                    if (!scope.morris) {
                        scope.morris = new Morris.Line({
                            element: elem,
                            data: scope.lineData,
                            xkey: scope.lineXkey,
                            ykeys: JSON.parse(scope.lineYkeys),
                            labels: JSON.parse(scope.lineLabels),
                            lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed']
                        });
                    } else {
                        scope.morris.setData(scope.lineData);
                    }
                }
            });
        }
    }
});
