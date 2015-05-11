module.exports = function(grunt) {

  "use strict";
  
  require("jit-grunt")(grunt);

  grunt.initConfig({
    
    connect : {
      static : {
        options : {
          port : 8000,
          hostname : "*",
          base : "build"
        }
      }
    },
    
    karma : {
      build : {
        configFile : "karma.conf.js"
      }
    },
    
    clean : {
      documentation : ["documentation"]
    },
    
    webpack : {
      options : {
        module: {
          loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader'
            },
            {
              test: /\.json$/,
              exclude: /node_modules/,
              loader: 'json-loader'
            }
          ]
        }
      },
      build : {
        entry: "./src/js/app.js",
        output: {
          path: "build/",
          filename: "app.js",
        },
        stats: {
          colors: true,
          modules: false,
          reasons: true
        },
        progress: false,
        watch: false,
        keepalive: false
      }
    },

    uglify : {
      options : {
        mangle : true,
        compress : true,
        screwIE8 : true,
        report : "gzip"
      },
      build : {
        files : {
          "build/app.min.js" : ["build/app.js"]
        }
      }
    },
    
    copy : {
      build : {
        files : [
          {expand: true, cwd: "src/html/", src: ["**"], dest: "build/"},
          {expand: true, cwd: "src/images/", src: ["**"], dest: "build/images/"},
          {expand: true, cwd: "src/fonts/", src: ["**"], dest: "build/fonts/"}
        ]
      }
    },
    
    stylus: {
      build: {
        options: {
          compress : false,
          use: [
            function() {
              return require("autoprefixer-stylus")({
                browsers : ["last 2 versions", "ie 9"]
              });
            }
          ]
        },
        files: {
          "build/app.css": "src/styl/app.styl"
        }
      }
    },
    
    csso: {
      build: {
        options: {
          report: "gzip"
        },
        files: {
          "build/app.min.css": ["build/app.css"]
        }
      }
    },
    
    copy : {
      images : {
        files : [
          {expand: true, cwd: "assets/images/", src: ["**"], dest: "build/images/"}
        ]
      },
      fonts : {
        files : [
          {expand: true, cwd: "assets/fonts/", src: ["**"], dest: "build/fonts/"}
        ]
      }
    },
    
    karma : {
      dev : {
        configFile : 'karma.conf.js'
      }
    },

    watch: {
      options : {
        livereload : {
          port : 3857
        },
        files: ["build/**"],
      },
      html : {
        files : ["src/html/**"],
        tasks : ["copy:html"]
      },
      images : {
        files : ["src/images/**"],
        tasks : ["copy:images"]
      },
      fonts : {
        files : ["src/fonts/**"],
        tasks : ["copy:fonts"]
      },
      stylesheets : {
        files : ["src/styl/**"],
        tasks : ["stylus"]
      },
      scripts : {
        files : ["src/js/**"],
        tasks : ["webpack:build"]
      }
    }

  });
  
  grunt.registerTask("test", ["karma:dev"]);
  grunt.registerTask("default", ["connect:static", "copy:html", "copy:images", "copy:fonts", "stylus", "webpack", "watch"]);
  grunt.registerTask("make", ["copy:images", "copy:html", "copy:fonts", "stylus", "csso", "webpack", "uglify"]);

};