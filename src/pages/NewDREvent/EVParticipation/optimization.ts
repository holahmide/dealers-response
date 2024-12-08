import { Car } from "../../../context/interfaces";

interface EV extends Car {
  maxContribution: number;
  totalDegradation: number;
  currentDegradation: number;
}

const selectMaximumDOD = (
  ev: EV,
  totalAvailable: number,
  maximumDOD: number,
  soc: number
) => {
  const socAvailable = soc / 100 - (1 - maximumDOD);

  if (socAvailable <= 0) return 0;

  return Math.floor(Math.min(totalAvailable, ev.capacity * socAvailable));
};

const calculateCycleNumber = (ev: EV, totalUsed: number) => {
  return Math.ceil(totalUsed / ev.capacity);
};

const computeEvsDegradation = (
  cars: EV[],
  totalTime: number,
  maximumDOD: number
) => {
  return cars.map((ev) => {
    const totalUsedKwh = selectMaximumDOD(
      ev,
      ev.dischargeRate * totalTime,
      maximumDOD,
      ev.soc
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
};

export const selectEVs = (
  cars: EV[],
  totalRequired: number,
  totalTime: number,
  chargingSpots: number,
  maximumDOD: number
) => {
  const selectedEvs: EV[] = [];

  /* Sort EV by proposed degradation */
  let remaningEvs = computeEvsDegradation(cars, totalTime, maximumDOD).sort(
    (a, b) => a.totalDegradation - b.totalDegradation
  );
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
  /* END Select EVs by degradation */

  let removedEVs: EV[] = [];

  /* Optimize EVs to match total required energy */
  while (totalAvaialbleEnergy < totalRequired && remaningEvs.length > 0) {
    const sortedSelectedEvs = selectedEvs.sort(
      (a, b) => a.maxContribution - b.maxContribution
    );

    const lowestContributor = sortedSelectedEvs[0];

    // Add lower contributions from remaining list to removed list
    removedEVs = [
      ...removedEVs,
      ...remaningEvs.filter(
        (ev) => ev.maxContribution <= lowestContributor.maxContribution
      ),
    ];

    // remove lower contributions from remaining list
    remaningEvs = remaningEvs.filter(
      (ev) => ev.maxContribution > lowestContributor.maxContribution
    );

    if (remaningEvs.length > 0) {
      const nextBetterEV = remaningEvs.shift();

      // Add removed lowest contribution
      removedEVs = [
        ...removedEVs,
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
    if (
      totalAvaialbleEnergy < totalRequired &&
      removedEVs.length > 0 &&
      charger.totalTimeLeft > 0
    ) {
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
