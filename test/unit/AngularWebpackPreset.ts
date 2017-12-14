import { createKarmaTestShim, createVendorTs  } from '../helpers/producers';
import AngularWebpackPreset from "../../src/AngularWebpackPreset";
import * as sinon from 'sinon';
import { expect, assert } from 'chai';
import * as webpackConfig from '../../src/webpackConfig';

describe('AngularWebpackPreset', () => {
  let angularWebpackPreset: AngularWebpackPreset;
  let sandbox: sinon.SinonSandbox;
  let webpackConfigStub: sinon.SinonStub;

  const projectRoot = '/';

  beforeEach(() => {
    sandbox = sinon.sandbox.create();

    webpackConfigStub = sandbox.stub(webpackConfig, 'default');

    angularWebpackPreset = new AngularWebpackPreset;
  });

  afterEach(() => sandbox.restore());

  it('should return the karma test shim file when getInitFiles is called', () => {
    const initFiles = angularWebpackPreset.getInitFiles(projectRoot);

    for(let initFile of initFiles) {
      initFile.content = initFile.content.replace(/\s/g, '');
    }

    expect(initFiles).to.deep.include(createKarmaTestShim(projectRoot));
  });

  it('should return the vendor ts file when getInitFiles is called', () => {
    const initFiles = angularWebpackPreset.getInitFiles(projectRoot);

    for(let initFile of initFiles) {
      initFile.content = initFile.content.replace(/\s/g, '');
    }

    expect(initFiles).to.deep.include(createVendorTs(projectRoot));
  });

  it('should call the webpackConfig method when the getWebpackConfig method is called', () => {
    angularWebpackPreset.getWebpackConfig(projectRoot);

    assert(webpackConfigStub.calledWith(projectRoot), 'getWebpackConfig method not called with projectRoot');
  });
});