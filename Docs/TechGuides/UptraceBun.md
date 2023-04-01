# A quick reference to uptrace/bun's postgres library

## Joins

To make joins, `Relation()` should be CamelCase (the Go field name) but `Where()` should be snake_case (the column name).

		var providerCharges []Entities.ProviderCharge
		if err := db.NewSelect().
			Model(&providerCharges).
			Relation("PolicyProvider").
			Where("policy_provider.uid = ?", pp.Uid).
			Scan(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}

## Updates

Use original table names in Column(string).

	if _, err := db.NewUpdate().
		Model(&policyFund).
		WherePK().
		Column("fund_id").
		Exec(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

## Nested relationships

		Where("risk_provider__org.Uid = ?", orgId).

## Select if exists

	var objs []Entities.Something
	if count, err := db.NewSelect().
		Model(&objs).
		ScanAndCount(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		panic(err.Error())
	} else if count == 0 {
		return
	}
	obj := objs[0]
