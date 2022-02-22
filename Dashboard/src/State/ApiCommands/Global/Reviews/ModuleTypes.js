// This list also found in 0.sql and ReviewModule.go
export const ModuleTypeIntroduction       = "introduction";

export const ModuleTypeProfile            = "profile";
export const ModuleTypeFactFind           = "profile:fact-find";
export const ModuleTypeRisk               = "profile:risk";
export const ModuleTypeObjectives         = "profile:objectives";

export const ModuleTypePolicyValuations   = "policy-valuations";
export const ModuleTypeValuation          = "policy-valuations:valuation";
export const ModuleTypeContributions      = "policy-valuations:contributions";

export const ModuleTypeFees               = "fees";
export const ModuleTypeAdviceFee          = "fees:advice-fee";
export const ModuleTypePolicyFees         = "fees:policy-fees";
export const ModuleTypeFundFees           = "fees:fund-fees";
export const ModuleTypeFundFeesElse       = "fees:fund-fees-else";

export const ModuleTypeConclusions        = "conclusions";
export const ModuleTypeAdviceGiven        = "conclusions:advice-given";
export const ModuleTypeDueDiligence       = "conclusions:due-diligence";
export const ModuleTypeOngoingSuitability = "conclusions:ongoing-suitability";
export const ModuleTypeActionPoints       = "conclusions:action-points";

export const ModuleTypeSelectSpec = [
    { id: ModuleTypeIntroduction,       label: "Introduction" },
    { id: ModuleTypeProfile,            label: "Fact find, Risk profile & Objectives page" },
    { id: ModuleTypeFactFind,           label: "Fact-Find" },
    { id: ModuleTypeRisk,               label: "Attitude To Risk Questionnaire" },
    { id: ModuleTypeObjectives,         label: "Objectives" },
    { id: ModuleTypePolicyValuations,   label: "Policy Valuations page" },
    { id: ModuleTypeValuation,          label: "Policy Valuation" },
    { id: ModuleTypeContributions,      label: "Policy Contributions" },
    { id: ModuleTypeFees,               label: "Fees page" },
    { id: ModuleTypeAdviceFee,          label: "Fees - Advice" },
    { id: ModuleTypePolicyFees,         label: "Fees - Policies" },
    { id: ModuleTypeFundFees,           label: "Fees - Fund Fees" },
    { id: ModuleTypeFundFeesElse,       label: "Fees - Fund Fees - Else" },
    { id: ModuleTypeConclusions,        label: "Conclusions" },
    { id: ModuleTypeAdviceGiven,        label: "Advice Given" },
    { id: ModuleTypeDueDiligence,       label: "Due Digilence" },
    { id: ModuleTypeOngoingSuitability, label: "Ongoing Suitability" },
    { id: ModuleTypeActionPoints,       label: "Action Points" },   
];
