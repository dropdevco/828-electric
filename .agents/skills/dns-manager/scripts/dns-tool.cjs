#!/usr/bin/env node

/**
 * dns-tool.cjs - Porkbun & Vercel DNS Automation Tool
 * Coordinates DNS record creation on Porkbun to match Vercel hosting requirements.
 */

const fs = require('fs');
const path = require('path');

// 1. Load environment variables
function loadEnv() {
  const envPaths = [
    path.join(process.cwd(), '.env.dns.local'),
    path.join(process.cwd(), '.env.dns'),
    path.join(__dirname, '../.env.dns.local'),
    path.join(__dirname, '../../../.env.dns.local')
  ];

  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          let val = match[2].trim();
          // Strip surrounding quotes
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key] = val;
        }
      });
      console.log(`[Config] Loaded environment from: ${p}`);
      return true;
    }
  }
  return false;
}

loadEnv();

const PORKBUN_API_KEY = process.env.PORKBUN_API_KEY;
const PORKBUN_SECRET_KEY = process.env.PORKBUN_SECRET_KEY;
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

// 2. HTTP Request Helpers
async function porkbunRequest(endpoint, data = {}) {
  if (!PORKBUN_API_KEY || !PORKBUN_SECRET_KEY) {
    throw new Error("Missing Porkbun API Key or Secret Key. Please configure PORKBUN_API_KEY and PORKBUN_SECRET_KEY in `.env.dns.local`.");
  }
  if (PORKBUN_SECRET_KEY === "YOUR_PORKBUN_SECRET_KEY_HERE") {
    throw new Error("Porkbun Secret Key is still set to the placeholder value. Update PORKBUN_SECRET_KEY in `.env.dns.local`.");
  }

  const url = `https://api.porkbun.com/api/json/v3${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apikey: PORKBUN_API_KEY,
      secretapikey: PORKBUN_SECRET_KEY,
      ...data
    })
  });

  const resData = await response.json();
  if (resData.status === 'ERROR') {
    throw new Error(resData.message || `Porkbun error on endpoint ${endpoint}`);
  }
  return resData;
}

async function vercelRequest(method, endpoint, body = null) {
  if (!VERCEL_API_TOKEN) {
    throw new Error("Missing Vercel API Token. Please configure VERCEL_API_TOKEN in `.env.dns.local`.");
  }
  if (VERCEL_API_TOKEN === "YOUR_VERCEL_API_TOKEN_HERE") {
    throw new Error("Vercel API Token is still set to the placeholder value. Update VERCEL_API_TOKEN in `.env.dns.local`.");
  }

  let url = `https://api.vercel.com${endpoint}`;
  if (VERCEL_TEAM_ID) {
    url += (url.includes('?') ? '&' : '?') + `teamId=${VERCEL_TEAM_ID}`;
  }

  const headers = {
    'Authorization': `Bearer ${VERCEL_API_TOKEN}`,
    'Content-Type': 'application/json'
  };

  const options = { method, headers };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const resData = await response.json();
  if (resData.error) {
    throw new Error(resData.error.message || `Vercel error on ${method} ${endpoint}`);
  }
  return resData;
}

// 3. DNS Helpers
function getSubdomainName(fqdn, domain) {
  if (fqdn === domain) return '';
  if (fqdn.endsWith('.' + domain)) {
    return fqdn.slice(0, -(domain.length + 1));
  }
  return fqdn; // Fallback
}

async function upsertDnsRecord(domain, type, name, content, ttl = '600') {
  console.log(`[Porkbun] Checking if ${type} record for '${name || '@'}' exists...`);
  
  const retrieveData = await porkbunRequest(`/dns/retrieve/${domain}`);
  const targetFqdn = name ? `${name}.${domain}` : domain;
  
  const existing = retrieveData.records.find(r => 
    r.type === type && 
    r.name.toLowerCase() === targetFqdn.toLowerCase()
  );

  if (existing) {
    if (existing.content === content) {
      console.log(`[Porkbun] record already matches: ${type} ${targetFqdn} -> ${content} (ID: ${existing.id}). Skipping.`);
      return { status: 'NO_OP', id: existing.id };
    } else {
      console.log(`[Porkbun] Updating existing record (ID: ${existing.id}): ${type} ${targetFqdn} -> ${content} (previously: ${existing.content})`);
      await porkbunRequest(`/dns/edit/${domain}/${existing.id}`, {
        name,
        type,
        content,
        ttl
      });
      return { status: 'UPDATED', id: existing.id };
    }
  } else {
    console.log(`[Porkbun] Creating new record: ${type} ${targetFqdn} -> ${content}`);
    const result = await porkbunRequest(`/dns/create/${domain}`, {
      name,
      type,
      content,
      ttl
    });
    return { status: 'CREATED', id: result.id };
  }
}

