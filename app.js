const fs = require('fs');
const path = require('path');
const dns = require('dns').promises;

const inputFile = 'response.json';
const outputDir = 'outputs';
const outputGroupDir = 'output-group';

const dnsCache = {};

async function resolveDomain(domain) {
  if (dnsCache[domain]) return dnsCache[domain];

  const ipv4 = [];
  const ipv6 = [];
  try {
    const aRecords = await dns.resolve4(domain);
    ipv4.push(...aRecords);
  } catch (_) {}
  try {
    const aaaaRecords = await dns.resolve6(domain);
    ipv6.push(...aaaaRecords);
  } catch (_) {}

  const result = { domain, ipv4, ipv6 };
  dnsCache[domain] = result;
  return result;
}

function getBaseName(name) {
  return name.split('#')[0];
}

function checkIPv6Enabled(domainResult, servers) {
  if (domainResult.ipv6.length > 0) return true;
  for (const s of servers) {
    if (s.ipv6.length > 0) return true;
  }
  return false;
}

function groupByIPv4(allEntries) {
  const map = new Map();

  for (const entry of allEntries) {
    for (const server of entry.Servers) {
      for (const ipv4Addr of server.ipv4) {
        if (!map.has(ipv4Addr)) {
          map.set(ipv4Addr, {
            ipv4: ipv4Addr,
            ipv6: server.ipv6.length > 0 ? server.ipv6[0] : null,
            domain: server.Domain,
            servers: [],
            ipv6Enabled: entry.ipv6Enabled,
            city: entry.City
          });
        }
        map.get(ipv4Addr).servers.push(entry.Name);
      }
    }
  }

  return Array.from(map.values());
}

async function main() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  if (!fs.existsSync(outputGroupDir)) fs.mkdirSync(outputGroupDir);

  const rawData = fs.readFileSync(inputFile, 'utf-8');
  const jsonData = JSON.parse(rawData);

  const grouped = {};
  const allEntries = [];

  for (const logical of jsonData.LogicalServers) {
    const baseName = getBaseName(logical.Name);
    if (!grouped[baseName]) {
      grouped[baseName] = [];
    }

    const resolvedDomain = await resolveDomain(logical.Domain);

    const servers = [];
    for (const server of logical.Servers) {
      const resolved = await resolveDomain(server.Domain);
      servers.push({
        Domain: resolved.domain,
        ipv4: resolved.ipv4,
        ipv6: resolved.ipv6,
        X25519PublicKey: server.X25519PublicKey,
        EntryIP: server.EntryIP,
        ExitIP: server.ExitIP,
      });
    }

    const ipv6Enabled = checkIPv6Enabled(resolvedDomain, servers);

    const entryObj = {
      Name: logical.Name,
      Domain: resolvedDomain,
      City: logical.City || null,
      ipv6Enabled,
      Servers: servers,
    };

    grouped[baseName].push(entryObj);
    if (!entryObj.Name.startsWith("SE-") 
    && !entryObj.Name.startsWith("CH-") 
    && !entryObj.Name.startsWith("IS-") ) allEntries.push(entryObj);
  }

  // Write grouped-by-baseName JSON
  for (const [baseName, data] of Object.entries(grouped)) {
    const outputPath = path.join(outputDir, `${baseName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Saved: ${outputPath}`);
  }

  // Create grouped-by-IPv4 JSON
  const ipv4Grouped = groupByIPv4(allEntries);
  ipv4Grouped.sort((a, b) => {
    const cityA = (a.city || "").toLowerCase();
    const cityB = (b.city || "").toLowerCase();
    if (cityA < cityB) return -1;
    if (cityA > cityB) return 1;
    return 0;
  });
  const outputData = {
    genDate: new Date().toISOString(),
    data: ipv4Grouped,
  };

  const outputPathGroup = path.join(outputGroupDir, 'all.json');
  fs.writeFileSync(outputPathGroup, JSON.stringify(outputData, null, 2));
  console.log(`Saved: ${outputPathGroup}`);
}

main().catch((err) => {
  console.error('Error:', err);
});