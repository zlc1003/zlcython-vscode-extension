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
exports.activate = async function (context: any) {
    console.log('扩展已被激活');
    const python = spawn("python3", ["-V"]);
    python.on("close", code => { exitcode = code });
    python.on('error', (error) => { havepython = false });
    // havepython=read_file("~/tmp.zlcythontmp").includes("Python 3")
    // 注册命令
    context.subscriptions.push(vscode.commands.registerCommand('extension.sayHello', function () {
        vscode.window.showInformationMessage('Hello World!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand("zlcython.gen.exe", function () {
        // vscode.window.showInformationMessage("ready soon");
        // the real code
        if (havepython) {
            vscode.window.showInformationMessage("开始生成");
            var codepath = vscode.window.activeTextEditor.document.fileName;
            // const zlcythongenexe = spawn("python3", ["-m", "zlcython.install", "convert", codepath]);
            let iswin = false
            let a = codepath.split("/")
            if (a.length == 1) {
                iswin = true
                a = codepath.split("\\")
            }
            a.pop()
            exec("cd \"" + a.join("/") + "\" && python3 -m zlcython.install convert \"" + codepath + "\"", (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    console.log(stdout);
                    vscode.window.showInformationMessage("生成失败");
                    vscode.window.showInformationMessage("请尝试：");
                    vscode.window.showInformationMessage("python3 -m zlcython.install install")
                } else {
                    if (iswin) {
                        exec("cd \"" + a.join("/") + "\" && rd /S /Q build dist", (err, stdout, stderr) => {
                            if (err) {
                                console.log(err);
                                console.log(stdout);
                                vscode.window.showInformationMessage("生成成功");
                            } else {
                                vscode.window.showInformationMessage("生成成功");
                            }
                        })
                    }
                    else {
                        vscode.window.showInformationMessage("生成成功");
                    }
                }
                console.log(stdout);
            })
        }
        else {
            vscode.window.showInformationMessage("请安装python3");
        }
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
                    vscode.window.showInformationMessage('代码已生成');
                }
                else {
                    const c12 = spawn("python3", ["-m", "zlcython"]);
                    c12.on("close", code => {
                        if (code == 0) { }
                        else {
                            vscode.window.showInformationMessage('正在安装zlcython');
                            const c11 = spawn("python3", ["-m", "pip"]);
                            c11.on("close", code => {
                                if (code == 0) {
                                    const c2 = spawn("python3", ["-m", "pip", "install", "zlcython"]);
                                    c2.on("close", code => {
                                        if (code == 0) {
                                            vscode.window.showInformationMessage('zlcython 已安装');
                                        }
                                        else {
                                            vscode.window.showErrorMessage('zlcython 安装失败');
                                        }
                                    });
                                    const c3 = spawn("python3", ["-m", "pip", "install", "opencc-python-reimplemented"]);
                                    c3.on("close", code => {
                                        if (code == 0) {
                                            vscode.window.showInformationMessage('opencc 已安装');
                                        }
                                        else {
                                            vscode.window.showErrorMessage('opencc 安装失败');
                                        }
                                    });
                                }
                                else {
                                    vscode.window.showInformationMessage('你没有安装pip');
                                }
                            });
                        }
                    });
                    vscode.window.showErrorMessage('带码生成失败！\n\n请检查你的代码。');
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
