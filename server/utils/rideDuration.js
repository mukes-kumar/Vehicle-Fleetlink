// utils/rideDuration.js
exports.calculateRideDurationHours = (fromPincode, toPincode) => {
  const f = parseInt(fromPincode,10), t = parseInt(toPincode,10);
  if (isNaN(f) || isNaN(t)) return 1;
  return Math.abs(t - f) % 24;
};
