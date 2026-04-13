#!/bin/sh
set -e

# Set environment for Expo build phase scripts
export NODE_ENV=production

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

# Ensure NODE_ENV is available during xcodebuild
echo "export NODE_ENV=production" >> "$CI_PRIMARY_REPOSITORY_PATH/ios/.xcode.env"

# Set NODE_BINARY to the brew-installed node for build phases
echo "export NODE_BINARY=$(which node)" >> "$CI_PRIMARY_REPOSITORY_PATH/ios/.xcode.env"
