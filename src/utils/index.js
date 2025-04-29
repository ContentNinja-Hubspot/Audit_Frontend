export const findBorderColor = (score) => {
  if (typeof score !== "number") return "border-gray-300";
  if (score <= 24) return "border-red-500";
  if (score <= 70) return "border-gray-500";
  return "border-green-500";
};

export const getScoreColor = (score) => {
  if (score <= 24) return "#ef4444"; // Red
  if (score <= 70) return "#f97316"; // Orange
  return "#22c55e"; // Green
};

export const findRiskImage = (risk) => {
  const HIGH_RISK =
    "https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/red@2x.png";
  const MEDIUM_RISK =
    "https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/yellow@2x.png";
  const LOW_RISK =
    "https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/right@2x.png";
  if (risk === "High Risk") {
    return HIGH_RISK;
  } else if (risk === "Moderate Risk") {
    return MEDIUM_RISK;
  } else {
    return LOW_RISK;
  }
};
export const findRiskImageForObject = (value) => {
  const HIGH_RISK =
    "https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/red@2x.png";
  const MEDIUM_RISK =
    "https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/yellow@2x.png";
  const LOW_RISK =
    "https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/right@2x.png";
  if (value < 25) {
    return HIGH_RISK;
  } else if (value < 75) {
    return MEDIUM_RISK;
  } else {
    return LOW_RISK;
  }
};

export const getBorderColor = (risk) => {
  if (risk === "High Risk") return "border-red-500";
  if (risk === "Moderate Risk") return "border-gray-500";
  if (risk === "No Risk") return "border-green-500";
  if (risk === "Low Risk") return "border-green-500";
  return "border-gray-500";
};

export const getRiskLevel = (score) => {
  if (score >= 70) return "Low Risk";
  if (score >= 40) return "Moderate Risk";
  return "High Risk";
};
