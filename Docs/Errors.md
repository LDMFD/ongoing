2022-03-28

It's possible to send a particular code and also raise a local error as follows (Policies.go):

		response.NotFound()
		panic(err)


2022-03-26

	Every transaction is opened with a deferred rollback

	TODO :- Ensure rollbacks only in deferred functions against begintx
	
	(from DeleteFactFind):

	tx, err := db.BeginTx(c, &sql.TxOptions{})
	if err != nil {
		context.Response.Panic(err)
	}
	defer tx.Rollback()

---

Handle unexpected errors as follows:

	context := c.MustGet("CONTEXT").(*ServiceContext.Context)

	if _, err := tx.NewDelete().Model(&something).WherePK().Exec(c); err != nil {
		context.Panic(err)   # shortcut to context.Response.Panic(err)
	}

(see FactFinds.Go)

---

AdvisorLookup.go has a security check log

---	

## Legacy / to review:

Handle invalid input as follows:

	if err := doSomething(userInput); err != nil {
		// Send 400 with this message to the client
		c.JSON(http.StatusBadRequest, gin.H{"error": "x not found"})

		// Print stacktrace to console
		panic(err)
	}

Handle unauthenticated as follows:

	if ok, err := auth.CheckFilePermission(req.Uid, "read", session.UserUid); err != nil {
		c.AbortWithStatus(http.StatusForbidden)
		panic(err)
	}

New method: handle all errors through.

	Errors.HandleError(c, err)

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

There's a note here:

GetClient.go:31
		// TODO implement levelled logging, so this stacktrace can be printed as a warning

--

Places where logging is controlled in the server:

main_test.go: init()
main_test.go: ConfigureExpect()
ApiServer.go: BuildRouter()


--

Manual overrides during tests to see more info:

- Comment out `if !TestSuite.TEST_BUILD` in main_test.go

--

Experience in following a down link to a file that doesn't exist - Page changes to GCP error message
