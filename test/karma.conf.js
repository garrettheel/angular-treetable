module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'misc/test-lib/jquery.min.js',
            'misc/test-lib/jquery.treetable.js',
            'misc/test-lib/angular.min.js',
            'misc/test-lib/angular-mocks.js',
            'test/**/*.spec.js',
            'src/**/*.js'
        ],
        exclude: [],
        browsers: ['PhantomJS'], //, 'Chrome'],
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            //'karma-chrome-launcher'
        ],
        autoWatch: false,
        singleRun: false
    });
}
