module.exports = (grunt) ->
    'use strict'

    # Project configuration.
    grunt.initConfig
        watch:
            coffee:
                tasks: ['coffee:compile']
                files: [
                    'spec/*.coffee'
                ]

            buildRunner:
                tasks: ['jasmine:src:build']
                files: [
                    'spec/*.js'
                ]

        coffee:
            compile:
                options:
                    bare: true
                expand: true
                src: 'spec/*.coffee'
                dest: '.'
                ext: '.js'

        jasmine:
            test:
                src: 'promiser.js'
                options:
                    keepRunner: true
                    outfile: 'spec-runner.html'
                    specs: 'spec/*.js'
                    vendor: 'vendor/*.js'


    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-jasmine'

    grunt.registerTask 'default', ['coffee', 'watch']
    grunt.registerTask 'test', ['coffee:compile', 'jasmine:test']
