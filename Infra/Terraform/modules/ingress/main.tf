resource "helm_release" "nginx_ingress" {
  name       = "nginx-ingress"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "default"

  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/do-loadbalancer-name"
    value = "ongoing-lb"
  }

  # Possible way to set a healthcheck:
  # 
  #  set {
  #    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/do-loadbalancer-healthcheck-protocol"
  #    value = "http"
  #  }
  #
  #  set {
  #    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/do-loadbalancer-healthcheck-port"
  #    value = "10254"
  #  }
  #
  #  set {
  #    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/do-loadbalancer-healthcheck-path"
  #    value = "/nginx-health"
  #  }

  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/do-loadbalancer-hostname"
    value = "do-api4.amplifa.co.uk"
  }

  set {
    name  = "controller.healthStatus"
    value = "true"
  }
}
