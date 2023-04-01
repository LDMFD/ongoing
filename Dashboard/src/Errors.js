// Maps to Errors.go

// HttpStatusBadRequest
export const UniqueViolation = "duplicate_record"

// HttpStatusUnauthorized
export const AccessViolation = "access_violation"

// HttpStatusBadRequest
export const IntegrityViolation = "integrity_violation" // can't delete because dependencies exist

// HttpStatusBadRequest
export const InvalidInput = "invalid_input" // can't bind path, query or json

// HttpStatusNotFound
export const NotFound = "not_found"

// HttpStatusInternalServerError
export const InternalError = "internal_error"
