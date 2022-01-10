// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import TestCodeLensProvider from './providers/TestCodeLensProvider';

let lastCommand: string;
let useDusk = false;

// this method is called when your extension is activated 
// your extension is activated the very first time the command is executed

function isDuskTest(fileName: string) {
  return fileName.includes('tests/Browser');
}

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.commands.registerCommand('laratest.run', async (methodName?: string, runClass?: boolean) => {
    console.log('laratest', methodName, runClass);
    lastCommand = vscode.window.activeTextEditor?.document.fileName ?? '';
    useDusk = isDuskTest(lastCommand);
    if (methodName && !runClass) {
      lastCommand += ` --filter ${methodName}`;
    }
    await vscode.commands.executeCommand('workbench.action.terminal.clear');
    await vscode.commands.executeCommand('workbench.action.tasks.runTask', `laratest: run`);
  }));

  context.subscriptions.push(vscode.commands.registerCommand('laratest.runFileTests', async () => {
    lastCommand = vscode.window.activeTextEditor?.document.fileName ?? '';
    useDusk = isDuskTest(lastCommand);
    await vscode.commands.executeCommand('workbench.action.terminal.clear');
    await vscode.commands.executeCommand('workbench.action.tasks.runTask', `laratest: run`);
  }));

  context.subscriptions.push(vscode.tasks.registerTaskProvider('laratest', {
    provideTasks: () => {
      return [new vscode.Task(
        { type: 'laratest', task: 'run' },
        vscode.TaskScope.Workspace,
        'run',
        'laratest',
        new vscode.ShellExecution(`php artisan ${useDusk ? 'dusk' : 'test'} ${lastCommand}`),
        '$laratest'
      )];
    },
    resolveTask: () => {
      return undefined;
    }
  }));

  context.subscriptions.push(vscode.languages.registerCodeLensProvider({
    language: 'php',
    scheme: 'file'
  }, new TestCodeLensProvider));

}

// this method is called when your extension is deactivated
export function deactivate() { }
