import evs from "./evs.json" assert { type: "json" };
import events from "./events.json" assert { type: "json" };

const CHARGING_SPOTS = 20;

/* Simulate Multiple 6months DR Events */
const drEvents = Array(4).fill(events).flat();

// Utility to select a random object from an array
const getRandomObject = (arr) => {
  if (!arr.length) throw new Error("Array is empty");
  return arr[Math.floor(Math.random() * arr.length)];
};

// Calculate Starting Degradation
const calculateStartingDegradation = (evList) =>
  evList.reduce(
    (acc, ev) => acc + ev.totalDegradation + ev.initialDegradation,
    0
  );
console.log("Starting Degradation:", calculateStartingDegradation(evs), "%");

/*
 * Calculate Maximum Contribution of EV based on maxiumum DOD and total available energy based
 * on EV capacity and discharge rate per hour.
 */
const calculateMaxContribution = (ev, totalAvailable) => {
  return Math.floor(Math.min(totalAvailable, ev.capacity));
};

/* Calculate the number of cycles based on the total energy used and EV capacity */
const calculateCycleCount = (ev, totalUsed) =>
  Math.ceil(totalUsed / ev.capacity);

// Select EVs to meet total energy demand
const selectEVs = (vehicles, totalRequired, totalTime, chargingSpots) => {
  /* Compute total degradation for each EV */
  const preparedEvs = vehicles.map((ev) => {
    const totalUsedKwh = calculateMaxContribution(
      ev,
      ev.dischargeRate * totalTime
    );
    const cycles = calculateCycleCount(ev, totalUsedKwh);
    const newDegradation = ev.degradationCoefficient * cycles * totalUsedKwh;

    return {
      ...ev,
      maxContribution: totalUsedKwh,
      totalDegradation:
        ev.initialDegradation + ev.totalDegradation + newDegradation,
      currentDegradation: newDegradation,
    };
  });
  const selectedEvs = [];
  let totalAvailableEnergy = 0;

  // Randomly select EVs
  while (
    totalAvailableEnergy < totalRequired &&
    preparedEvs.length > 0 &&
    selectedEvs.length < chargingSpots
  ) {
    const chosenEV = getRandomObject(preparedEvs);
    preparedEvs.splice(preparedEvs.indexOf(chosenEV), 1);
    selectedEvs.push(chosenEV);
    totalAvailableEnergy += chosenEV.maxContribution;
  }

  /* If total available energy is still less than required, optimize for maximum delivery to represent more realworld scenarios */
  while (totalAvailableEnergy < totalRequired && preparedEvs.length > 0) {
    selectedEvs.sort((a, b) => a.maxContribution - b.maxContribution);
    selectedEvs.shift();
    const nextBetterEV = getRandomObject(preparedEvs);

    preparedEvs.splice(preparedEvs.indexOf(nextBetterEV), 1);
    selectedEvs.push(nextBetterEV);

    totalAvailableEnergy = selectedEvs.reduce(
      (acc, ev) => acc + ev.maxContribution,
      0
    );
  }

  return selectedEvs;
};

/* Simulate DR Events */
drEvents.forEach((event, index) => {
  const { demand, timeInHrs } = event;

  const selectedEvs = selectEVs(evs, demand, timeInHrs, CHARGING_SPOTS);

  console.table(selectedEvs);

  // Update degradation for selected EVs
  selectedEvs.forEach((ev) => {
    const evData = evs.find((evItem) => evItem.id === ev.id);
    if (evData) evData.totalDegradation += ev.currentDegradation;
  });

  const totalCapacity = selectedEvs.reduce(
    (acc, ev) => acc + ev.maxContribution,
    0
  );

  console.log(
    `Event ${
      index + 1
    }: Provided ${totalCapacity} kWh out of ${demand} kWh demand\n`
  );
});

console.table(
  evs.map((ev) => ({
    ...ev,
    finalDegradation: ev.totalDegradation + ev.initialDegradation,
  }))
);

const endingDegradation = calculateStartingDegradation(evs);
console.log("Ending Degradation:", endingDegradation, "%");
console.log(
  "Total DR Degradation:",
  evs.reduce((acc, ev) => acc + ev.totalDegradation, 0),
  "%"
);
