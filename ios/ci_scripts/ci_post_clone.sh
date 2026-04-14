#!/bin/sh
set -e

echo "=== Installing Node.js ==="
brew install node
NODE_PATH=$(which node)
echo "Node installed at: $NODE_PATH"

echo "=== Installing npm dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install

echo "=== Configuring .xcode.env for build phases ==="
cat > "$CI_PRIMARY_REPOSITORY_PATH/ios/.xcode.env" << EOF
export NODE_BINARY=$NODE_PATH
export NODE_ENV=production
EOF

echo "=== .xcode.env contents ==="
cat "$CI_PRIMARY_REPOSITORY_PATH/ios/.xcode.env"

echo "=== Running pod install to generate React Native Codegen files ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/ios"
pod install

echo "=== Done ==="
