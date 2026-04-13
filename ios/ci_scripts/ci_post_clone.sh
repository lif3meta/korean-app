#!/bin/sh
set -e

echo "Installing CocoaPods..."
brew install cocoapods

echo "Running pod install..."
cd "$CI_PRIMARY_REPOSITORY_PATH/ios"
pod install
