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
	ModulePresets   []Entities.ReportModulePreset
	Operators       []Entities.ReportOperator
	PolicyProviders []Entities.ReportPolicyProvider
	PolicyTypes     []Entities.ReportPolicyType
	ProviderCharges []Entities.ReportProviderCharge
	RiskProviders   []Entities.ReportRiskProvider
	RiskLevels      []Entities.ReportRiskLevel
}

func GetGlobalEntities(c *gin.Context) {
	db := c.MustGet("DATABASE").(*bun.DB)
	session := c.MustGet("SESSION").(*Entities.ServerSessionContext)

	entities := GlobalEntities{
		Funds:           make([]Entities.ReportFund, 0),
		Models:          make([]Entities.ReportModel, 0),
		ModulePresets:   make([]Entities.ReportModulePreset, 0),
		Operators:       make([]Entities.ReportOperator, 0),
		PolicyProviders: make([]Entities.ReportPolicyProvider, 0),
		PolicyTypes:     make([]Entities.ReportPolicyType, 0),
		ProviderCharges: make([]Entities.ReportProviderCharge, 0),
		RiskProviders:   make([]Entities.ReportRiskProvider, 0),
		RiskLevels:      make([]Entities.ReportRiskLevel, 0),
	}

	var funds []Entities.Fund
	if err := db.NewSelect().
		Model(&funds).
		Relation("File").
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
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
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
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
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
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
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
		OrderExpr("name ASC").
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, pp := range policyProviders {
		entities.PolicyProviders = append(entities.PolicyProviders, pp.ToReport())
	}

	var providerCharges []Entities.ProviderCharge
	if err := db.NewSelect().
		Model(&providerCharges).
		//OrderExpr("sequence ASC").  // TODO ordering (advisor to control)
		Relation("PolicyProvider").
		//Relation("PolicyProvider.Org").
		//Where("Org.Uid = ?", session.OrgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, pc := range providerCharges {
		entities.ProviderCharges = append(entities.ProviderCharges, pc.ToReport())
	}

	var riskProviders []Entities.RiskProvider
	if err := db.NewSelect().
		Model(&riskProviders).
		OrderExpr("name ASC").
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, rp := range riskProviders {
		entities.RiskProviders = append(entities.RiskProviders, rp.ToReport())
	}

	var riskLevels []Entities.RiskLevel
	if err := db.NewSelect().
		Model(&riskLevels).
		Relation("RiskProvider.Org").
		Where("risk_provider__org.Uid = ?", session.OrgId).
		Scan(c); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}
	for _, rl := range riskLevels {
		entities.RiskLevels = append(entities.RiskLevels, rl.ToReport())
	}

	var policyTypes []Entities.PolicyType
	if err := db.NewSelect().
		Model(&policyTypes).
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
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
		Relation("Org").
		Where("Org.Uid = ?", session.OrgId).
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
