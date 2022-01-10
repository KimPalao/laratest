// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let lastCommand: string;

// this method is called when your extension is activated 
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.commands.registerCommand('laratest.runFileTests', async () => {
    lastCommand = vscode.window.activeTextEditor?.document.fileName ?? '';
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
        new vscode.ShellExecution(`php artisan test ${lastCommand}`),
        '$laratest'
      )];
    },
    resolveTask: () => {
      return undefined;
    }
  }));

}

// this method is called when your extension is deactivated
export function deactivate() { }
