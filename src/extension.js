var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var vscode = require('vscode');
var _a = require("child_process"), spawn = _a.spawn, exec = _a.exec;
var fs = require('fs');
var exitcode;
var havepython = true;
function read_file(file_path) {
    return fs.readFileSync(file_path, 'utf8');
}
/**
 * ????????????????????????????????????????????????
 * @param {*} context ???????????????
 */
exports.activate = function (context) {
    return __awaiter(this, void 0, void 0, function () {
        var python;
        return __generator(this, function (_a) {
            console.log('??????????????????');
            python = spawn("python3", ["-V"]);
            python.on("close", function (code) { exitcode = code; });
            python.on('error', function (error) { havepython = false; });
            // havepython=read_file("~/tmp.zlcythontmp").includes("Python 3")
            // ????????????
            context.subscriptions.push(vscode.commands.registerCommand('extension.sayHello', function () {
                vscode.window.showInformationMessage('Hello World!');
            }));
            context.subscriptions.push(vscode.commands.registerCommand("zlcython.gen.exe", function () {
                // vscode.window.showInformationMessage("ready soon");
                // the real code
                if (havepython) {
                    vscode.window.showInformationMessage("????????????");
                    var codepath = vscode.window.activeTextEditor.document.fileName;
                    // const zlcythongenexe = spawn("python3", ["-m", "zlcython.install", "convert", codepath]);
                    var iswin_1 = false;
                    var a_1 = codepath.split("/");
                    if (a_1.length == 1) {
                        iswin_1 = true;
                        a_1 = codepath.split("\\");
                    }
                    a_1.pop();
                    exec("cd \"" + a_1.join("/") + "\" && python3 -m zlcython.install convert \"" + codepath + "\"", function (err, stdout, stderr) {
                        if (err) {
                            console.log(err);
                            console.log(stdout);
                            vscode.window.showInformationMessage("????????????");
                            vscode.window.showInformationMessage("????????????");
                            vscode.window.showInformationMessage("python3 -m zlcython.install install");
                        }
                        else {
                            if (iswin_1) {
                                exec("cd \"" + a_1.join("/") + "\" && rd /S /Q build dist", function (err, stdout, stderr) {
                                    if (err) {
                                        console.log(err);
                                        console.log(stdout);
                                        vscode.window.showInformationMessage("????????????");
                                    }
                                    else {
                                        vscode.window.showInformationMessage("????????????");
                                    }
                                });
                            }
                            else {
                                vscode.window.showInformationMessage("????????????");
                            }
                        }
                        console.log(stdout);
                    });
                }
                else {
                    vscode.window.showInformationMessage("?????????python3");
                }
            }));
            context.subscriptions.push(vscode.commands.registerCommand('zlcython.gen.code', function () {
                // the real code
                if (!havepython) {
                    vscode.window.showInformationMessage('Python3 is not installed\n\nPlease install Python3 first!');
                }
                else {
                    // set codepath to the current file
                    var codepath = vscode.window.activeTextEditor.document.fileName;
                    // console.log(codepath);
                    var zlcython = spawn("python3", ["-m", "zlcython", codepath]);
                    zlcython.on("close", function (code) {
                        if (code == 0) {
                            vscode.workspace.openTextDocument(codepath.replace(".zlcy", ".py")).then(function (document) {
                                vscode.window.showTextDocument(document, function (editor) {
                                    editor;
                                });
                            });
                            vscode.window.showInformationMessage('???????????????');
                        }
                        else {
                            var c12 = spawn("python3", ["-m", "zlcython"]);
                            c12.on("close", function (code) {
                                if (code == 0) { }
                                else {
                                    vscode.window.showInformationMessage('????????????zlcython');
                                    var c11 = spawn("python3", ["-m", "pip"]);
                                    c11.on("close", function (code) {
                                        if (code == 0) {
                                            var c2 = spawn("python3", ["-m", "pip", "install", "zlcython"]);
                                            c2.on("close", function (code) {
                                                if (code == 0) {
                                                    vscode.window.showInformationMessage('zlcython ?????????');
                                                }
                                                else {
                                                    vscode.window.showErrorMessage('zlcython ????????????');
                                                }
                                            });
                                            var c3 = spawn("python3", ["-m", "pip", "install", "opencc-python-reimplemented"]);
                                            c3.on("close", function (code) {
                                                if (code == 0) {
                                                    vscode.window.showInformationMessage('opencc ?????????');
                                                }
                                                else {
                                                    vscode.window.showErrorMessage('opencc ????????????');
                                                }
                                            });
                                        }
                                        else {
                                            vscode.window.showInformationMessage('???????????????pip');
                                        }
                                    });
                                }
                            });
                            vscode.window.showErrorMessage('?????????????????????\n\n????????????????????????');
                        }
                    });
                }
                // end
            }));
            return [2 /*return*/];
        });
    });
};
/**
 * ????????????????????????
 */
exports.deactivate = function () {
    console.log('???????????????');
};
