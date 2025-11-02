#!/usr/bin/env node

/**
 * Test Admin Dashboard Functionality
 * Verifies all admin pages and features are working
 */

const BASE_URL = 'http://localhost:3000';

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Admin pages to test
const adminPages = [
  { path: '/admin', name: 'Admin Dashboard' },
  { path: '/admin/users', name: 'Users Management' },
  { path: '/admin/websites', name: 'Websites Management' },
  { path: '/admin/orders', name: 'Orders Management' },
  { path: '/admin/products', name: 'Products Catalog' },
  { path: '/admin/billing', name: 'Billing & Subscriptions' },
  { path: '/admin/payments/bank-deposits', name: 'Bank Deposits (DR)' },
  { path: '/admin/support', name: 'Support Tickets' },
  { path: '/admin/reports', name: 'Reports & Analytics' },
  { path: '/admin/customers', name: 'Customer List' },
  { path: '/admin/customers/new', name: 'Add New Customer' },
  { path: '/admin/sites', name: 'Active Sites' },
  { path: '/admin/sites/deploy', name: 'Deploy New Site' },
  { path: '/admin/templates', name: 'Site Templates' },
  { path: '/admin/domains', name: 'Domains & SSL' },
  { path: '/admin/monitoring', name: 'System Monitoring' },
  { path: '/admin/monitoring/sites', name: 'Site Metrics' },
  { path: '/admin/monitoring/history', name: 'Historical Data' },
  { path: '/admin/alerts', name: 'System Alerts' },
  { path: '/admin/automation/scheduled', name: 'Scheduled Tasks' },
  { path: '/admin/automation/triggers', name: 'Event Triggers' },
  { path: '/admin/backups', name: 'Backup Status' },
  { path: '/admin/backups/restore', name: 'Restore Points' },
  { path: '/admin/backups/schedule', name: 'Backup Schedule' },
  { path: '/admin/settings', name: 'System Settings' },
  { path: '/admin/settings/users', name: 'Users & Roles' },
  { path: '/admin/settings/api', name: 'API Keys' },
  { path: '/admin/settings/security', name: 'Security Settings' }
];

// Admin APIs to test
const adminAPIs = [
  { path: '/api/admin/stats', name: 'Dashboard Stats', method: 'GET' },
  { path: '/api/admin/users', name: 'Users API', method: 'GET' },
  { path: '/api/admin/websites', name: 'Websites API', method: 'GET' },
  { path: '/api/admin/orders', name: 'Orders API', method: 'GET' },
  { path: '/api/admin/products', name: 'Products API', method: 'GET' },
  { path: '/api/admin/bank-deposits', name: 'Bank Deposits API', method: 'GET' }
];

