const vscode = require('vscode');

function activate(context) {
  console.log('Congratulations, your extension "vs-whiteboard" is now active!');

  let whiteboardPanel = vscode.window.createWebviewPanel(
    'whiteboard',
    'Whiteboard',
    vscode.ViewColumn.One,
    {}
  );

  whiteboardPanel.webview.html = getWebviewContent();

  let disposable = vscode.commands.registerCommand('vs-whiteboard.openWhiteboard', function () {
    whiteboardPanel.reveal(vscode.ViewColumn.One);
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}


function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Whiteboard</title>
      <style>
        html, body, #whiteboard {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background-color: white;
        }

        #toolbar {
          background-color: #f0f0f0;
          border-bottom: 1px solid #ddd;
          padding: 5px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        #toolbar button {
          margin: 0 5px;
          border: none;
          border-radius: 3px;
          padding: 5px 10px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        }

        #toolbar button.active {
          background-color: #ddd;
        }

        #whiteboard {
          cursor: crosshair;
        }
      </style>
    </head>
    <body>
      <div id="toolbar">
        <button id="pen" class="active">Pen</button>
        <button id="eraser">Eraser</button>
      </div>
      <canvas id="whiteboard"></canvas>
      <script>
		const canvas = document.getElementById('whiteboard');
	const context = canvas.getContext('2d');
	let isDrawing = false;
	let penActive = true;

	function draw(e) {
	if (!isDrawing) return;
	context.lineWidth = 5;
	context.lineCap = 'round';
	if (penActive) {
		context.strokeStyle = 'black';
	} else {
		context.strokeStyle = 'white';
	}
	context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
	context.stroke();
	context.beginPath();
	context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
	}

	canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	context.beginPath();
	context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
	});

	canvas.addEventListener('mousemove', draw);
	canvas.addEventListener('mouseup', () => isDrawing = false);
	canvas.addEventListener('mouseout', () => isDrawing = false);

	document.getElementById('pen').addEventListener('click', () => {
	penActive = true;
	document.getElementById('pen').classList.add('active');
	document.getElementById('eraser').classList.remove('active');
	});

	document.getElementById('eraser').addEventListener('click', () => {
	penActive = false;
	document.getElementById('eraser').classList.add('active');
	document.getElementById('pen').classList.remove('active');
	});

	let isDragging = false;
	let prevX = 0;
	let prevY = 0;

	canvas.addEventListener('mousedown', (e) => {
	if (!penActive) {
		isDragging = true;
		prevX = e.clientX;
		prevY = e.clientY;
	}
	});

	canvas.addEventListener('mousemove', (e) => {
	if (isDragging) {
		canvas.scrollLeft -= e.clientX - prevX;
		canvas.scrollTop -= e.clientY - prevY;
		prevX = e.clientX;
		prevY = e.clientY;
	}
	});

	canvas.addEventListener('mouseup', () => isDragging = false);
	canvas.addEventListener('mouseout', () => isDragging = false);
		
      </script>
    </body>
    </html>
  `;
}
module.exports = {
  activate,
  deactivate
};
