Add the following parameter to the Go tool invocation to enable TEST_BUILD;

    -tags testing

This sets the Go build constraint `testing`. See TestingOn.go and TestingOff.go.

(This is probably unecessary - can we switch to an env var?)