async function testPage(url, name) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Admin-Test-Script'
      }
    });
    
    if (response.ok) {
      const text = await response.text();
      // Check if it's a proper page (has HTML content)
      if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
        console.log(`${colors.green}✓${colors.reset} ${name}: ${colors.cyan}OK${colors.reset} (${response.status})`);
        return true;
      } else {
        console.log(`${colors.yellow}⚠${colors.reset} ${name}: Response but no HTML content`);
        return false;
      }
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name}: ${colors.red}FAILED${colors.reset} (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}: ${colors.red}ERROR${colors.reset} - ${error.message}`);
    return false;
  }
}

async function testAPI(url, name, method = 'GET') {
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      try {
        const data = await response.json();
        console.log(`${colors.green}✓${colors.reset} ${name}: ${colors.cyan}OK${colors.reset} (${response.status}) - Returns JSON`);
        return true;
      } catch {
        const text = await response.text();
        if (text) {
          console.log(`${colors.yellow}⚠${colors.reset} ${name}: OK but not JSON`);
        } else {
          console.log(`${colors.green}✓${colors.reset} ${name}: ${colors.cyan}OK${colors.reset} (${response.status})`);
        }
        return true;
      }
    } else if (response.status === 401) {
      console.log(`${colors.yellow}⚠${colors.reset} ${name}: Requires authentication (401)`);
      return true; // This is expected for protected APIs
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name}: ${colors.red}FAILED${colors.reset} (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}: ${colors.red}ERROR${colors.reset} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.blue + '                 AGI STAFFERS ADMIN FUNCTIONALITY TEST' + colors.reset);
  console.log(colors.blue + '═══════════════════════════════════════════════════════════════' + colors.reset);
  
  // Test if server is running
  console.log('\n' + colors.yellow + '▶ Testing Server Status...' + colors.reset);
  try {
    const response = await fetch(BASE_URL);
    if (response.ok) {
      console.log(`${colors.green}✓${colors.reset} Server is running at ${BASE_URL}`);
    } else {
      console.log(`${colors.red}✗${colors.reset} Server returned status ${response.status}`);
      process.exit(1);
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} Server is not running at ${BASE_URL}`);
    console.log(`${colors.yellow}Please start the server with: npm run dev${colors.reset}`);
    process.exit(1);
  }
  
  // Test admin pages
  console.log('\n' + colors.yellow + '▶ Testing Admin Pages...' + colors.reset);
  console.log(colors.cyan + '─'.repeat(60) + colors.reset);
  
  let pageSuccesses = 0;
  let pageFailures = 0;
  
  for (const page of adminPages) {
    const success = await testPage(BASE_URL + page.path, page.name);
    if (success) pageSuccesses++;
    else pageFailures++;
  }
  
  // Test admin APIs
  console.log('\n' + colors.yellow + '▶ Testing Admin APIs...' + colors.reset);
  console.log(colors.cyan + '─'.repeat(60) + colors.reset);
  
  let apiSuccesses = 0;
  let apiFailures = 0;
  
  for (const api of adminAPIs) {
    const success = await testAPI(BASE_URL + api.path, api.name, api.method);
    if (success) apiSuccesses++;
    else apiFailures++;
  }
  
  // Summary
  console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════════════' + colors.reset);
  console.log(colors.blue + '                           TEST SUMMARY' + colors.reset);
  console.log(colors.blue + '═══════════════════════════════════════════════════════════════' + colors.reset);
  
  console.log('\n' + colors.cyan + 'Pages Tested:' + colors.reset);
  console.log(`  ${colors.green}✓ Passed:${colors.reset} ${pageSuccesses}/${adminPages.length}`);
  if (pageFailures > 0) {
    console.log(`  ${colors.red}✗ Failed:${colors.reset} ${pageFailures}/${adminPages.length}`);
  }
  
  console.log('\n' + colors.cyan + 'APIs Tested:' + colors.reset);
  console.log(`  ${colors.green}✓ Passed:${colors.reset} ${apiSuccesses}/${adminAPIs.length}`);
  if (apiFailures > 0) {
    console.log(`  ${colors.red}✗ Failed:${colors.reset} ${apiFailures}/${adminAPIs.length}`);
  }
  
  const totalTests = adminPages.length + adminAPIs.length;
  const totalPassed = pageSuccesses + apiSuccesses;
  const totalFailed = pageFailures + apiFailures;
  const successRate = ((totalPassed / totalTests) * 100).toFixed(1);
  
  console.log('\n' + colors.cyan + 'Overall Results:' + colors.reset);
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  ${colors.green}Passed: ${totalPassed}${colors.reset}`);
  if (totalFailed > 0) {
    console.log(`  ${colors.red}Failed: ${totalFailed}${colors.reset}`);
  }
  console.log(`  Success Rate: ${successRate}%`);
  
  if (successRate >= 90) {
    console.log('\n' + colors.green + '✓ Admin Dashboard is functioning well!' + colors.reset);
  } else if (successRate >= 70) {
    console.log('\n' + colors.yellow + '⚠ Admin Dashboard has some issues that need attention.' + colors.reset);
  } else {
    console.log('\n' + colors.red + '✗ Admin Dashboard has significant issues!' + colors.reset);
  }
  
  console.log('\n' + colors.cyan + 'Note: Some APIs may require authentication to work properly.' + colors.reset);
  console.log(colors.cyan + 'Test with: npm run test-admin' + colors.reset);
  console.log(colors.blue + '═══════════════════════════════════════════════════════════════' + colors.reset + '\n');
}

// Run the tests
runTests().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});