# Create a new domain
resource "digitalocean_domain" "default" {
  name = "amplifa.co.uk"
}

resource "digitalocean_record" "subdomain" {
  domain = digitalocean_domain.default.id
  type   = "A"
  name   = "do-api"
  value  = "159.65.213.117" // IP of Digital Ocean Load Balancer
  ttl    = 300
}