// 4. Commands
async function cmdTestCredentials() {
  console.log("=== Testing API Credentials ===");
  
  // Test Porkbun
  try {
    const pkTest = await porkbunRequest('/ping');
    console.log(`✅ Porkbun API authenticated successfully! Client IP: ${pkTest.yourIp}`);
  } catch (err) {
    console.error(`❌ Porkbun API error: ${err.message}`);
  }

  // Test Vercel
  try {
    if (!VERCEL_PROJECT_ID) {
      console.log("⚠️ VERCEL_PROJECT_ID is not configured. Vercel connection cannot be tested fully.");
    } else {
      const vcTest = await vercelRequest('GET', `/v9/projects/${VERCEL_PROJECT_ID}`);
      console.log(`✅ Vercel API authenticated successfully! Project: ${vcTest.name} (ID: ${vcTest.id})`);
    }
  } catch (err) {
    console.error(`❌ Vercel API error: ${err.message}`);
  }
}

async function cmdListDomains() {
  console.log("=== Listing Porkbun Domains ===");
  const data = await porkbunRequest('/domain/listAll');
  if (!data.domains || data.domains.length === 0) {
    console.log("No domains found with API Access enabled.");
    return;
  }
  
  console.table(data.domains.map(d => ({
    Domain: d.domain,
    "Status": d.status,
    "TLD": d.tld,
    "Auto-Renew": d.autoRenew === "1" ? "Yes" : "No"
  })));
}

async function cmdGetRecords(domain) {
  if (!domain) {
    console.error("Error: Please specify the domain name. Example: node dns-tool.cjs get-records mydomain.com");
    process.exit(1);
  }
  
  console.log(`=== DNS Records for ${domain} ===`);
  const data = await porkbunRequest(`/dns/retrieve/${domain}`);
  console.table(data.records.map(r => ({
    ID: r.id,
    Name: r.name,
    Type: r.type,
    Content: r.content,
    TTL: r.ttl
  })));
}

async function cmdAddRecord(domain, type, name, content, ttl = '600') {
  if (!domain || !type || name === undefined || !content) {
    console.error("Error: Missing parameters. Usage: node dns-tool.cjs add-record <domain> <type> <subdomain> <content> [ttl]");
    process.exit(1);
  }
  
  const result = await upsertDnsRecord(domain, type.toUpperCase(), name, content, ttl);
  console.log(`Result: ${result.status} (Record ID: ${result.id})`);
}

async function cmdDeleteRecord(domain, id) {
  if (!domain || !id) {
    console.error("Error: Missing parameters. Usage: node dns-tool.cjs delete-record <domain> <recordId>");
    process.exit(1);
  }
  
  console.log(`[Porkbun] Deleting record ${id} on domain ${domain}...`);
  await porkbunRequest(`/dns/delete/${domain}/${id}`);
  console.log("✅ Record deleted successfully.");
}

async function cmdStatusVercel(domain) {
  if (!domain) {
    console.error("Error: Specify domain. Usage: node dns-tool.cjs status-vercel <domain>");
    process.exit(1);
  }
  if (!VERCEL_PROJECT_ID) {
    console.error("Error: VERCEL_PROJECT_ID is not configured in environment.");
    process.exit(1);
  }

  console.log(`=== Vercel Domain Status for ${domain} ===`);
  const projectDomain = await vercelRequest('GET', `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`);
  
  console.log(`Domain Name:  ${projectDomain.name}`);
  console.log(`Verified:     ${projectDomain.verified ? '✅ YES' : '❌ NO'}`);
  console.log(`Verification: ${JSON.stringify(projectDomain.verification || [], null, 2)}`);
  
  // Vercel config verification
  const check = await vercelRequest('GET', `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/config`);
  console.log(`Misconfigured: ${check.misconfigured ? '⚠️ YES' : '✅ NO'}`);
  if (check.misconfigured) {
    console.log("\nSuggested Record changes:");
    console.log(JSON.stringify(check.conflict, null, 2));
  }
}

