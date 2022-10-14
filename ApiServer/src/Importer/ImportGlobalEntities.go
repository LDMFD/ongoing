package Importer

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"ongoing/ApiServer/Advisor/Global"
	"ongoing/Entities"
)

//type GlobalEntitiesContainer struct {
//	Entities Global.GlobalEntities
//}

func importGlobalEntities(entities *Global.GlobalEntities) {
	for _, mp := range entities.ModulePresets {
		importModelPreset(mp)
	}
	for _, fund := range entities.Funds {
		importFund(fund)
	}
	for _, op := range entities.Operators {
		importOperator(op)
	}
	for _, model := range entities.Models {
		importModel(model)
	}
	for _, pt := range entities.PolicyTypes {
		importPolicyType(pt)
	}
	for _, pp := range entities.PolicyProviders {
		importPolicyProvider(pp)
	}
	for _, pc := range entities.ProviderCharges {
		importPolicyProviderCharge(pc)
	}
	for _, rp := range entities.RiskProviders {
		importRiskProvider(rp)
	}
	for _, rl := range entities.RiskLevels {
		importRiskLevel(rl)
	}
}

func importModelPreset(mp Entities.ReportModulePreset) {
	jsonData, _ := json.Marshal(mp)
	request, err := http.NewRequest("POST", API+"/advisor/reviews/module-presets", bytes.NewBuffer(jsonData))
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importFund(fund Entities.ReportFund) {
	if fund.File != nil {
		createFile(fund.File)
	}

	jsonData, _ := json.Marshal(fund)
	request, err := http.NewRequest("POST", API+"/advisor/funds", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", fund.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importOperator(operator Entities.ReportOperator) {
	jsonData, _ := json.Marshal(operator)
	request, err := http.NewRequest("POST", API+"/advisor/operators", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", operator.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importModel(model Entities.ReportModel) {
	if model.File != nil {
		createFile(model.File)
	}

	jsonData, _ := json.Marshal(model)
	request, err := http.NewRequest("POST", API+"/advisor/models", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", model.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importPolicyType(policyType Entities.ReportPolicyType) {
	jsonData, _ := json.Marshal(policyType)
	request, err := http.NewRequest("POST", API+"/advisor/policy-types", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", policyType.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importPolicyProvider(policyProvider Entities.ReportPolicyProvider) {
	jsonData, _ := json.Marshal(policyProvider)
	request, err := http.NewRequest("POST", API+"/advisor/policy-providers", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", policyProvider.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importPolicyProviderCharge(charge Entities.ReportProviderCharge) {
	jsonData, _ := json.Marshal(charge)
	request, err := http.NewRequest("POST", API+"/advisor/provider-charges", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", charge.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importRiskProvider(rp Entities.ReportRiskProvider) {
	jsonData, _ := json.Marshal(rp)
	request, err := http.NewRequest("POST", API+"/advisor/risk-providers", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", rp.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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

func importRiskLevel(rl Entities.ReportRiskLevel) {
	jsonData, _ := json.Marshal(rl)
	request, err := http.NewRequest("POST", API+"/advisor/risk-levels", bytes.NewBuffer(jsonData))
	request.Header.Set("X-Amplifa-EntityId", rl.Id)
	if err != nil {
		panic(err)
	}
	request.Header.Set("Authentication", advisorEmail)

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
