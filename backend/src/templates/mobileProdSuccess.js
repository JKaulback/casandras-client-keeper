function mobileProdSuccess(redirectUrl) {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Authentication Successful</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 2rem;
            backdrop-filter: blur(10px);
            max-width: 500px;
            width: 100%;
        }
        .icon { font-size: 64px; margin-bottom: 1rem; }
        h1 { margin: 0 0 1rem 0; font-size: 24px; }
        p { margin: 0.5rem 0; opacity: 0.9; }
        .button {
            display: inline-block;
            margin-top: 1rem;
            padding: 12px 24px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
        }
        .debug {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            font-size: 12px;
            word-break: break-all;
            max-height: 150px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✓</div>
        <h1>Authentication Successful!</h1>
        <p id="status">Redirecting to app...</p>
        <a href="${redirectUrl}" class="button" id="manualLink">Open App</a>
        <div class="debug">
            <p><strong>Redirect URL:</strong></p>
            <p>${redirectUrl}</p>
        </div>
    </div>
    <script>
        setTimeout(function() {
            window.location.href = '${redirectUrl}';
        }, 500);
        setTimeout(function() {
            document.getElementById('status').innerHTML = 'Click the button above to open the app.';
        }, 2000);
    </script>
</body>
</html>`;
}

module.exports = mobileProdSuccess;