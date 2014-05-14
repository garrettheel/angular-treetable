module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n' +
                    ' * <%= pkg.name %>\n' +
                    ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    ' * @link <%= pkg.homepage %>\n' +
                    ' * @author <%= pkg.author.name %> (<%= pkg.author.email %>)\n' +
                    ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
                    ' */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};