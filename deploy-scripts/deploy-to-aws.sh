#!/bin/bash

# AWS Amplify Deployment Script for AI Support Dashboard
set -e

echo "🚀 Starting AWS deployment for AI Support Dashboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    print_error "Serverless Framework is not installed. Installing..."
    npm install -g serverless
fi

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    print_error "Amplify CLI is not installed. Installing..."
    npm install -g @aws-amplify/cli
fi

# Verify AWS credentials
print_status "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure'"
    exit 1
fi

print_success "AWS credentials verified"

# Set deployment stage
STAGE=${1:-dev}
print_status "Deploying to stage: $STAGE"

# Deploy Backend (Lambda + API Gateway)
print_status "Deploying backend services..."
cd server

# Install dependencies
print_status "Installing server dependencies..."
npm install

# Build the application
print_status "Building server application..."
npm run build

# Deploy with Serverless
print_status "Deploying Lambda functions..."
if [ "$STAGE" = "prod" ]; then
    serverless deploy --stage prod
else
    serverless deploy --stage dev
fi

# Get the API Gateway URL
API_URL=$(serverless info --stage $STAGE --verbose | grep ServiceEndpoint | awk '{print $2}')
print_success "Backend deployed successfully!"
print_status "API Gateway URL: $API_URL"

# Return to root directory
cd ..

# Deploy Frontend (Amplify)
print_status "Preparing frontend deployment..."
cd client

# Install dependencies
print_status "Installing client dependencies..."
npm install

# Create production environment file with API URL
print_status "Creating production environment configuration..."
cat > .env.production << EOF
VITE_API_BASE_URL=${API_URL}/api
VITE_APP_NAME=AI Support Dashboard
VITE_APP_VERSION=1.0.0
VITE_ENABLE_SENTIMENT_ANALYSIS=true
VITE_ENABLE_KNOWLEDGE_SEARCH=true
VITE_ENABLE_RESPONSE_SCORING=true
VITE_ENABLE_ANALYTICS=true
VITE_NODE_ENV=production
EOF

print_success "Environment configuration created"

# Build the application
print_status "Building React application..."
npm run build

print_success "Frontend build completed"

# Return to root directory
cd ..

print_success "🎉 Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. Configure your Amplify app in the AWS Console"
echo "2. Connect your GitHub repository"
echo "3. Set the following environment variables in Amplify:"
echo "   - VITE_API_BASE_URL=${API_URL}/api"
echo "   - VITE_ENABLE_SENTIMENT_ANALYSIS=true"
echo "   - VITE_ENABLE_KNOWLEDGE_SEARCH=true"
echo "   - VITE_ENABLE_RESPONSE_SCORING=true"
echo "   - VITE_ENABLE_ANALYTICS=true"
echo ""
echo "Backend API URL: $API_URL"
echo "Backend deployed to stage: $STAGE"