async function cmdLinkVercel(domain) {
  if (!domain) {
    console.error("Error: Specify domain. Usage: node dns-tool.cjs link-vercel <domain>");
    process.exit(1);
  }
  if (!VERCEL_PROJECT_ID) {
    console.error("Error: VERCEL_PROJECT_ID is not configured in environment.");
    process.exit(1);
  }

  console.log(`=== Linking ${domain} to Vercel Project ${VERCEL_PROJECT_ID} ===`);
  
  // 1. Add Domain to Vercel
  let domainInfo;
  try {
    console.log(`[Vercel] Adding domain ${domain} to project...`);
    domainInfo = await vercelRequest('POST', `/v9/projects/${VERCEL_PROJECT_ID}/domains`, { name: domain });
    console.log(`[Vercel] Domain status: verified=${domainInfo.verified}`);
  } catch (err) {
    if (err.message.includes("already")) {
      console.log(`[Vercel] Domain ${domain} is already added to the project. Fetching status...`);
      domainInfo = await vercelRequest('GET', `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}`);
    } else {
      throw err;
    }
  }

  // 2. Determine and apply required DNS records
  const isSubdomain = domain.includes('.') && domain.split('.').length > 2 && !domain.startsWith('www.');
  const rootDomain = isSubdomain ? domain.split('.').slice(-2).join('.') : domain;

  // Let's retrieve Vercel verification config if not verified
  if (!domainInfo.verified && domainInfo.verification && domainInfo.verification.length > 0) {
    console.log("[Vercel] Domain requires TXT verification challenge. Adding TXT record...");
    for (const challenge of domainInfo.verification) {
      if (challenge.type === 'TXT') {
        const subName = getSubdomainName(challenge.domain, rootDomain);
        await upsertDnsRecord(rootDomain, 'TXT', subName, challenge.value);
      }
    }
  }

  // Configure A or CNAME depending on root domain or subdomain
  if (isSubdomain) {
    // Subdomain e.g. app.828electric.com
    const subName = getSubdomainName(domain, rootDomain);
    console.log(`[Vercel] Configuring subdomain CNAME record for ${subName}.${rootDomain}...`);
    await upsertDnsRecord(rootDomain, 'CNAME', subName, 'cname.vercel-dns.com');
  } else {
    // Root domain e.g. 828electric.com or www.828electric.com
    console.log(`[Vercel] Configuring root domain A record...`);
    await upsertDnsRecord(rootDomain, 'A', '', '76.76.21.21');

    console.log(`[Vercel] Configuring www CNAME record pointing to root domain...`);
    await upsertDnsRecord(rootDomain, 'CNAME', 'www', 'cname.vercel-dns.com');
    
    // Also add www subdomain to Vercel
    try {
      console.log(`[Vercel] Adding www.${domain} to project...`);
      await vercelRequest('POST', `/v9/projects/${VERCEL_PROJECT_ID}/domains`, { name: `www.${domain}` });
    } catch (e) {
      // ignore if already added
    }
  }

  console.log("\n[Porkbun] DNS records have been configured. Waiting 2 seconds before checking Vercel verification...");
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Trigger verification
  try {
    console.log(`[Vercel] Triggering verification check for ${domain}...`);
    const verifyResult = await vercelRequest('POST', `/v9/projects/${VERCEL_PROJECT_ID}/domains/${domain}/verify`);
    console.log(`[Vercel] Verification response: verified=${verifyResult.verified}`);
    if (verifyResult.verified) {
      console.log("🎉 SUCCESS! Your domain has been successfully configured and verified on Vercel!");
    } else {
      console.log("⚠️ Domain added but verification is pending. It can take a few minutes for Porkbun DNS changes to propagate.");
    }
  } catch (err) {
    console.warn(`[Vercel Check] Verification check returned: ${err.message}. DNS propagation may take a few minutes.`);
  }
}

// 5. CLI Router
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'test-credentials':
        await cmdTestCredentials();
        break;
      case 'list-domains':
        await cmdListDomains();
        break;
      case 'get-records':
        await cmdGetRecords(args[1]);
        break;
      case 'add-record':
        await cmdAddRecord(args[1], args[2], args[3], args[4], args[5]);
        break;
      case 'delete-record':
        await cmdDeleteRecord(args[1], args[2]);
        break;
      case 'status-vercel':
        await cmdStatusVercel(args[1]);
        break;
      case 'link-vercel':
        await cmdLinkVercel(args[1]);
        break;
      default:
        console.log(`
Porkbun & Vercel DNS Automation Tool

Commands:
  test-credentials
      Verify connection to Porkbun and Vercel APIs.
      
  list-domains
      List all domains in your Porkbun account.
      
  get-records <domain>
      Show existing DNS records on Porkbun for <domain>.
      
  add-record <domain> <type> <subdomain> <content> [ttl]
      Add or update a single DNS record.
      Example: node dns-tool.cjs add-record mydomain.com A "" 76.76.21.21
      
  delete-record <domain> <recordId>
      Delete a DNS record from Porkbun by record ID.
      
  link-vercel <domain>
      Core command: Adds <domain> to Vercel, creates the DNS verification records
      and A/CNAME mappings in Porkbun, and requests verification from Vercel.
      
  status-vercel <domain>
      Retrieve Vercel verification and configuration status for <domain>.
        `);
        break;
    }
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
