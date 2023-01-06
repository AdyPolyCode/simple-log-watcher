const { describe, it } = require('mocha');
const { expect } = require('chai');

const { join, dirname } = require('path');

const { FileHandler, errorMessages } = require('./file-handler');
const { existsSync } = require('fs');

// TODO: unit tests
describe("Validate 'FileHandler' methods", function () {
    describe('Verify positive test cases', function () {
        /**
         * _verifyPath
         */
        it('Should return true on valid path argument', function () {
            expect(FileHandler._verifyPath('.')).to.be.true;
        });

        /**
         * _verifyConfigPath
         * Config path file tests should be run regards to where file path exists
         * - uncomment which one needs to be tested
         */
        it('Should return valid path to config file if found in watcher root', function () {
            const watcherRoot = join(dirname(__dirname), 'watcher.config.js');

            expect(FileHandler._verifyConfigPath()).to.be.equal(watcherRoot);
        });

        // it('Should return valid path to config file if found in watcher parent root', function () {
        //     const watcherRoot = join(
        //         dirname(dirname(__dirname)),
        //         'watcher.config.js'
        //     );
        //     expect(FileHandler._verifyConfigPath()).to.be.equal(watcherRoot);
        // });

        /**
         * _getConfigFileProps
         */
        it('Should return config file properties', function () {
            const configFilePath = FileHandler._verifyConfigPath();
            const properties = FileHandler._getConfigFileProps(configFilePath);

            expect(typeof properties).to.be.equal('object');
            expect(properties).to.have.property('filename');
            expect(properties).to.have.property('path');
            expect(properties).property('filename', 'logs.txt');
            expect(properties).property('path', '../');
        });

        /**
         * _getFile
         */
        it('Should return file to watch', function () {
            const result = FileHandler._getFile();

            expect(typeof result).to.be.equal('object');
            expect(result).to.have.property('fileToWatch');
            expect(result).to.have.property('config');

            expect(existsSync(result.fileToWatch)).to.be.true;
            expect(result.config.filename).to.be.equal('logs.txt');
            expect(result.config.path).to.be.equal('../');
        });
    });

    /**
     * Run only when given false values else comment out
     */
    describe('Verify negative test cases', function () {
        /**
         * _verifyPath
         */
        it('Should throw error on invalid path type argument', function () {
            try {
                FileHandler._verifyPath(null);
            } catch (error) {
                expect(error.message).to.be.equal(
                    errorMessages._verifyPath.invalidArgumentType
                );
            }
        });

        // it('Should throw error if config file not found', function () {
        //     try {
        //         FileHandler._verifyConfigPath();
        //     } catch (error) {
        //         expect(error.message).to.be.equal(
        //             errorMessages._verifyConfigPath.noPath
        //         );
        //     }
        // });

        // it("Should throw error if config file 'filename' property does not exist", function () {
        //     const configFilePath = FileHandler._verifyConfigPath();

        //     try {
        //         expect(FileHandler._getConfigFileProps(configFilePath)).throw();
        //     } catch (error) {
        //         expect(error.message).to.be.equal(
        //             errorMessages._getConfigFileProps.noFilenameProperty
        //         );
        //     }
        // });

        // it("Should throw error if config file 'path' property does not exist", function () {
        //     const configFilePath = FileHandler._verifyConfigPath();

        //     try {
        //         expect(FileHandler._getConfigFileProps(configFilePath)).throw();
        //     } catch (error) {
        //         expect(error.message).to.be.equal(
        //             errorMessages._getConfigFileProps.noPathProperty
        //         );
        //     }
        // });
    });
});
