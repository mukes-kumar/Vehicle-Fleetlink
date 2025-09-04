function calculateRideDurationHours(fromPincode, toPincode) {
  const diff = Math.abs(parseInt(toPincode, 10) - parseInt(fromPincode, 10));
  return diff % 24;
}
