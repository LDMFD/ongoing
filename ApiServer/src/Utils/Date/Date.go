package Date

import "time"

func FromCanonical(date string) (time.Time, error) {
	return time.Parse("2006-01-02T15:04:05Z", date)
}

func ToCanonical(date *time.Time) string {
	if date == nil {
		return ""
	}
	return date.Format(time.RFC3339)
}
