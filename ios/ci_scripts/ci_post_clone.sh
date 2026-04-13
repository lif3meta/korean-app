#!/bin/sh
set -e

echo "Installing Node.js..."
brew install node

echo "Installing CocoaPods..."
brew install cocoapods

echo "Installing npm dependencies..."
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

echo "Running pod install..."
cd "$CI_PRIMARY_REPOSITORY_PATH/ios"
pod install
