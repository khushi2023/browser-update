# browser-update

## I have used a javascript library 'detect-browser' to detect the current version of chrome browser.

## Then to get the latest version of chrome available , i have used an api of `https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Linux&num=1`. This api contains the all the chrome versions present till date.

## When the chrome version of browser (currentVersion) (using userAgent-string)  is older than latest available version (latestVersion). Show a popup to "Update".

## When user has downloaded the latest chrome but not relaunched, so check using terminal and run the command using execSync() js method that run the command directly in terminal and gives the output. (machineVersion)

## If machineVersion is greater than currentVersion , show a popup of Relaunch Chrome.

## For relaunching, system will create a bash file as per os, and it runt he script in terminal to kill all the processes and open a restart a new tab.
