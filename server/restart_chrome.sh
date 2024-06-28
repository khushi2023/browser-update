
  #!/bin/bash
  pkill chrome
  if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    google-chrome &>/dev/null &
  else
    open -a "Google Chrome" &>/dev/null &
  fi
