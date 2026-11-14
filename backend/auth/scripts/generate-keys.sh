#!/usr/bin/env bash
# Generates the RS256 key pair used to sign access tokens.
#
#   scripts/generate-keys.sh            # writes keys/private.key and keys/public.key (local dev)
#   scripts/generate-keys.sh --base64   # also prints both keys base64-encoded, ready to be
#                                       # stored as the JWT_ACCESS_PRIVATE_KEY /
#                                       # JWT_ACCESS_PUBLIC_KEY secrets
#
# Existing keys are never overwritten: delete them first to rotate.
set -euo pipefail

KEYS_DIR="$(cd "$(dirname "$0")/.." && pwd)/keys"
PRIVATE_KEY="$KEYS_DIR/private.key"
PUBLIC_KEY="$KEYS_DIR/public.key"

if [[ -e "$PRIVATE_KEY" || -e "$PUBLIC_KEY" ]]; then
	echo "Keys already exist in $KEYS_DIR, delete them first to generate a new pair." >&2
	exit 1
fi

mkdir -p "$KEYS_DIR"
umask 077
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$PRIVATE_KEY" 2>/dev/null
openssl pkey -in "$PRIVATE_KEY" -pubout -out "$PUBLIC_KEY"
echo "Generated $PRIVATE_KEY and $PUBLIC_KEY"

if [[ "${1:-}" == "--base64" ]]; then
	echo
	echo "JWT_ACCESS_PRIVATE_KEY=$(base64 < "$PRIVATE_KEY" | tr -d '\n')"
	echo "JWT_ACCESS_PUBLIC_KEY=$(base64 < "$PUBLIC_KEY" | tr -d '\n')"
fi
