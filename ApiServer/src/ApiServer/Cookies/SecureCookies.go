package Cookies

import (
	"ongoing/ServiceContext"
	"time"
)

// Secure cookies cannot be read by the browser (this prevents XSS attacks)

var prefix = "Amplifa_"

//func Set(w http.ResponseWriter, name, value string, expiresIn time.Duration) {
func Set(context *ServiceContext.Context, name, value string, expiresIn time.Duration) {
	context.Response.FrameworkContext.SetCookie(prefix+name, value, int(time.Now().Add(300).Unix()), "/", "ongoing-api", false, true)
	//http.SetCookie(w, &http.Cookie{
	//	Name:     prefix + name,
	//	Value:    value,
	//	HttpOnly: true,
	//	//Secure:   true,
	//	Secure: false,
	//	//SameSite: http.SameSiteLaxMode,
	//	//Path:     "/",
	//	Expires: time.Now().Add(expiresIn),
	//})
}

func Get(context *ServiceContext.Context, name string) string {
	if cookie, err := context.Response.FrameworkContext.Cookie(prefix + name); err != nil {
		context.Panic(err)
	} else {
		return cookie
	}
	return ""
}
