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
export NODE_OPTIONS=--max-old-space-size=8192
export HERMES_CLI_PATH=$CI_PRIMARY_REPOSITORY_PATH/node_modules/hermes-compiler/hermesc/osx-bin/hermesc
EOF

echo "=== .xcode.env contents ==="
cat "$CI_PRIMARY_REPOSITORY_PATH/ios/.xcode.env"

echo "=== Running pod install to generate React Native Codegen files ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/ios"
pod install

echo "=== Fixing HERMES_CLI_PATH in xcconfig files ==="
HERMES_PATH="$CI_PRIMARY_REPOSITORY_PATH/node_modules/hermes-compiler/hermesc/osx-bin/hermesc"
sed -i '' "s|HERMES_CLI_PATH = .*|HERMES_CLI_PATH = $HERMES_PATH|g" \
  Pods/Target\ Support\ Files/Pods-LzyLearnKorean/Pods-LzyLearnKorean.release.xcconfig \
  Pods/Target\ Support\ Files/Pods-LzyLearnKorean/Pods-LzyLearnKorean.debug.xcconfig

echo "=== Done ==="
