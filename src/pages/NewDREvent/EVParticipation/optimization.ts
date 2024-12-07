import { Car } from "../../../context/interfaces";

// const charging_spots = 10;

// const maximumDOD = 0.8;

const selectMaximumDOD = (
  ev: Car,
  totalAvailable: number,
  maximumDOD: number
) => {
  return Math.floor(Math.min(totalAvailable, ev.capacity * maximumDOD));
};

// console.log(
//   "Starting Degradation",
//   evs.reduce((acc, ev) => acc + ev.totalDegradation, 0),
//   "%"
// );

export const selectEVs = (
  cars: Car[],
  totalRequired: number,
  totalTime: number,
  chargingSpots: number,
  maximumDOD: number
) => {
  const selectedEvs = [];
  /* Sort EV by proposed degradation */
  let remaningEvs = cars
    .map((ev) => {
      const maxContribution = selectMaximumDOD(
        ev,
        ev.dischargeRate * totalTime,
        maximumDOD,
        ev.soc
      );

      return {
        ...ev,
        maxContribution,
        totalDegradation:
          ev.initialDegradation +
          ev.totalDegradation +
          Number(ev.degradationCoefficient * maxContribution),
        currentDegradation: Number(ev.degradationCoefficient * maxContribution),
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

  let removedEVs = [];

  /* Optimize EVs to match total required energy */
  while (totalAvaialbleEnergy < totalRequired && remaningEvs.length > 0) {
    const sortedSelectedEvs = selectedEvs.sort(
      (a, b) => a.maxContribution - b.maxContribution
    );

    const lowestContributor = sortedSelectedEvs[0];

    // Add lower contributions from remaining list to removed list
    removedEVs = [
      ...remaningEvs,
      ...remaningEvs.filter(
        (ev) => ev.maxContribution <= lowestContributor.maxContribution
      ),
    ];

    // remove lower contributions from remaining list
    remaningEvs = remaningEvs.filter(
      (ev) => ev.maxContribution > lowestContributor.maxContribution
    );

    const nextBetterEV = remaningEvs.shift();

    // Add removed lowest contribution
    removedEVs = [
      ...remaningEvs,
      ...selectedEvs.splice(
        selectedEvs.findIndex((ev) => ev?.id === lowestContributor.id),
        1
      ),
    ];

    selectedEvs.push(nextBetterEV);
    totalAvaialbleEnergy = selectedEvs.reduce(
      (acc, ev) => acc + ev?.maxContribution || 0,
      0
    );
  }
  /* END */

  /* Optimize Charging spots to meet demand because of SOC */
  const chargers = selectedEvs
    .map((ev) => ({
      evs: [ev],
      totalTimeLeft: Number(
        (totalTime - Number(ev?.maxContribution / ev?.dischargeRate)).toFixed(2)
      ),
    }))
    .sort((a, b) => a.totalTimeLeft - b.totalTimeLeft);

  chargers.forEach((charger) => {
    if (totalAvaialbleEnergy < totalRequired && removedEVs.length > 0) {
      const sortedRemovedEvs = removedEVs
        .map((ev) => {
          const maxContribution = selectMaximumDOD(
            ev,
            ev.dischargeRate * charger.totalTimeLeft,
            maximumDOD,
            ev.soc
          );

          return {
            ...ev,
            maxContribution,
            totalDegradation:
              ev.initialDegradation +
              ev.totalDegradation +
              Number(ev.degradationCoefficient * maxContribution),
            currentDegradation: Number(
              ev.degradationCoefficient * maxContribution
            ),
          };
        })
        .sort((a, b) => a.totalDegradation - b.totalDegradation);

      const chosenEV = sortedRemovedEvs[0];

      charger.evs.push(chosenEV);

      totalAvaialbleEnergy += chosenEV.maxContribution;

      removedEVs.splice(
        removedEVs.findIndex((ev) => ev?.id === chosenEV.id),
        1
      );
    }
  });

  // TODO: Flatten to make sure bigger EVs are chosen to fill the gap of low SOCs

  return { selectedEvs, totalAvaialbleEnergy, chargers };
};

// export const selectEVs = (
//   cars: Car[],
//   totalRequired: number,
//   totalTime: number,
//   chargingSpots: number,
//   maximumDOD: number
// ) => {
//   const selectedEvs = [];
//   /* Sort EV by proposed degradation */
//   const remaningEvs = cars
//     .map((ev: Car) => {
//       return {
//         ...ev,
//         maxContribution: selectMaximumDOD(
//           ev,
//           ev.dischargeRate * totalTime,
//           maximumDOD
//         ),
//         totalDegradation:
//           ev.initialDegradation +
//           ev.totalDegradation +
//           Number(
//             ev.degradationCoefficient *
//               selectMaximumDOD(ev, ev.dischargeRate * totalTime, maximumDOD)
//           ),
//         currentDegradation: Number(
//           ev.degradationCoefficient *
//             selectMaximumDOD(ev, ev.dischargeRate * totalTime, maximumDOD)
//         ),
//       };
//     })
//     .sort((a, b) => a.totalDegradation - b.totalDegradation);
//   /* END Sort */

//   let totalAvaialbleEnergy = 0;

//   /* Select EVs by degradation */
//   while (
//     totalAvaialbleEnergy < totalRequired &&
//     remaningEvs.length > 0 &&
//     selectedEvs.length < chargingSpots
//   ) {
//     const chosenEV = remaningEvs.shift();
//     selectedEvs.push(chosenEV);
//     totalAvaialbleEnergy += chosenEV?.maxContribution || 0;
//   }
//   /* Select EVs by degradation */

//   /* Optimize EVs to match total required energy */
//   while (totalAvaialbleEnergy < totalRequired && remaningEvs.length > 0) {
//     const sortedSelectedEvs = selectedEvs.sort(
//       (a, b) => a.maxContribution - b.maxContribution
//     );

//     const nextBetterEV = remaningEvs.shift();
//     const lowestContributor = sortedSelectedEvs[0];

//     selectedEvs.splice(
//       selectedEvs.findIndex((ev) => ev?.name === lowestContributor.name),
//       1
//     );

//     selectedEvs.push(nextBetterEV);
//     totalAvaialbleEnergy = selectedEvs.reduce(
//       (acc, ev) => acc + ev?.maxContribution || 0,
//       0
//     );
//   }
//   /* END */

//   return { selectedEvs, totalAvaialbleEnergy };
// };

// drEvents.forEach((element, index) => {
//   const selectedEvs = selectEVs(
//     element.demand,
//     element.timeInHrs,
//     charging_spots
//   );

//   console.table(selectedEvs);

//   // Update each EV selected Degradation in the original EV dataset
//   selectedEvs.forEach((ev) => {
//     evs.find((evData) => evData.name === ev.name).totalDegradation =
//       ev.totalDegradation;
//   });

//   console.log(
//     "Total Avaialble capacity of event",
//     index + 1,
//     ": ",
//     selectedEvs.reduce((acc, ev) => acc + ev.maxContribution, 0),
//     "kWh out of",
//     element.demand,
//     "\n\n"
//   );
// });

// console.table(evs);
// console.log(
//   "Ending Degradation",
//   evs.reduce((acc, ev) => acc + ev.totalDegradation, 0)
//   // evs.filter((ev) => ev.totalDegradation > 0).length
// );
