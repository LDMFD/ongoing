// This list also found in ReviewModule.go and Entities/Module.cs
export const ModuleTypeIntroduction       = "introduction";

export const ModuleTypeProfile            = "profile";
export const ModuleTypeFactFind           = "profile_fact_find";
export const ModuleTypeRisk               = "profile_risk";
export const ModuleTypeObjectives         = "profile_objectives";

export const ModuleTypePolicyValuations   = "policy_valuations";
export const ModuleTypeValuation          = "policy_valuations_valuation";
export const ModuleTypeContributions      = "policy_valuations_contributions";

export const ModuleTypeFees               = "fees";
export const ModuleTypeAdviceFee          = "fees_advice_fee";
export const ModuleTypePolicyFees         = "fees_policy_fees";
export const ModuleTypeFundLevelFees      = "fees_fund_level";
export const ModuleTypePortfolioLevelFees = "fees_portfolio_level";
export const ModuleTypeDimFee             = "fees_dim";

export const ModuleTypeConclusions        = "conclusions";
export const ModuleTypeGoals              = "conclusions_goals";
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
    { id: ModuleTypeObjectives,         label: "Profile - Objectives" },
    { id: ModuleTypePolicyValuations,   label: "Policy Valuations page" },
    { id: ModuleTypeValuation,          label: "Policy Valuations - Policy Valuation" },
    { id: ModuleTypeContributions,      label: "Policy Valuations - Policy Contributions" },
    { id: ModuleTypeFees,               label: "Fees page" },
    { id: ModuleTypeAdviceFee,          label: "Fees - Advice" },
    { id: ModuleTypePolicyFees,         label: "Fees - Platform" },
    { id: ModuleTypeFundLevelFees,      label: "Fees - Funds Level" },
    { id: ModuleTypePortfolioLevelFees, label: "Fees - Portfolio Level" },
    { id: ModuleTypeDimFee,             label: "Fees - DIM" },
    { id: ModuleTypeConclusions,        label: "Conclusions page" },
    { id: ModuleTypeGoals,              label: "Conclusions - Goals" },
    { id: ModuleTypeAdviceGiven,        label: "Conclusions - Advice Given" },
    { id: ModuleTypeDueDiligence,       label: "Conclusions - Due Digilence" },
    { id: ModuleTypeForecast,           label: "Conclusions - Forecast" },
    { id: ModuleTypeOngoingSuitability, label: "Conclusions - Ongoing Suitability" },
    { id: ModuleTypeActionPoints,       label: "Conclusions - Action Points" },   
];
