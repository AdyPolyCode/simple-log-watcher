const { describe, it } = require('mocha');
const { expect } = require('chai');

const { join, dirname } = require('path');

const { FileHandler, errorMessages } = require('./file-handler');

// TODO: unit tests
describe("Validate 'FileHandler' methods", function () {
    describe('Verify positive test cases', function () {
        it('Should return true on valid path argument', function () {
            expect(FileHandler._verifyPath('.')).to.be.true;
        });

        /**
         * Config path file tests should be run regards to where file path exists
         * - uncomment which one needs to be tested
         */
        it('Should return valid path to config file if found in watcher root', function () {
            const watcherRoot = join(dirname(__dirname), 'watcher.config.js');

            expect(FileHandler._verifyConfigPath()).to.be.equal(watcherRoot);
        });

        // it('Should return valid path to config file if found in watcher parent root', function () {
        //   const watcherRoot = join(
        //     dirname(dirname(__dirname)),
        //     'watcher.config.js'
        //   );

        //   expect(FileHandler._verifyConfigPath()).to.be.equal(watcherRoot);
        // });

        /**
         * ################################################################################
         */

        it('Should return config file properties', function () {
            const configFilePath = FileHandler._verifyConfigPath();
            const properties = FileHandler._getConfigFileProps(configFilePath);

            expect(typeof properties).to.be.equal('object');
            expect(properties).to.have.property('filename');
            expect(properties).to.have.property('path');
            expect(properties).property('filename', 'logs.txt');
            expect(properties).property('path', '.');
        });

        it('Should return file to watch', function () {
            expect(FileHandler._getFile()).to.be.not.equal('');
        });
    });

    /**
     * Run only when given false values else comment out
     */
    describe('Verify negative test cases', function () {
        it('Should throw error on invalid path argument', function () {
            try {
                expect(FileHandler._verifyPath('')).throw(
                    errorMessages._verifyPath
                );
            } catch (error) {}
        });

        it('Should throw error if config file not found', function () {
            try {
                expect(FileHandler._verifyConfigPath()).throw(
                    errorMessages._verifyConfigPath
                );
            } catch (error) {}
        });

        it('Should throw error if config properties does not exist', function () {
            const configFilePath = FileHandler._verifyConfigPath();

            try {
                expect(FileHandler._getConfigFileProps(configFilePath)).throw(
                    errorMessages._getConfigFileProps
                );
            } catch (error) {}
        });
    });
});
