package Config

import "os"

var OFFLINE_AUTH = os.Getenv("OFFLINE_AUTH") == "true"
