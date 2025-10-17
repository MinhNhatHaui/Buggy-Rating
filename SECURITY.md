# Security Best Practices for Credentials

## 🔐 Overview
This project uses environment variables to securely manage credentials and avoid exposing sensitive information in source code.

## 📁 Environment Files

### File Structure:
```
env/
├── .env.template      # Template file (safe to commit)
├── .env.staging1      # Staging environment (DO NOT COMMIT)
├── .env.sit1          # SIT environment (DO NOT COMMIT)
└── .env.uat1          # UAT environment (DO NOT COMMIT)
```

## 🛡️ Security Measures

### 1. **Environment Variables**
All credentials are stored in `.env` files:
- `DEFAULT_USERNAME` - Default test user username
- `DEFAULT_PASSWORD` - Default test user password
- `ADMIN_USERNAME` - Admin user username
- `ADMIN_PASSWORD` - Admin user password

### 2. **Feature Files**
Feature files use placeholders instead of hardcoded credentials:
```gherkin
# ✅ GOOD - Uses environment variables
Given I am logged in with default credentials

# ❌ BAD - Hardcoded credentials (DO NOT USE)
Given I am logged in as "username" with password "password"
```

### 3. **Step Definitions**
Step definitions read from environment variables:
```typescript
const username = process.env.DEFAULT_USERNAME || 'fallback_user';
const password = process.env.DEFAULT_PASSWORD || 'fallback_pass';
```

## 🚀 Setup Instructions

### For Local Development:
1. Copy the template file:
   ```bash
   cp env/.env.template env/.env.staging1
   ```

2. Edit `env/.env.staging1` with your actual credentials

3. Never commit the actual `.env` files (they're in `.gitignore`)

### For GitHub Actions:
1. Go to your repository settings: `Settings > Secrets and variables > Actions`

2. Add repository secrets:
   - `DEFAULT_USERNAME`
   - `DEFAULT_PASSWORD`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

3. Update workflows to use secrets:
   ```yaml
   env:
     DEFAULT_USERNAME: ${{ secrets.DEFAULT_USERNAME }}
     DEFAULT_PASSWORD: ${{ secrets.DEFAULT_PASSWORD }}
   ```

## 📋 Additional Security Options

### Option 1: Azure Key Vault (Enterprise)
- Store secrets in Azure Key Vault
- Access via managed identities
- Best for production environments

### Option 2: AWS Secrets Manager
- Similar to Azure Key Vault
- Good for AWS-based infrastructure

### Option 3: HashiCorp Vault
- Open-source secret management
- Self-hosted option

### Option 4: GitHub Secrets (Current)
- Free tier available
- Built into GitHub Actions
- Good for CI/CD pipelines

## ⚠️ Important Notes

1. **Never commit actual credentials** to version control
2. **Use different credentials** for each environment
3. **Rotate credentials regularly** (every 90 days recommended)
4. **Use strong passwords** (minimum 12 characters, mixed case, numbers, symbols)
5. **Limit credential access** to only those who need it

## 🔍 Checking for Exposed Credentials

Run this command to check for hardcoded credentials:
```bash
git grep -i "password\|secret\|token" -- "*.feature" "*.ts" "*.js"
```

## 📝 Commit Checklist

Before committing, ensure:
- [ ] No hardcoded credentials in feature files
- [ ] No hardcoded credentials in step definitions
- [ ] `.env` files are in `.gitignore`
- [ ] Only `.env.template` is committed
- [ ] GitHub secrets are configured for CI/CD
