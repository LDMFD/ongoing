// This list also found in ReviewModule.go and Entities/Module.cs
export const ModuleTypeIntroduction       = "introduction";

export const ModuleTypeProfile            = "profile";
export const ModuleTypeFactFind           = "profile_fact_find";
export const ModuleTypeRisk               = "profile_risk";
export const ModuleTypeGoals              = "profile_objectives";

export const ModuleTypePolicyValuations   = "policy_valuations";

export const ModuleTypeFeeTotals          = "fees";
export const ModuleTypeAdviceFee          = "fees_advice_fee";
export const ModuleTypePlatformFees       = "fees_policy_fees";
export const ModuleTypeFundLevelFees      = "fees_fund_level";
export const ModuleTypePortfolioLevelFees = "fees_portfolio_level";
export const ModuleTypeDimFee             = "fees_dim";
export const ModuleTypeFeesImpact         = "fees_impact";

export const ModuleTypeObjectives         = "conclusions_goals";
export const ModuleTypeAdviceGiven        = "conclusions_advice_given";
export const ModuleTypeDueDiligence       = "conclusions_due_diligence";
export const ModuleTypeForecast           = "conclusions_forecast";
export const ModuleTypeOngoingSuitability = "conclusions_ongoing_suitability";
export const ModuleTypeActionPoints       = "conclusions_action_points";

export const ModuleTypeSelectSpec = [
    { id: ModuleTypeIntroduction,       label: "Introduction" },
    { id: ModuleTypeProfile,            label: "Profile (Fact find, Risk profile & Objectives page)" },
    { id: ModuleTypeFactFind,           label: "Profile - Fact-Find" },
    { id: ModuleTypeRisk,               label: "Profile - Attitude To Risk Questionnaire" },
    { id: ModuleTypeGoals,              label: "Profile - Goals" },
    { id: ModuleTypePolicyValuations,   label: "Policy Valuations page" },
    { id: ModuleTypeFeeTotals,          label: "Fees - Totals" },
    { id: ModuleTypeAdviceFee,          label: "Fees - Advice" },
    { id: ModuleTypePlatformFees,       label: "Fees - Platform" },
    { id: ModuleTypeFundLevelFees,      label: "Fees - Funds Level" },
    { id: ModuleTypePortfolioLevelFees, label: "Fees - Portfolio Level" },
    { id: ModuleTypeDimFee,             label: "Fees - DIM" },
    { id: ModuleTypeFeesImpact,         label: "Fees - Impact of Charges" },
    { id: ModuleTypeObjectives,         label: "Assessments - Objectives" },
    { id: ModuleTypeAdviceGiven,        label: "Assessments - Advice Given" },
    { id: ModuleTypeDueDiligence,       label: "Assessments - Due Digilence" },
    { id: ModuleTypeForecast,           label: "Assessments - Forecast" },
    { id: ModuleTypeOngoingSuitability, label: "Assessments - Ongoing Suitability" },
    { id: ModuleTypeActionPoints,       label: "Assessments - Action Points" },   
];
