export const START_FLOW_STEPS = [
    "Your Details",
    "Select Plan",
    "Add Services",
    "Business Details",
    "Payment",
    "Confirmation",
    "KYC",
];

export const MANAGE_FLOW_STEPS = [
    "Business Check",
    "Category",
    "Services",
    "Consultation",
    "Business Details",
    "Payment",
    "Confirmation",
];

export const getStepsForFlow = (flowType: "start" | "manage" | string) => {
    return flowType === "manage" ? MANAGE_FLOW_STEPS : START_FLOW_STEPS;
};
