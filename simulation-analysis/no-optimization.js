import evs from "./evs.json";
import events from "./events.json";

const drEvents = [...events, ...events, ...events, ...events];

const charging_spots = 20;

const maximumDOD = 0.8;

function getRandomObject(arr) {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const startingDegradation = evs.reduce(
  (acc, ev) => acc + ev.totalDegradation + ev.initialDegradation,
  0
);

const selectMaximumDOD = (ev, totalAvailable) => {
  return Math.floor(Math.min(totalAvailable, ev.capacity * maximumDOD));
};

const calculateCycleNumber = (ev, totalUsed) => {
  return Math.ceil(totalUsed / ev.capacity);
};

const selectEVs = (totalRequired, totalTime, chargingSpots) => {
  const selectedEvs = [];
  const remaningEvs = evs.map((ev) => {
    const totalUsedKwh = selectMaximumDOD(
      ev,
      ev.dischargeRate * totalTime,
      maximumDOD
    );
    return {
      ...ev,
      maxContribution: totalUsedKwh,
      totalDegradation:
        ev.initialDegradation +
        ev.totalDegradation +
        Number(ev.degradationCoefficient * totalUsedKwh),
      currentDegradation: Number(
        ev.degradationCoefficient *
          calculateCycleNumber(ev, totalUsedKwh) *
          totalUsedKwh
      ),
    };
  });

  let totalAvaialbleEnergy = 0;

  /* Select EVs by random */
  while (
    totalAvaialbleEnergy < totalRequired &&
    remaningEvs.length > 0 &&
    selectedEvs.length < chargingSpots
  ) {
    chosenEV = getRandomObject(remaningEvs);
    remaningEvs.splice(
      remaningEvs.findIndex((ev) => ev.id === chosenEV.id),
      1
    );
    selectedEvs.push(chosenEV);
    totalAvaialbleEnergy += chosenEV.maxContribution;
  }
  /* Select EVs by random */

  /* Optimize EVs to match total required energy */
  while (totalAvaialbleEnergy < totalRequired && remaningEvs.length > 0) {
    const sortedSelectedEvs = selectedEvs.sort(
      (a, b) => a.maxContribution - b.maxContribution
    );

    const nextBetterEV = getRandomObject(remaningEvs);
    const lowestContributor = sortedSelectedEvs[0];

    remaningEvs.splice(
      remaningEvs.findIndex((ev) => ev.id === nextBetterEV.id),
      1
    );

    selectedEvs.splice(
      selectedEvs.findIndex((ev) => ev.id === lowestContributor.id),
      1
    );

    selectedEvs.push(nextBetterEV);
    totalAvaialbleEnergy = selectedEvs.reduce(
      (acc, ev) => acc + ev.maxContribution,
      0
    );
  }
  /* END */

  return selectedEvs;
};

drEvents.forEach((element, index) => {
  const selectedEvs = selectEVs(
    element.demand,
    element.timeInHrs,
    charging_spots
  );

  console.table(selectedEvs);

  // Update each EV selected Degradation in the original EV dataset
  selectedEvs.forEach((ev) => {
    evs.find((evData) => evData.id === ev.id).totalDegradation +=
      ev.currentDegradation;
  });

  console.log(
    "Total Avaialble capacity of event",
    index + 1,
    ": ",
    selectedEvs.reduce((acc, ev) => acc + ev.maxContribution, 0),
    "kWh out of",
    element.demand,
    "\n\n"
  );
});

console.table(
  evs.map((ev) => ({
    ...ev,
    fianlDegradation: ev.totalDegradation + ev.initialDegradation,
  }))
);

console.log("Starting Degradation", startingDegradation, "%");

console.log(
  "Ending Degradation",
  evs.reduce((acc, ev) => acc + ev.totalDegradation + ev.initialDegradation, 0),
  "%"
);

console.log(
  "Total DR Degradation",
  evs.reduce((acc, ev) => acc + ev.totalDegradation, 0),
  "%"
);
