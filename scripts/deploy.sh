#!/bin/bash

echo ""
echo "🚀 GMS Deployment Script"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    echo "   Download from: https://git-scm.com/download/win"
    exit 1
fi

# Initialize Git if needed
if [ ! -d .git ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "GMS ready for production deployment"
fi

echo "📤 Ready to push to GitHub"
echo ""
echo "Steps:"
echo "1. Create a GitHub account at github.com"
echo "2. Create a new repository called 'GMS'"
echo "3. Copy the repository URL (should look like: https://github.com/YOUR_USERNAME/GMS.git)"
echo "4. Run this command:"
echo "   git remote add origin <YOUR_REPO_URL>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "After pushing to GitHub:"
echo "5. Go to railway.app"
echo "6. Click 'New Project'"
echo "7. Select 'Deploy from GitHub repo'"
echo "8. Choose 'GMS' repository"
echo "9. Follow the Railway guide in RAILWAY_DEPLOYMENT_GUIDE.md"
echo ""
