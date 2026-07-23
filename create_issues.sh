#!/bin/bash
set -e

create_issue() {
  REPO=$1
  TITLE=$2
  LABELS=$3
  SUMMARY=$4
  TECH=$5
  
  cat <<EOF > /tmp/issue_body.md
### Summary
$SUMMARY

### Acceptance Criteria
- [ ] Item 1
- [ ] Item 2
- [ ] Item 3

### Tech Stack
$TECH
EOF

  echo "Creating issue '$TITLE' in $REPO..."
  gh issue create --repo "$REPO" --title "$TITLE" --body-file /tmp/issue_body.md --label "$LABELS" || echo "Failed to create issue (ensure gh is authenticated)"
}

echo "📝 Creating issues for Femology/attestflow-contract..."
create_issue "Femology/attestflow-contract" "feat(contract): implement schema access control & admin transfer functions" "enhancement,good first issue" "Add access control mechanisms to schemas and allow transferring admin rights." "Rust / Soroban"
create_issue "Femology/attestflow-contract" "test(contract): add fuzz testing for attestation UID collisions" "testing,security" "Implement fuzz testing to ensure UID generation never collides." "Rust"
create_issue "Femology/attestflow-contract" "feat(contract): add batch attestation issuance function" "enhancement,help wanted" "Allow issuing multiple attestations in a single transaction to save fees." "Rust / Soroban"

echo "📝 Creating issues for Femology/attestflow-app..."
create_issue "Femology/attestflow-app" "feat(web): add passkey & smart wallet support via Stellar Wallet Kit" "enhancement,frontend" "Integrate Stellar Wallet Kit to support smart wallets and passkeys." "TypeScript / Next.js"
create_issue "Femology/attestflow-app" "feat(indexer): migrate indexer database from SQLite to PostgreSQL" "backend,database" "Migrate the indexer's SQLite database to PostgreSQL for better concurrency." "Node.js / PostgreSQL"
create_issue "Femology/attestflow-app" "feat(sdk): implement automatic transaction retry and TTL extension helpers" "sdk,good first issue" "Add automatic retries for transaction failures and TTL helpers in the SDK." "TypeScript"
create_issue "Femology/attestflow-app" "docs(api): add OpenAPI / Swagger specification for indexer REST API" "documentation" "Create OpenAPI specs for the REST API." "Markdown / YAML"

echo "🏷️ Tagging attestflow-app..."
git tag -a v0.1.0 -m "v0.1.0 Initial Testnet Release" || true
git push origin v0.1.0 || true

echo "🏷️ Tagging attestflow-contract..."
cd ../attestflow-contract
git tag -a v0.1.0 -m "v0.1.0 Initial Testnet Release" || true
git push origin v0.1.0 || true
cd ../attestflow-app

echo "✅ All issues and tags created successfully!"
