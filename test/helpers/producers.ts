import * as path from 'path';
import { FileKind, TextFile } from 'stryker-api/core';

export const createVendorTs = (projectRoot: string) => createTextFile(path.join(projectRoot, '.stryker-tmp', 'stryker-webpack-angular-preset', 'vendor.ts'), `
  // Angular
  import '@angular/platform-browser';
  import '@angular/platform-browser-dynamic';
  import '@angular/core';
  import '@angular/common';
  import '@angular/http';
  import '@angular/router';

  // RxJS
  import 'rxjs';
`.replace(/\s/g, ''));

export const createKarmaTestShim = (projectRoot: string) => createTextFile(path.join(projectRoot, '.stryker-tmp', 'stryker-webpack-angular-preset', 'karma-test-shim.js'), `
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

  var appContext = require.context('${ path.join(projectRoot, 'src')}', true, /\.spec\.ts/);

  appContext.keys().forEach(appContext);

  var testing = require('@angular/core/testing');
  var browser = require('@angular/platform-browser-dynamic/testing');

  testing.TestBed.initTestEnvironment(browser.BrowserDynamicTestingModule, browser.platformBrowserDynamicTesting());
`.replace(/\s/g, ''));

function createTextFile(name: string, content: string): TextFile {
  return {
    name: name,
    content: content,
    kind: FileKind.Text,
    mutated: false,
    transpiled: true,
    included: false
  };
};