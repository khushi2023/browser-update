// const express = require('express')
// const fs = require('fs');
// const cors = require('cors')
// // import cors from "cors";


// const app=express();
// app.use(cors());

// // app.use(relaunchChrome.get('/relaunch',installed));
// app.get('/relaunch-chrome',(req,res)=>{
//     const installed = chromePaths.some(path => checkFileExists(path));
//     res.status(200).json({installed});
// })
// function checkFileExists(filePath) {
//     try {
//         fs.accessSync(filePath, fs.constants.F_OK);
//         return true;
//     } catch (err) {
//         return false;
//     }
// }

// // Example usage

// const chromePaths = [
//     'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',  // Windows 64-bit
//     'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',        // Windows 32-bit
//     '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',     // macOS
//     '/usr/bin/google-chrome',                                            // Linux
//     '/usr/bin/google-chrome-stable'                                      // Linux
// ];

// app.listen(3000, ()=>{
//     console.log(`Server is running on port 3000`);
// });

const express = require('express');
const fs = require('fs');
const { execSync, exec, spawn } = require('child_process');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
const platform = process.platform;

const chromePaths = {
  win64: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  mac: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome'
};
//function to relaunch the browser usinh .sh/.bat file
function relaunchChrome() {
  console.log("Khushi");
  console.log(platform);
  if (platform === 'win32') {
    createAndExecuteWindowsScript();
  } else if (platform === 'linux') {
    createAndExecuteUnixScript();
  }
}
function createAndExecuteWindowsScript(){
    const batScript = `
    @echo off
    taskkill /IM node.exe /F
    taskkill /IM ng.exe /F
    timeout /t 5 /nobreak
    start chrome.exe
    `;

      fs.writeFile('restart_chrome.bat', batScript, (err) => {
        if (err) {
          return console.error(`Error creating .bat file: ${err}`);
        }
        console.log('Created restart_chrome.bat');
        exec('restart_chrome.bat', (err, stdout, stderr) => {
          if (err) {
            return console.error(`Error executing .bat file: ${err}`);
          }
          console.log(stdout);
          console.error(stderr);
        });
      });
}

function createAndExecuteUnixScript() {
  console.log("hello");
  const shScript = `
  #!/bin/bash
  pkill chrome
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    google-chrome &>/dev/null &
  else
    open -a "Google Chrome" &>/dev/null &
  fi
`;

  fs.writeFile('restart_chrome.sh', shScript,{ mode:0o755},(err) => {
    if (err) {
      return console.error(`Error creating .sh file: ${err}`);
    }
    console.log('Created restart_chrome.sh');
    // exec('chmod +x restart_chrome.sh', (err, stdout, stderr) => {
    //   if (err) {
    //     return console.error(`Error executing .sh file: ${err}`);
    //   }
    //   console.log(stdout);
    //   console.error(stderr);
    // });
    // exec('bash restart_chrome.sh', {detached: true, stdio: 'ignore'},(err, stdout, stderr) => {
    //   if (err) {
    //     return console.error(`Error executing .sh file: ${err}`);
    //   }
    //   console.log(stdout);
    //   console.error(stderr);
    // }).unref();
    // fs.chmod('restart_chrome.sh', 0o755, (err) => {
    //   if (err) {
    //     return console.error(`Error making script executable: ${err}`);
    //   }

      // Spawn a detached child process to run the script
      const child = spawn('bash', ['restart_chrome.sh'], {
        detached: true,
        stdio: 'ignore'
      });

      child.unref(); // Detach the child process from the parent
    // });
  });
}

// function to detect the latest chrome version present in machine
function getChromeVersion() {
  try {
    let versionCommand;

    if (platform === 'win32') {
      // Windows
      versionCommand = `reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version`;
      const versionOutput = execSync(versionCommand).toString();
      const versionMatch = versionOutput.match(/version\s+REG_SZ\s+([^\s]+)/);
      return versionMatch ? versionMatch[1] : 'Unknown version';
    } else if (platform === 'darwin') {
      // macOS
      const plistPath = '/Applications/Google Chrome.app/Contents/Info.plist';
      versionCommand = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "${plistPath}"`;
      const version = execSync(versionCommand).toString().trim();
      return version;
    } else if (platform === 'linux') {
      // Linux
      versionCommand = 'google-chrome --version';
      const versionOutput = execSync(versionCommand).toString();
      const versionMatch = versionOutput.match(/Google Chrome ([^\s]+)/);
      return versionMatch ? versionMatch[1] : 'Unknown version';
    } else {
      return 'Unsupported platform';
    }
  } catch (error) {
    console.error('Error checking Chrome version:', error);
    return 'Error checking version';
  }
}

app.get('/detect-chrome', (req, res) => {
  console.log("cfdfcd");
  const installed = Object.values(chromePaths).some(path => checkFileExists(path));
  const version = installed ? getChromeVersion() : 'Chrome not installed';
  res.status(200).json({ installed, version });
});


app.post('/relaunch-chrome', (req, res) => {
    relaunchChrome();
    res.status(200).json({ message: 'Relaunching Chrome' });
})

function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
