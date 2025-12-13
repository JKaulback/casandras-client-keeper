function mobileDevSuccess(userEmail) {
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
        p { margin: 0.5rem 0; opacity: 0.9; line-height: 1.5; }
        .email {
            margin-top: 1rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">✓</div>
        <h1>Authentication Successful!</h1>
        <p><strong>You can now close this window</strong></p>
        <p style="font-size: 14px; margin-top: 1rem;">Return to the app and sign in again. Your authentication is ready.</p>
        <div class="email">
            ${userEmail}
        </div>
    </div>
    <script>
        setTimeout(function() {
            window.close();
        }, 3000);
    </script>
</body>
</html>`;
}

module.exports = mobileDevSuccess;