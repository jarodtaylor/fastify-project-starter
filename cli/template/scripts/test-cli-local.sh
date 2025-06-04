#!/bin/bash
set -e

# CLI Local Testing Script
# This script tests CLI generation locally with comprehensive validation
# Run this before committing CLI changes

echo "🧪 CLI Local Testing Suite"
echo "========================="

# Configuration
TEST_DIR="/tmp/cli-test-$(date +%s)"
CLI_DIR="$(pwd)/cli"
ORIGINAL_DIR="$(pwd)"

cleanup() {
    echo "🧹 Cleaning up..."
    cd "$ORIGINAL_DIR"
    rm -rf "$TEST_DIR"
}
trap cleanup EXIT

# Build CLI
echo "🏗️  Building CLI..."
cd "$CLI_DIR"
pnpm install
pnpm build

# Test CLI help and version
echo "📋 Testing CLI commands..."
node dist/index.js --help > /dev/null
node dist/index.js --version > /dev/null

# Create test directory
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

# Test scenarios
test_scenarios=(
    "default:--no-git"
    "postgres:--db postgres --no-git"
    "eslint:--lint eslint --no-git"
    "no-install:--no-install --no-git"
)

for scenario in "${test_scenarios[@]}"; do
    IFS=':' read -r name flags <<< "$scenario"
    echo ""
    echo "🚀 Testing scenario: $name ($flags)"
    
    project_name="test-$name"
    
    # Generate project
    echo "   Generating project..."
    node "$CLI_DIR/dist/index.js" "$project_name" $flags
    
    if [ ! -d "$project_name" ]; then
        echo "❌ Project directory not created"
        exit 1
    fi
    
    cd "$project_name"
    
    # Validate structure
    echo "   Validating structure..."
    required_files=(
        "package.json"
        "apps/api/package.json"
        "apps/web/package.json"
        "packages/database/package.json"
        "data/.gitkeep"
        ".env"
        ".env.example"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo "❌ Missing required file: $file"
            exit 1
        fi
    done
    
    # Validate variable replacement (exclude scripts and test directories)
    echo "   Validating variable replacement..."
    template_var_pattern="{{PROJECT_NAME}}"
    found_files=$(find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.md" \) \
       ! -path "./node_modules/*" \
       ! -path "./scripts/*" \
       ! -name "*test*" \
       -exec grep -l "$template_var_pattern" {} \; 2>/dev/null)
    
    if [ -n "$found_files" ]; then
        echo "❌ Found unreplaced template variables in source files:"
        echo "$found_files"
        exit 1
    fi
    
    # Test dependencies if installed
    if [ "$name" != "no-install" ]; then
        echo "   Testing dependencies..."
        if [ ! -d "node_modules" ]; then
            echo "❌ Dependencies not installed"
            exit 1
        fi
        
        # Core functionality tests (skip formatting check for generated projects)
        echo "   Running core validation tests..."
        pnpm typecheck > /dev/null
        pnpm build > /dev/null
        
        echo "   Testing database..."
        if [ -f "packages/database/prisma/schema.prisma" ]; then
            cd packages/database
            if ! pnpm prisma validate > /dev/null 2>&1; then
                echo "❌ Prisma schema validation failed"
                exit 1
            fi
            cd ../..
        fi
    fi
    
    cd ..
    echo "✅ Scenario $name passed"
done

echo ""
echo "🎉 All CLI tests passed!"
echo ""
echo "💡 To test a specific scenario manually:"
echo "   ./scripts/test-cli-local.sh"
echo ""
echo "🚀 To test the generated project:"
echo "   cd $TEST_DIR/test-default"
echo "   pnpm dev" 