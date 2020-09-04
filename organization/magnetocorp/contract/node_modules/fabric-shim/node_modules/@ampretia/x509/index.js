/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let x509 = require('./build/Release/x509');
let fs = require('fs');

exports.version = x509.version;


exports.verify = function (certPath, CABundlePath, cb) {
    if (!certPath) {
        throw new TypeError('Certificate path is required');
    }
    if (!CABundlePath) {
        throw new TypeError('CA Bundle path is required');
    }

    fs.stat(certPath, function (certPathErr) {

        if (certPathErr) {
            return cb(certPathErr);
        }


        fs.stat(CABundlePath, function (bundlePathErr) {

            if (bundlePathErr) {
                return cb(bundlePathErr);
            }

            try {
                x509.verify(certPath, CABundlePath);
                cb(null);
            }
            catch (verificationError) {
                cb(verificationError);
            }
        });
    });
};


exports.parseCert = function (path) {

    let ret = x509.parseCert(path).exports;
    let exts = {};
    for (let key in ret.extensions) {
        let newkey = key.replace('X509v3', '').replace(/ /g, '');
        newkey = newkey.slice(0, 1).toLowerCase() + newkey.slice(1);
        exts[newkey] = ret.extensions[key].replace('DirName: C','DirName:C');
    }
    delete ret.extensions;
    ret.extensions = exts;

    // ensure dates are correct
    ret.notBefore = ret.notBefore.toISOString();
    ret.notAfter = ret.notAfter.toISOString();

    return ret;
};

exports.getSubject = function (path) {
    let ret = x509.parseCert(path).exports;

    let subject = ret.subject;

    return subject;
};

exports.getAltNames = function (path) {
    let ret = x509.parseCert(path).exports;

    let altNames = ret.altNames;

    return altNames;
};

exports.getIssuer = function (path) {
    let ret = x509.parseCert(path).exports;

    let altNames = ret.issuer;

    return altNames;
};