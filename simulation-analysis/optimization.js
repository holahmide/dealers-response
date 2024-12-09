import evs from "./evs.json" assert { type: "json" };
import events from "./events.json" assert { type: "json" };

const CHARGING_SPOTS = 20;
const MAXIMUM_DOD = 0.8;

/* Simulate Multiple 6months DR Events */
const drEvents = Array(4).fill(events).flat();

// Calculate Starting Degradation
const calculateStartingDegradation = (vehicles) => {
  return vehicles.reduce(
    (total, ev) => total + ev.totalDegradation + ev.initialDegradation,
    0
  );
};
console.log("Starting Degradation", calculateStartingDegradation(evs), "%");

/*
 * Calculate Maximum Contribution of EV based on maxiumum DOD and total available energy based
 * on EV capacity and discharge rate per hour.
 */
const calculateMaxContribution = (ev, totalAvailable) => {
  return Math.floor(Math.min(totalAvailable, ev.capacity * MAXIMUM_DOD));
};

/* Calculate the number of cycles based on the total energy used and EV capacity */
const calculateCycleCount = (ev, totalUsed) => {
  return totalUsed / ev.capacity;
};

const selectEVs = (
  vehicles,
  totalRequiredEnergy,
  timeInHours,
  chargingSpots
) => {
  const selectedEvs = [];

  /* Compute total degradation for each EV and sort according to degradation */
  const sortedEvs = vehicles
    .map((ev) => {
      const maxUsage = calculateMaxContribution(
        ev,
        ev.dischargeRate * timeInHours
      );
      const cycles = calculateCycleCount(ev, maxUsage);
      const newDegradation = ev.degradationCoefficient * cycles * maxUsage;

      return {
        ...ev,
        maxContribution: maxUsage,
        totalDegradation:
          ev.initialDegradation + ev.totalDegradation + newDegradation,
        currentDegradation: newDegradation,
      };
    })
    .sort((a, b) => a.totalDegradation - b.totalDegradation);

  let totalAvailableEnergy = 0;

  /* Initially select EVs based on degradation to fill charging spots */
  while (
    totalAvailableEnergy < totalRequiredEnergy &&
    sortedEvs.length > 0 &&
    selectedEvs.length < chargingSpots
  ) {
    const nextEV = sortedEvs.shift();
    selectedEvs.push(nextEV);
    totalAvailableEnergy += nextEV.maxContribution;
  }

  /* If total available energy is still less than required, optimize for maximum delivery */
  while (totalAvailableEnergy < totalRequiredEnergy && sortedEvs.length > 0) {
    selectedEvs.sort((a, b) => a.maxContribution - b.maxContribution);

    // Replace the EV with the least contribution with the next better EV
    const nextBetterEV = sortedEvs.shift();
    selectedEvs.shift();
    selectedEvs.push(nextBetterEV);

    totalAvailableEnergy = selectedEvs.reduce(
      (total, ev) => total + ev.maxContribution,
      0
    );
  }

  return { selectedEvs, totalAvailableEnergy };
};

/* Simulate DR Events */
drEvents.forEach((event, index) => {
  const { selectedEvs } = selectEVs(
    evs,
    event.demand,
    event.timeInHrs,
    CHARGING_SPOTS
  );

  console.table(selectedEvs);

  /* Update total degradation for each EV */
  selectedEvs.forEach((ev) => {
    const originalEv = evs.find((evData) => evData.id === ev.id);
    if (originalEv) {
      originalEv.totalDegradation += ev.currentDegradation;
    }
  });

  const totalAvailableCapacity = selectedEvs.reduce(
    (total, ev) => total + ev.maxContribution,
    0
  );

  console.log(
    `Total Available Capacity for Event ${
      index + 1
    }: ${totalAvailableCapacity} kWh out of ${event.demand} kWh\n\n`
  );
});

console.table(evs);

console.table(
  evs.map((ev) => ({
    ...ev,
    finalDegradation: ev.totalDegradation + ev.initialDegradation,
  }))
);

const endingDegradation = calculateStartingDegradation(evs);
console.log("Ending Degradation", endingDegradation, "%");
console.log(
  "Total DR Degradation",
  evs.reduce((total, ev) => total + ev.totalDegradation, 0),
  "%"
);
