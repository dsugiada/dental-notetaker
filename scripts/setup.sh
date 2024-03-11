#!/bin/bash

clear
echo "MERN-SEED Setup"
echo ""
echo "1. Installing dependencies on backend, frontend, root"
echo "2. Configure env variables on backend, frontend, root"
echo ""

prepare() {
  rm -rf ./scripts/log
  mkdir -p ./scripts/log
  mkdir -p ./backend/.env
}

askDepsInstall() {
  echo ""
  read -rp "1. Install dependencies using 'npm install'? [Y/n] " depsResponse
  depsResponse=${depsResponse:l} # tolower
  if [[ $depsResponse =~ ^(y| ) ]] || [[ -z $depsResponse ]]; then
    depsInstall
  else
    echo "Dependencies not installed!"
  fi
}

depsInstall() {
  echo ""
  echo "Installing backend dependencies... (~1m)"
  (cd backend/ && npm install) &>./scripts/log/backend.setup.log
  echo "Done"
  echo ""
  echo "Installing frontend dependencies... (~5m)"
  (cd frontend/ && npm install) &>./scripts/log/frontend.setup.log
  echo "Done"
  echo ""
  echo "Installing root dependencies... (~1m)"
  npm install &>./scripts/log/root.setup.log
  echo "Done"
}

askEnvConfig() {
  echo ""
  read -rp "2. Configure env variables? [Y/n] " envResponse
  envResponse=${envResponse:l} # tolower
  if [[ $envResponse =~ ^(y| ) ]] || [[ -z $envResponse ]]; then
    envConfig
  else
    echo "Env variables not configured!"
  fi
}

# The rest of the functions (envConfig, envConfigSsl, envConfigJwt, etc.)
# remain unchanged as they do not involve package manager commands.

start() {
  prepare
  askDepsInstall
  askEnvConfig
}

read -rp "Press any key to start!"
start
