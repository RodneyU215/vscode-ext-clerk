import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'helloWorld',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'reactPanel',
        'React Panel',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'dist')),
          ],
        }
      );

      // Convert the file path to a VS Code webview URI
      const reactAppUri = panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, 'dist', 'webview.js')
        )
      );

      panel.webview.html = getWebviewContent(reactAppUri);
    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(reactAppUri: vscode.Uri) {
  const nonce = getNonce();

  return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React in VSCode</title>
        </head>
        <body>
            <div id="root"></div>
            <script nonce="${nonce}" src="${reactAppUri}"></script>
        </body>
        </html>`;
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  return text;
}

export function deactivate() {}
