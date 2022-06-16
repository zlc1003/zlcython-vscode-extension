var vscode = require('vscode');
const { spawn, exec } = require("child_process");
const fs = require('fs');
var exitcode
var havepython = true
function read_file(file_path) {
    return fs.readFileSync(file_path, 'utf8');
}
/**
 * 插件被激活时触发，所有代码总入口
 * @param {*} context 插件上下文
 */
exports.activate = async function (context) {
    console.log('扩展已被激活');
    const python = spawn("python3", ["-V"]);
    python.on("close", code => { exitcode = code });
    python.on('error', (error) => { havepython = false });
    // havepython=read_file("~/tmp.zlcythontmp").includes("Python 3")
    // 注册命令
    context.subscriptions.push(vscode.commands.registerCommand('extension.sayHello', function () {
        vscode.window.showInformationMessage('Hello World!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('zlcython.gen.code', function () {
        // the real code
        if (!havepython) {
            vscode.window.showInformationMessage('Python3 is not installed\n\nPlease install Python3 first!');
        } else {
            // set codepath to the current file
            var codepath = vscode.window.activeTextEditor.document.fileName;
            // console.log(codepath);
            const zlcython = spawn("python3", ["-m", "zlcython", codepath]);
            zlcython.on("close", code => {
                if (code == 0) {
                    vscode.workspace.openTextDocument(codepath.replace(".zlcy", ".py")).then(document => {
                        vscode.window.showTextDocument(document, editor => {
                            editor
                        });
                    })
                    vscode.window.showInformationMessage('Code generated successfully!');
                }
                else {
                    const c12 = spawn("python3", ["-m", "zlcython"]);
                    c12.on("close", code => {
                        if (code == 0) {}
                        else {
                            vscode.window.showInformationMessage('You did not install zlcython,installing zlcython now...');
                            const c11 = spawn("python3", ["-m", "pip"]);
                            c11.on("close", code => {
                                if (code == 0) {
                                    const c2 = spawn("python3", ["-m", "pip", "install", "zlcython"]);
                                    c2.on("close", code => {
                                        if (code == 0) {
                                            vscode.window.showInformationMessage('zlcython installed successfully!');
                                        }
                                        else {
                                            vscode.window.showErrorMessage('zlcython installed failed!');
                                        }
                                    });
                                    const c3 = spawn("python3", ["-m", "pip", "install", "opencc-python-reimplemented"]);
                                    c3.on("close", code => {
                                        if (code == 0) {
                                            vscode.window.showInformationMessage('poencc installed successfully!');
                                        }
                                        else {
                                            vscode.window.showErrorMessage('opencc installed failed!');
                                        }
                                    });
                                }
                                else {
                                    vscode.window.showInformationMessage('You did not install pip!');
                                }
                            });
                        }
                    });
                    vscode.window.showErrorMessage('Code generation failed!\n\nCheck your code.');
                }
            });
        }
        // end
    }));
};
/**
 * 插件被释放时触发
 */
exports.deactivate = function () {
    console.log('扩展被释放');
};
