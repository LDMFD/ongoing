data "digitalocean_loadbalancer" "lb" {
  name = "ongoing-lb"
}

# Create a new domain
resource "digitalocean_domain" "default" {
  name = "amplifa.co.uk"
}

# Create an A record pointing t
resource "digitalocean_record" "lb" {
  domain = digitalocean_domain.default.id
  name   = "do-api5"
  ttl    = 300
  type   = "A"
  value  = data.digitalocean_loadbalancer.lb.ip
}
