import evs from "./evs.json";
import events from "./events.json";

const drEvents = [...events, ...events, ...events, ...events];

// const evs = [...Array(30).keys()].map((ev, index) => ({
//   capacity: 40,
//   name: "Nissan Leaf 2022 - Red",
//   id: `EV${index + 1}`,
//   dischargeRate: 10,
//   totalDegradation: 0,
//   initialDegradation: 0,
//   degradationCoefficient: 0.0008532,
//   isAvailable: true,
// }));

const startingDegradation = evs.reduce(
  (acc, ev) => acc + ev.totalDegradation + ev.initialDegradation,
  0
);

const charging_spots = 20;

const maximumDOD = 0.8;

const selectMaximumDOD = (ev, totalAvailable) => {
  return Math.floor(Math.min(totalAvailable, ev.capacity * maximumDOD));
};

const calculateCycleNumber = (ev, totalUsed) => {
  return Math.ceil(totalUsed / ev.capacity);
};

console.log("Starting Degradation", startingDegradation, "%");

const selectEVs = (
  cars,
  totalRequired,
  totalTime,
  chargingSpots,
  maximumDOD
) => {
  const selectedEvs = [];
  /* Sort EV by proposed degradation */
  const remaningEvs = cars
    .map((ev) => {
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
    })
    .sort((a, b) => a.totalDegradation - b.totalDegradation);
  /* END Sort */

  let totalAvaialbleEnergy = 0;

  /* Select EVs by degradation */
  while (
    totalAvaialbleEnergy < totalRequired &&
    remaningEvs.length > 0 &&
    selectedEvs.length < chargingSpots
  ) {
    const chosenEV = remaningEvs.shift();
    selectedEvs.push(chosenEV);
    totalAvaialbleEnergy += chosenEV?.maxContribution || 0;
  }
  /* Select EVs by degradation */

  /* Optimize EVs to match total required energy */
  while (totalAvaialbleEnergy < totalRequired && remaningEvs.length > 0) {
    const sortedSelectedEvs = selectedEvs.sort(
      (a, b) => a.maxContribution - b.maxContribution
    );

    const nextBetterEV = remaningEvs.shift();
    const lowestContributor = sortedSelectedEvs[0];

    selectedEvs.splice(
      selectedEvs.findIndex((ev) => ev?.id === lowestContributor.id),
      1
    );

    selectedEvs.push(nextBetterEV);
    totalAvaialbleEnergy = selectedEvs.reduce(
      (acc, ev) => acc + ev?.maxContribution || 0,
      0
    );
  }
  /* END */

  return { selectedEvs, totalAvaialbleEnergy };
};

drEvents.forEach((element, index) => {
  const { selectedEvs } = selectEVs(
    evs,
    element.demand,
    element.timeInHrs,
    charging_spots,
    0.8 // Maximum DOD
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

console.table(evs);

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
  // evs.filter((ev) => ev.totalDegradation > 0).length
);

console.log(
  "Total DR Degradation",
  evs.reduce((acc, ev) => acc + ev.totalDegradation, 0),
  "%"
);
