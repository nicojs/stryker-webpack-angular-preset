import WebpackPreset from 'stryker-webpack/src/presetLoader/WebpackPreset'
import { TextFile, FileKind } from 'stryker-api/core';
import { Configuration } from 'webpack';
import webpackConfig from './webpackConfig';
import * as path from 'path';

export default class AngularWebpackPreset implements WebpackPreset {
  public getWebpackConfig(projectRoot: string): Configuration {
    return webpackConfig(projectRoot);
  }

  public getInitFiles(projectRoot: string): Array<TextFile> {
    return [
      this.createTextFile(path.join(projectRoot, 'stryker', 'helpers.js'), `
        var path = require('path');
        
        var _root = ${ projectRoot };
        
        function root(args) {
          args = Array.prototype.slice.call(arguments, 0);
          return path.join.apply(path, [_root].concat(args));
        }
        
        exports.root = root;
      `),
      this.createTextFile(path.join(projectRoot, 'stryker', 'karma-test-shim.js'), `
        Error.stackTraceLimit = Infinity;
        
        require('core-js/es6');
        require('core-js/es7/reflect');
        
        require('zone.js/dist/zone');
        require('zone.js/dist/long-stack-trace-zone');
        require('zone.js/dist/proxy');
        require('zone.js/dist/sync-test');
        require('zone.js/dist/jasmine-patch');
        require('zone.js/dist/async-test');
        require('zone.js/dist/fake-async-test');
        
        var appContext = require.context('${ path.join(projectRoot, 'src') }', true, /\.spec\.ts/);
        
        appContext.keys().forEach(appContext);
        
        var testing = require('@angular/core/testing');
        var browser = require('@angular/platform-browser-dynamic/testing');
        
        testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
      `),
      this.createTextFile(path.join(projectRoot, 'stryker', 'karma.conf.js'), `
        module.exports = function (config) {
          var _config = {
            basePath: '',
        
            frameworks: ['jasmine'],
        
            files: [],
        
            reporters: [],
            port: 9876,
            colors: true,
            logLevel: config.LOG_INFO,
            autoWatch: false,
            browsers: ['PhantomJS'],
            singleRun: true
          };
        
          config.set(_config);
        };
      `),
      this.createTextFile(path.join(projectRoot, 'stryker', 'vendor.ts'), `
        // Angular
        import '@angular/platform-browser';
        import '@angular/platform-browser-dynamic';
        import '@angular/core';
        import '@angular/common';
        import '@angular/http';
        import '@angular/router';
        
        // RxJS
        import 'rxjs';
      `)
    ];
  }

  private createTextFile(name, content): TextFile {
    return {
      name: name,
      content: content,
      kind: FileKind.Text,
      mutated: false,
      transpiled: true,
      included: false
    };
  }
}