Handle invalid input as follows:

	if err := doSomething(userInput); err != nil {
		// Send 400 with this message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "x not found"})

		// Print stacktrace to console
		panic(err.Error())
	}

Handle unauthenticated as follows:

	if ok, err := auth.CheckFilePermission(req.Uid, "read", session.UserUid); err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		panic(err.Error())
	}

Consider using "AbortWith()" in other places?


At the point at which an error occurs, wrap with errors.WithStack(err):

	_, err := c.doSomething()
	if err != nil {
		return errors.WithStack(err)
	}

In a request, if an error should include a full stacktrace:

		log.Printf("%+v", err)

Otherwise print :

		log.Println(errors.WithStack(err))

--

Places where logging is controlled in the server:

main_test.go: init()
main_test.go: ConfigureExpect()
ApiServer.go: BuildRouter()


--

Manual overrides during tests to see more info:

- Comment out `if !TestSuite.TEST_BUILD` in main_test.go
