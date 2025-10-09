#!/bin/bash
sset +e

echo "Checking PCI-DSS Compliance Requirements..."

ERRORS=0
WARNINGS=0

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print results
print_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((ERRORS++))
}

print_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    ((WARNINGS++))
}

echo ""
echo "2. Checking Authentication & Access Control..."
echo "----------------------------------------------"

# Check for authentication implementation
if grep -rq "authentication\|authenticate\|passport\|jwt\|bcrypt\|password" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Authentication mechanisms detected"
else
    print_fail "No authentication mechanisms found"
fi

# Check for authorization/access control
if grep -rq "authorization\|authorize\|role\|permission\|rbac" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Authorization/access control detected"
else
    print_warn "Authorization mechanisms not clearly defined"
fi


echo ""
echo "3. Checking Logging & Monitoring..."
echo "-----------------------------------"

# Check for logging configuration
if grep -rq "winston\|morgan\|bunyan\|pino\|log4js\|console.log" --include="*.js" --include="*.ts" . 2>/dev/null || \
   [ -f "logging-config.json" ] || [ -f "logger.js" ] || [ -f "logger.ts" ]; then
    print_pass "Logging implementation found"
else
    print_fail "No logging configuration detected"
fi

# Check for audit trail
if grep -rq "audit\|auditLog\|activity.*log" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Audit trail implementation detected"
else
    print_warn "Audit trail not clearly implemented"
fi

echo ""
echo "4. Checking Data Protection..."
echo "------------------------------"

# Check for encryption
if grep -rq "encrypt\|crypto\|cipher\|bcrypt\|hash" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Encryption/hashing utilities found"
else
    print_fail "No encryption mechanisms detected"
fi

# Check for password hashing
if grep -rq "bcrypt\|scrypt\|argon2\|pbkdf2" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Password hashing implementation found"
else
    print_warn "Strong password hashing not clearly implemented"
fi

# Check for sensitive data handling
if grep -rq "creditCard\|cardNumber\|cvv\|pan\|cardholder" --include="*.js" --include="*.ts" . 2>/dev/null; then
    if grep -rq "mask\|redact\|sanitize\|tokenize" --include="*.js" --include="*.ts" . 2>/dev/null; then
        print_pass "Credit card data handling with masking/sanitization detected"
    else
        print_warn "Credit card data detected - ensure proper masking/tokenization"
    fi
fi

echo ""
echo "5. Checking Environment & Secrets Management..."
echo "-----------------------------------------------"

# Check for .env.example
if [ -f ".env.example" ] || [ -f ".env.sample" ]; then
    print_pass "Environment variable template found"
else
    print_warn "No .env.example file found"
fi

# Check that .env is gitignored
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        print_pass ".env file is properly gitignored"
    else
        print_fail ".env file should be in .gitignore"
    fi
else
    print_fail ".gitignore file missing"
fi

# Check for hardcoded secrets (basic check)
if grep -rE "(password|secret|key|token).*=.*['\"][^'\"]{8,}['\"]" --include="*.js" --include="*.ts" . 2>/dev/null | grep -v "node_modules" | grep -v "test" | grep -v "example"; then
    print_warn "Potential hardcoded secrets detected - review manually"
else
    print_pass "No obvious hardcoded secrets detected"
fi

echo ""
echo "6. Checking Input Validation & SQL Injection Prevention..."
echo "----------------------------------------------------------"

# Check for input validation
if grep -rq "validator\|joi\|yup\|express-validator\|sanitize" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Input validation libraries detected"
else
    print_warn "Input validation not clearly implemented"
fi

# Check for parameterized queries (SQL injection prevention)
if grep -rq "prepared.*statement\|parameterized\|sequelize\|mongoose\|prisma\|typeorm" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "ORM or parameterized query usage detected"
else
    print_warn "Ensure parameterized queries are used to prevent SQL injection"
fi

echo ""
echo "7. Checking Network Security..."
echo "-------------------------------"

# Check for CORS configuration
if grep -rq "cors" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "CORS configuration found"
else
    print_warn "CORS configuration not detected"
fi

# Check for rate limiting
if grep -rq "rate.*limit\|express-rate-limit\|rate-limiter" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Rate limiting implementation detected"
else
    print_warn "Rate limiting not clearly implemented"
fi

# Check for helmet (security headers)
if grep -rq "helmet" --include="*.js" --include="*.ts" . 2>/dev/null; then
    print_pass "Helmet.js (security headers) detected"
else
    print_warn "Helmet.js not detected - consider adding security headers"
fi

echo ""
echo "8. Checking Session Management..."
echo "---------------------------------"

# Check for secure session handling
if grep -rq "express-session\|cookie-session\|session" --include="*.js" --include="*.ts" . 2>/dev/null; then
    if grep -rq "secure.*true\|httpOnly.*true" --include="*.js" --include="*.ts" . 2>/dev/null; then
        print_pass "Secure session configuration detected"
    else
        print_warn "Session management found but secure flags not clearly set"
    fi
else
    print_warn "Session management not detected"
fi

echo ""
echo "================================================"
echo "PCI-DSS Compliance Check Summary"
echo "================================================"
echo -e "Checks Passed: ${GREEN}$(($(find . -type f \( -name "*.js" -o -name "*.ts" \) | wc -l) - ERRORS - WARNINGS))${NC}"
echo -e "Warnings: ${YELLOW}${WARNINGS}${NC}"
echo -e "Failures: ${RED}${ERRORS}${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ PCI-DSS Compliance check FAILED${NC}"
    echo "Please address the failures above before proceeding to production."
    exit 1
elif [ $WARNINGS -gt 3 ]; then
    echo -e "${YELLOW}⚠️  PCI-DSS Compliance check passed with warnings${NC}"
    echo "Consider addressing warnings to improve security posture."
    exit 0
else
    echo -e "${GREEN}✅ PCI-DSS Compliance check PASSED${NC}"
    echo "Basic compliance requirements are met."
    exit 0
fi




