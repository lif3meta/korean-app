#!/bin/sh
set -e

echo "=== Installing Node.js ==="
NODE_VERSION="22.15.0"
curl -fsSL "https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-darwin-arm64.tar.xz" | tar -xJ -C /tmp
export PATH="/tmp/node-v${NODE_VERSION}-darwin-arm64/bin:$PATH"
NODE_PATH=$(which node)
echo "Node installed at: $NODE_PATH (v$(node --version))"

echo "=== Installing npm dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm ci

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
