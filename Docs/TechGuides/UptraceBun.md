## A quick reference to uptrace/bun's postgres library

To make joins, `Relation()` should be camelCase but `Where()` should be snake_case.

		var providerCharges []Entities.ProviderCharge
		if err := db.NewSelect().
			Model(&providerCharges).
			Relation("PolicyProvider").
			Where("policy_provider.uid = ?", pp.Uid).
			Scan(c); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			panic(err.Error())
		}
