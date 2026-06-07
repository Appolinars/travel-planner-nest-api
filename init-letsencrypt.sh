#!/bin/sh
# One-time bootstrap of the Let's Encrypt certificate for nginx.
#
# The chicken-and-egg problem: nginx won't start without a cert file, but
# certbot needs nginx serving the HTTP-01 challenge to issue one. We break it
# by planting a throwaway self-signed cert so nginx can start, then replacing
# it with a real cert from Let's Encrypt.
#
# Run ONCE on the server, from ~/app:   sh init-letsencrypt.sh
set -e

compose="docker compose -f docker-compose.prod.yml"

domain=$(grep -E '^API_DOMAIN=' .env | cut -d '=' -f2-)
email="vakulenko.maksim977@gmail.com"   # for cert-expiry notices
staging=0   # set to 1 first to test without hitting Let's Encrypt rate limits

if [ -z "$domain" ]; then
  echo "ERROR: API_DOMAIN is not set in .env"; exit 1
fi
cert_path="/etc/letsencrypt/live/$domain"

echo "### 1/4 Creating a temporary self-signed cert so nginx can start..."
$compose run --rm --entrypoint "\
  sh -c 'mkdir -p $cert_path && \
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
      -keyout $cert_path/privkey.pem \
      -out $cert_path/fullchain.pem \
      -subj /CN=localhost'" certbot

echo "### 2/4 Starting nginx..."
$compose up -d nginx

echo "### 3/4 Deleting the dummy cert and requesting the real one..."
$compose run --rm --entrypoint "\
  sh -c 'rm -rf /etc/letsencrypt/live/$domain \
    /etc/letsencrypt/archive/$domain \
    /etc/letsencrypt/renewal/$domain.conf'" certbot

staging_arg=""
[ "$staging" != "0" ] && staging_arg="--staging"

$compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot $staging_arg \
    -d $domain --email $email \
    --agree-tos --no-eff-email --force-renewal" certbot

echo "### 4/4 Reloading nginx with the real certificate..."
$compose exec nginx nginx -s reload

echo "### Done. https://$domain/api should now serve a valid certificate."
