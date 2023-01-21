package Config

import (
	"os"
	"strings"
)

// OFFLINE_AUTH
// *WARNING* - ONLY USE FOR LOCAL DEV (for running tests)
// - Disables security warnings (for tests)
// - Allows the client to specify entity IDs (for import)
// - Allows an email or user ID to be passed to the 'Authentication:' header (for tests & import)
var OFFLINE_AUTH = os.Getenv("ONGOING_OFFLINE_AUTH") == "true"

// API_KEY
// API key for use in X-Ongoing-ApiKey header (for live imports)
var API_KEY = strings.TrimSpace(os.Getenv("ONGOING_API_KEY"))
