#!/bin/bash

# NexusCore Solutions - Project Setup Script
# Creates the full folder and minimal placeholder file structure

set -e  # Exit on any error

PROJECT_ROOT="nexuscore-solutions"

echo "🚀 Creating NexusCore Solutions project structure..."

# Create root directory
mkdir -p "$PROJECT_ROOT"

# ======================
# CLIENT (React Frontend)
# ======================
CLIENT="$PROJECT_ROOT/client"
mkdir -p "$CLIENT/public/assets"
mkdir -p "$CLIENT/src/components/common"
mkdir -p "$CLIENT/src/components/home"
mkdir -p "$CLIENT/src/components/projects"
mkdir -p "$CLIENT/src/components/admin/forms"
mkdir -p "$CLIENT/src/pages/admin/manage"
mkdir -p "$CLIENT/src/hooks"
mkdir -p "$CLIENT/src/context"
mkdir -p "$CLIENT/src/utils"
mkdir -p "$CLIENT/src/types"
mkdir -p "$CLIENT/src/styles"

# Create placeholder files in client
touch "$CLIENT/public/index.html"
touch "$CLIENT/src/components/common/Navbar.tsx"
touch "$CLIENT/src/components/common/Footer.tsx"
touch "$CLIENT/src/components/common/Button.tsx"
touch "$CLIENT/src/components/common/Card.tsx"
touch "$CLIENT/src/components/common/Loader.tsx"
touch "$CLIENT/src/components/home/Hero.tsx"
touch "$CLIENT/src/components/home/FeaturedProjects.tsx"
touch "$CLIENT/src/components/home/ValueProposition.tsx"
touch "$CLIENT/src/components/projects/ProjectCard.tsx"
touch "$CLIENT/src/components/projects/ProjectFilter.tsx"
touch "$CLIENT/src/components/projects/ProjectGallery.tsx"
touch "$CLIENT/src/components/admin/Sidebar.tsx"
touch "$CLIENT/src/components/admin/Dashboard.tsx"
touch "$CLIENT/src/components/admin/forms/.gitkeep"
touch "$CLIENT/src/pages/Home.tsx"
touch "$CLIENT/src/pages/Services.tsx"
touch "$CLIENT/src/pages/Projects.tsx"
touch "$CLIENT/src/pages/CaseStudies.tsx"
touch "$CLIENT/src/pages/Resources.tsx"
touch "$CLIENT/src/pages/About.tsx"
touch "$CLIENT/src/pages/Achievements.tsx"
touch "$CLIENT/src/pages/Contact.tsx"
touch "$CLIENT/src/pages/admin/Login.tsx"
touch "$CLIENT/src/pages/admin/AdminDashboard.tsx"
touch "$CLIENT/src/pages/admin/manage/.gitkeep"
touch "$CLIENT/src/hooks/useAuth.ts"
touch "$CLIENT/src/hooks/useApi.ts"
touch "$CLIENT/src/hooks/useTheme.ts"
touch "$CLIENT/src/context/AuthContext.tsx"
touch "$CLIENT/src/context/ThemeContext.tsx"
touch "$CLIENT/src/utils/api.ts"
touch "$CLIENT/src/utils/validation.ts"
touch "$CLIENT/src/utils/constants.ts"
touch "$CLIENT/src/types/index.ts"
touch "$CLIENT/src/styles/globals.css"
touch "$CLIENT/src/App.tsx"
touch "$CLIENT/src/main.tsx"
touch "$CLIENT/src/vite-env.d.ts"
touch "$CLIENT/package.json"
touch "$CLIENT/tsconfig.json"
touch "$CLIENT/vite.config.ts"
touch "$CLIENT/.env.example"

# ======================
# SERVER (Node.js Backend)
# ======================
SERVER="$PROJECT_ROOT/server"
mkdir -p "$SERVER/src/config"
mkdir -p "$SERVER/src/models"
mkdir -p "$SERVER/src/routes"
mkdir -p "$SERVER/src/controllers"
mkdir -p "$SERVER/src/middleware"
mkdir -p "$SERVER/src/utils"

# Create placeholder files in server
touch "$SERVER/src/config/db.js"
touch "$SERVER/src/config/email.js"
touch "$SERVER/src/config/cloudinary.js"
touch "$SERVER/src/models/User.js"
touch "$SERVER/src/models/Service.js"
touch "$SERVER/src/models/Project.js"
touch "$SERVER/src/models/CaseStudy.js"
touch "$SERVER/src/models/Whitepaper.js"
touch "$SERVER/src/models/TeamMember.js"
touch "$SERVER/src/models/Achievement.js"
touch "$SERVER/src/models/ContactMessage.js"
touch "$SERVER/src/models/NewsletterSubscriber.js"
touch "$SERVER/src/routes/auth.js"
touch "$SERVER/src/routes/services.js"
touch "$SERVER/src/routes/projects.js"
touch "$SERVER/src/routes/caseStudies.js"
touch "$SERVER/src/routes/whitepapers.js"
touch "$SERVER/src/routes/team.js"
touch "$SERVER/src/routes/achievements.js"
touch "$SERVER/src/routes/contact.js"
touch "$SERVER/src/routes/newsletter.js"
touch "$SERVER/src/controllers/authController.js"
touch "$SERVER/src/controllers/projectController.js"
touch "$SERVER/src/controllers/.gitkeep"  # for other controllers
touch "$SERVER/src/middleware/auth.js"
touch "$SERVER/src/middleware/validation.js"
touch "$SERVER/src/middleware/rateLimit.js"
touch "$SERVER/src/middleware/errorHandler.js"
touch "$SERVER/src/utils/sendEmail.js"
touch "$SERVER/src/utils/fileUpload.js"
touch "$SERVER/src/utils/csvExport.js"
touch "$SERVER/src/server.js"
mkdir -p "$SERVER/uploads"
touch "$SERVER/package.json"
touch "$SERVER/.env.example"

# ======================
# ROOT FILES
# ======================
touch "$PROJECT_ROOT/.gitignore"
touch "$PROJECT_ROOT/README.md"

echo "✅ Project structure created successfully at ./$PROJECT_ROOT"
echo "💡 Tip: Run 'cd $PROJECT_ROOT' to get started!"