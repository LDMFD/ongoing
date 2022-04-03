package Global

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/Entities"
)

type GlobalEntities struct {
	Funds           []Entities.ReportFund
	Models          []Entities.ReportModel
	Operators       []Entities.ReportOperator
	PolicyProviders []Entities.ReportPolicyProvider
	PolicyTypes     []Entities.ReportPolicyType
	ModulePresets   []Entities.ReportModulePreset
}

func GetGlobalEntities(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)

	entities := GlobalEntities{
		Funds:           make([]Entities.ReportFund, 0),
		Models:          make([]Entities.ReportModel, 0),
		Operators:       make([]Entities.ReportOperator, 0),
		PolicyProviders: make([]Entities.ReportPolicyProvider, 0),
		PolicyTypes:     make([]Entities.ReportPolicyType, 0),
		ModulePresets:   make([]Entities.ReportModulePreset, 0),
	}

	var funds []Entities.Fund
	if err := db.NewSelect().
		Model(&funds).
		Relation("File").
		OrderExpr("name ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, f := range funds {
		entities.Funds = append(entities.Funds, f.ToReport())
	}

	var models []Entities.Model
	if err := db.NewSelect().
		Model(&models).
		Relation("File").
		Relation("Operator").
		OrderExpr("name ASC").Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, m := range models {
		entities.Models = append(entities.Models, m.ToReport())
	}

	var operators []Entities.Operator
	if err := db.NewSelect().
		Model(&operators).
		OrderExpr("name ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, op := range operators {
		entities.Operators = append(entities.Operators, op.ToReport())
	}

	var policyProviders []Entities.PolicyProvider
	if err := db.NewSelect().
		Model(&policyProviders).
		OrderExpr("name ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, pp := range policyProviders {
		entities.PolicyProviders = append(entities.PolicyProviders, pp.ToReport())
	}

	var policyTypes []Entities.PolicyType
	if err := db.NewSelect().
		Model(&policyTypes).
		OrderExpr("name ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, pt := range policyTypes {
		entities.PolicyTypes = append(entities.PolicyTypes, pt.ToReport())
	}

	var modulePresets []Entities.ModulePreset
	if err := db.NewSelect().
		Model(&modulePresets).
		OrderExpr("module_type ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, mp := range modulePresets {
		entities.ModulePresets = append(entities.ModulePresets, mp.ToReport())
	}

	c.JSON(200, gin.H{
		"Entities": entities,
	})
}

