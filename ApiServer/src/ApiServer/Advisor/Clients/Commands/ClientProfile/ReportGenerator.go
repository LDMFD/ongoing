package ClientProfile

import (
	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
	"net/http"
	"ongoing/ApiServer/Advisor/OrgResources/Reviews/ModulePresets/Commands"
	"ongoing/AuthService"
	"ongoing/Entities"
	"sort"
)

type ReportGenerator struct {
	context           *gin.Context
	db                *bun.DB
	authClient        *AuthService.Client
	glientId          int64
	grantClientAccess bool
	client            *Entities.Client
	report            *Entities.ReportDetail
}

func GenerateReport(c *gin.Context, clientId int64, createRelationships bool) *Entities.ReportDetail {
	gen := newReportGenerator(c, clientId, createRelationships)
	gen.generateReport()
	return gen.report
}

func newReportGenerator(c *gin.Context, clientId int64, createRelationships bool) *ReportGenerator {
	return &ReportGenerator{
		context:           c,
		db:                c.MustGet("DATABASE").(*bun.DB),
		authClient:        c.MustGet("AUTH").(*AuthService.Client),
		glientId:          clientId,
		grantClientAccess: createRelationships,
	}
}

func (gen *ReportGenerator) generateReport() {
	gen.client = &Entities.Client{Id: gen.glientId}

	if err := gen.db.NewSelect().
		Model(gen.client).
		Relation("RiskAssessments.RiskLevel.RiskProvider").
		Relation("RiskAssessments.Questionnaire").
		Relation("FactFinds.File").
		Relation("FeesReports.File").
		Relation("Forecasts.File").
		Relation("Policies.PolicyProvider.Charges.PolicyProvider").
		Relation("ProviderDiscounts.PolicyProvider").
		Relation("Policies.PolicyType").
		Relation("Policies.File").
		Relation("PolicyFunds.Policy").
		Relation("PolicyFunds.Fund.File").
		Relation("Portfolios.Model.File").
		Relation("Portfolios.Model.Operator").
		Relation("Portfolios.Policy").
		Relation("Modules").
		Relation("User").
		WherePK().
		Scan(gen.context); err != nil {
		gen.context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		panic(err.Error())
	}

	gen.report = &Entities.ReportDetail{}

	gen.generateModulePresets()
	gen.generateModules()
	gen.generateRisk() // Risk Assessments, Risk Providers, Risk Levels
	gen.generateFactFinds()
	gen.generateFees()
	gen.generateForecasts()
	gen.generatePolicies() // Policies, Policy Types & Providers, Provider Charges & Discounts
	gen.generateFunds()    // Funds, Policy Funds
	gen.generateModels()   // Models, Operators, Portfolios
}

// Some fields in this file are sorted - all could be if needed.

func (gen *ReportGenerator) generateModulePresets() {
	gen.report.ModulePresets = make([]Entities.ReportModulePreset, 0)
	for _, preset := range Commands.GetModulePresetsInternal(gen.context, gen.db) {
		gen.report.ModulePresets = append(gen.report.ModulePresets, preset.ToReport())
	}
	sort.Slice(gen.report.ModulePresets, func(i, j int) bool {
		return gen.report.ModulePresets[i].ModuleType < gen.report.ModulePresets[j].ModuleType
	})
}

func (gen *ReportGenerator) generateModules() {
	gen.report.Modules = make([]Entities.ReportModule, len(gen.client.Modules))
	for ix, m := range gen.client.Modules {
		gen.report.Modules[ix] = m.ToReport()
	}
	sort.Slice(gen.report.Modules, func(i, j int) bool {
		return gen.report.Modules[i].Type < gen.report.Modules[j].Type
	})
}

func (gen *ReportGenerator) generateRisk() {
	gen.report.RiskAssessments = make([]Entities.ReportRiskAssessment, 0)
	var riskProviders = map[int64]*Entities.RiskProvider{}
	var riskLevels = map[int64]*Entities.RiskLevel{}
	for _, r := range gen.client.RiskAssessments {
		gen.report.RiskAssessments = append(gen.report.RiskAssessments, r.ToReport())
		riskLevels[r.RiskLevelId] = r.RiskLevel
		riskProviders[r.RiskLevel.RiskProviderId] = r.RiskLevel.RiskProvider

		//if err := auth.CreateFile(&client.Uid, nil, r.ToReport().Questionnaire.Uid); err != nil {
		//	panic(err)
		//}
	}
	gen.report.RiskProviders = make([]Entities.ReportRiskProvider, 0)
	for _, p := range riskProviders {
		gen.report.RiskProviders = append(gen.report.RiskProviders, p.ToReport())
	}
	gen.report.RiskLevels = make([]Entities.ReportRiskLevel, 0)
	for _, l := range riskLevels {
		gen.report.RiskLevels = append(gen.report.RiskLevels, l.ToReport())
	}
}

