package Importer

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/OrgResources"
	"ongoing/Entities"
)

func importOrgResources(entities *OrgResources.OrgResources, advisorId string) error {
	for _, mp := range entities.ModulePresets {
		importModelPreset(mp, advisorId)
		break
	}
	for _, fund := range entities.Funds {
		importFund(fund, advisorId)
	}
	for _, op := range entities.Operators {
		importOperator(op, advisorId)
	}
	for _, model := range entities.Models {
		importModel(model, advisorId)
	}
	for _, pt := range entities.PolicyTypes {
		importPolicyType(pt, advisorId)
	}
	for _, pp := range entities.PolicyProviders {
		importPolicyProvider(pp, advisorId)
	}
	for _, pc := range entities.ProviderCharges {
		importPolicyProviderCharge(pc, advisorId)
	}
	for _, rp := range entities.RiskProviders {
		importRiskProvider(rp, advisorId)
	}
	for _, rl := range entities.RiskLevels {
		importRiskLevel(rl, advisorId)
	}
	return nil
}

func importModelPreset(mp Entities.ReportModulePreset, advisorId string) {
	jsonData, _ := json.Marshal(mp)
	request, err := http.NewRequest("POST", API+"/advisor/reviews/module-presets", bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create model preset:", mp.Id, resp.Status)
	}
}

func importFund(fund Entities.ReportFund, advisorId string) {
	jsonData, _ := json.Marshal(fund)
	request, err := http.NewRequest("POST", API+"/advisor/funds", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", fund.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create fund:", resp.Status)
	}
}

func importOperator(operator Entities.ReportOperator, advisorId string) {
	jsonData, _ := json.Marshal(operator)
	request, err := http.NewRequest("POST", API+"/advisor/operators", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", operator.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create operator:", resp.Status)
	}
}

func importModel(model Entities.ReportModel, advisorId string) {
	jsonData, _ := json.Marshal(model)
	request, err := http.NewRequest("POST", API+"/advisor/models", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", model.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create model:", resp.Status)
	}
}

func importPolicyType(policyType Entities.ReportPolicyType, advisorId string) {
	jsonData, _ := json.Marshal(policyType)
	request, err := http.NewRequest("POST", API+"/advisor/policy-types", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", policyType.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create policy type:", resp.Status)
	}
}

func importPolicyProvider(policyProvider Entities.ReportPolicyProvider, advisorId string) {
	jsonData, _ := json.Marshal(policyProvider)
	request, err := http.NewRequest("POST", API+"/advisor/policy-providers", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", policyProvider.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create policy provider:", resp.Status)
	}
}

func importPolicyProviderCharge(charge Entities.ReportProviderCharge, advisorId string) {
	jsonData, _ := json.Marshal(charge)
	request, err := http.NewRequest("POST", API+"/advisor/provider-charges", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", charge.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create policy provider:", resp.Status)
	}
}

func importRiskProvider(rp Entities.ReportRiskProvider, advisorId string) {
	jsonData, _ := json.Marshal(rp)
	request, err := http.NewRequest("POST", API+"/advisor/risk-providers", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", rp.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create risk provider:", resp.Status)
	}
}

func importRiskLevel(rl Entities.ReportRiskLevel, advisorId string) {
	jsonData, _ := json.Marshal(rl)
	request, err := http.NewRequest("POST", API+"/advisor/risk-levels", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Ongoing-EntityId", rl.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorId)

	client := &http.Client{}
	resp, err := client.Do(request)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Println("Create risk level:", resp.Status)
	}
}
