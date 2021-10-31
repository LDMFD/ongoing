.vscode/launch.json entry:

{
    "name": "Word Desktop (Edge Chromium)",
    "type": "edge",
    "request": "attach",
    "useWebView": "advanced",
    "port": 9229,
    "timeout": 600000,
    "webRoot": "${workspaceRoot}",
    "preLaunchTask": "Debug: Word Desktop",
    "postDebugTask": "Stop Debug"
  },
