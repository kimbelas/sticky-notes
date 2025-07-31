module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:security/recommended'
  ],
  plugins: ['security'],
  rules: {
    // Security-focused rules
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-non-literal-fs-filename': 'warn',
    'security/detect-eval-with-expression': 'error',
    'security/detect-pseudoRandomBytes': 'error',
    'security/detect-possible-timing-attacks': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-bidi-characters': 'error',
    
    // Additional security best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-useless-concat': 'error',
    
    // Prevent dangerous patterns
    'no-console': 'warn', // Logs might expose sensitive info
    'no-debugger': 'error',
    'no-alert': 'error',
    
    // Strict equality to prevent type coercion attacks
    'eqeqeq': ['error', 'always'],
    
    // Require use of Error objects as Promise rejection reasons
    'prefer-promise-reject-errors': 'error',
    
    // Prevent potential XSS in React
    'react/no-danger': 'error',
    'react/no-danger-with-children': 'error',
    
    // Prevent accidental exposure of sensitive data
    'no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }]
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  overrides: [
    {
      // More strict rules for API routes
      files: ['pages/api/**/*.{js,ts}', 'app/api/**/*.{js,ts}'],
      rules: {
        'security/detect-non-literal-fs-filename': 'error',
        'security/detect-child-process': 'error',
        'no-console': 'error' // No console logs in production API
      }
    },
    {
      // Relaxed rules for test files
      files: ['**/*.test.{js,ts,jsx,tsx}', '**/*.spec.{js,ts,jsx,tsx}', '__tests__/**/*'],
      rules: {
        'security/detect-object-injection': 'warn',
        'no-console': 'off'
      }
    }
  ]
};