func (gen *ReportGenerator) generateFactFinds() {
	gen.report.FactFinds = make([]Entities.ReportFactFind, 0)
	for _, f := range gen.client.FactFinds {
		gen.report.FactFinds = append(gen.report.FactFinds, f.ToReport())
	}
}

func (gen *ReportGenerator) generateFees() {
	gen.report.FeesReports = make([]Entities.ReportFeesReport, 0)
	for _, f := range gen.client.FeesReports {
		gen.report.FeesReports = append(gen.report.FeesReports, f.ToReport())
	}
}

func (gen *ReportGenerator) generateForecasts() {
	gen.report.Forecasts = make([]Entities.ReportForecast, 0)
	for _, f := range gen.client.Forecasts {
		gen.report.Forecasts = append(gen.report.Forecasts, f.ToReport())
	}
}

func (gen *ReportGenerator) generatePolicies() {
	gen.report.Policies = make([]Entities.ReportPolicy, 0)
	var policyProviders = map[int64]*Entities.PolicyProvider{}
	var policyTypes = map[int64]*Entities.PolicyType{}
	for _, pol := range gen.client.Policies {
		gen.report.Policies = append(gen.report.Policies, pol.ToReport())
		policyProviders[pol.PolicyProviderId] = pol.PolicyProvider
		policyTypes[pol.PolicyTypeId] = pol.PolicyType
	}
	gen.report.ProviderCharges = make([]Entities.ReportProviderCharge, 0)
	for _, pp := range policyProviders {
		for _, pc := range pp.Charges {
			gen.report.ProviderCharges = append(gen.report.ProviderCharges, pc.ToReport())
		}
		gen.report.PolicyProviders = append(gen.report.PolicyProviders, pp.ToReport())
	}
	for _, pt := range policyTypes {
		gen.report.PolicyTypes = append(gen.report.PolicyTypes, pt.ToReport())
	}

	gen.report.ProviderDiscounts = make([]Entities.ReportProviderDiscount, 0)
	for _, pd := range gen.client.ProviderDiscounts {
		pd.PolicyProvider = policyProviders[pd.PolicyProviderId]

		// Terrible logic.. needs to be refactored. A policy discount can exist on a client without an associated policy.
		if pd.PolicyProvider == nil {
			var allPolicyProviders []Entities.PolicyProvider
			if err := gen.db.NewSelect().
				Model(&allPolicyProviders).
				Scan(gen.context); err != nil {
				gen.context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
				panic(err.Error())
			}
			for _, pp := range allPolicyProviders {
				if pp.Id == pd.PolicyProviderId {
					gen.report.PolicyProviders = append(gen.report.PolicyProviders, pp.ToReport())
					pd.PolicyProvider = &pp
					break
				}
			}
		}

		gen.report.ProviderDiscounts = append(gen.report.ProviderDiscounts, pd.ToReport())
	}
}

func (gen *ReportGenerator) generateFunds() {
	gen.report.PolicyFunds = make([]Entities.ReportPolicyFund, 0)
	var funds = map[int64]*Entities.Fund{}
	for _, pf := range gen.client.PolicyFunds {
		gen.report.PolicyFunds = append(gen.report.PolicyFunds, pf.ToReport())
		funds[pf.FundId] = pf.Fund
	}
	for _, f := range funds {
		report := f.ToReport()
		gen.report.Funds = append(gen.report.Funds, report)
		if report.File != nil && gen.grantClientAccess {
			if err := gen.authClient.CreateFile(&gen.client.Uid, nil, report.File.Uid); err != nil {
				panic(err)
			}
		}
	}
	sort.Slice(gen.report.PolicyFunds, func(i, j int) bool {
		return gen.report.PolicyFunds[i].Proportion < gen.report.PolicyFunds[j].Proportion
	})
	sort.Slice(gen.report.Funds, func(i, j int) bool {
		return gen.report.Funds[i].Name < gen.report.Funds[j].Name
	})
}

func (gen *ReportGenerator) generateModels() {
	gen.report.Portfolios = make([]Entities.ReportPortfolio, 0)
	var models = map[int64]*Entities.Model{}
	var operators = map[int64]*Entities.Operator{}
	for _, p := range gen.client.Portfolios {
		gen.report.Portfolios = append(gen.report.Portfolios, p.ToReport())
		models[p.ModelId] = p.Model
		operators[p.Model.OperatorId] = p.Model.Operator
	}
	for _, m := range models {
		report := m.ToReport()
		gen.report.Models = append(gen.report.Models, report)
		if report.File != nil && gen.grantClientAccess {
			if err := gen.authClient.CreateFile(&gen.client.Uid, nil, report.File.Uid); err != nil {
				panic(err)
			}
		}
	}
	for _, o := range operators {
		gen.report.Operators = append(gen.report.Operators, o.ToReport())
	}
}
