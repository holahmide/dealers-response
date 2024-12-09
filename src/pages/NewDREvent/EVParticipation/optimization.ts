import { Car } from "../../../context/interfaces";

export const selectMaximumDOD = (
  ev: Car,
  totalAvailable: number,
  maximumDOD: number,
  soc: number
) => {
  // SOC Available - Minimum SOC allowed
  const socAvailable = soc / 100 - (1 - maximumDOD);

  if (socAvailable <= 0) return 0;

  return Math.floor(Math.min(totalAvailable, ev.capacity * socAvailable));
};

// Utility function to compute and sort EV degradation
export const sortEVsByDegradation = (
  cars: Car[],
  totalTime: number,
  maximumDOD: number
): Car[] => {
  const calculateCycleNumber = (ev: Car, totalUsed: number) => {
    return totalUsed / ev.capacity;
  };

  return cars
    .map((ev) => {
      const totalUsedKwh = selectMaximumDOD(
        ev,
        ev.dischargeRate * totalTime,
        maximumDOD,
        ev.soc
      );
      const cycleNumber = calculateCycleNumber(ev, totalUsedKwh);
      const newDegradation =
        ev.degradationCoefficient * cycleNumber * totalUsedKwh;

      return {
        ...ev,
        maxContribution: totalUsedKwh,
        totalDegradation:
          ev.initialDegradation + ev.totalDegradation + newDegradation,
        currentDegradation: newDegradation,
      };
    })
    .sort((a, b) => a.totalDegradation - b.totalDegradation);
};

// Utility function to compute the total available energy of selected EVs
export const computeTotalEnergy = (evs: Car[]) => {
  return evs.reduce((acc, ev) => acc + (ev?.maxContribution || 0), 0);
};

// Function to replace the lowest contributing EV with a better alternative
export const replaceLowestContributor = (
  selectedEvs: Car[],
  remainingEvs: Car[],
  removedEVs: Car[]
) => {
  const sortedSelectedEvs = selectedEvs.sort(
    (a, b) => a.maxContribution - b.maxContribution
  );
  const lowestContributor = sortedSelectedEvs[0];

  removedEVs.push(
    ...remainingEvs.filter(
      (ev) => ev.maxContribution <= lowestContributor.maxContribution
    )
  );
  remainingEvs = remainingEvs.filter(
    (ev) => ev.maxContribution > lowestContributor.maxContribution
  );

  if (remainingEvs.length > 0) {
    const nextBetterEV = remainingEvs.shift();

    removedEVs.push(
      ...selectedEvs.splice(
        selectedEvs.findIndex((ev) => ev?.id === lowestContributor.id),
        1
      )
    );

    if (nextBetterEV) selectedEvs.push(nextBetterEV);
  }

  return { selectedEvs, remainingEvs, removedEVs };
};

// Function to optimize EVs to meet total required energy
export const optimizeEVUtilization = (
  selectedEvs: Car[],
  remainingEvs: Car[],
  removedEVs: Car[],
  totalRequired: number,
  totalAvailableEnergy: number
) => {
  /* Optimize EV selection to meet required demand - by replacing lowest contributors with EV that will contribute more */
  while (totalAvailableEnergy < totalRequired && remainingEvs.length > 0) {
    const result = replaceLowestContributor(
      selectedEvs,
      remainingEvs,
      removedEVs
    );
    selectedEvs = result.selectedEvs;
    remainingEvs = result.remainingEvs;
    removedEVs = result.removedEVs;
    totalAvailableEnergy = computeTotalEnergy(selectedEvs);
  }
  return { selectedEvs, remainingEvs, removedEVs, totalAvailableEnergy };
};

// Function to allocate chargers and optimize energy contribution
export const allocateChargers = (
  selectedEvs: Car[],
  removedEVs: Car[],
  totalRequired: number,
  totalTime: number,
  maximumDOD: number,
  totalAvailableEnergy: number
) => {
  const chargers = selectedEvs
    .map((ev) => ({
      evs: [ev],
      totalTimeLeft: Number(
        (totalTime - ev.maxContribution / ev.dischargeRate).toFixed(2)
      ),
    }))
    .sort((a, b) => a.totalTimeLeft - b.totalTimeLeft);

  chargers.forEach((charger) => {
    if (
      totalAvailableEnergy < totalRequired &&
      removedEVs.length > 0 &&
      charger.totalTimeLeft > 0
    ) {
      const sortedRemovedEvs = sortEVsByDegradation(
        removedEVs,
        charger.totalTimeLeft,
        maximumDOD
      );

      const chosenEV = sortedRemovedEvs[0];
      charger.evs.push(chosenEV);
      totalAvailableEnergy += chosenEV.maxContribution;

      removedEVs.splice(
        removedEVs.findIndex((ev) => ev?.id === chosenEV.id),
        1
      );
    }
  });

  return { totalAvailableEnergy, chargers };
};

// Main function to select EVs
export const selectEVs = (
  cars: Car[],
  totalRequired: number,
  totalTime: number,
  chargingSpots: number,
  maximumDOD: number
) => {
  let selectedEvs = [];
  let remainingEvs = sortEVsByDegradation(cars, totalTime, maximumDOD);
  let totalAvailableEnergy = 0;

  /* Select EVs based on degradation */
  while (
    totalAvailableEnergy < totalRequired &&
    remainingEvs.length > 0 &&
    selectedEvs.length < chargingSpots
  ) {
    const chosenEV = remainingEvs.shift();
    if (chosenEV) selectedEvs.push(chosenEV);
    totalAvailableEnergy += chosenEV?.maxContribution || 0;
  }

  /* Optimize EV selection to meet required demand - by replacing lowest contributors with EV that will contribute more */
  let removedEVs: Car[] = [];
  const optimizationResult = optimizeEVUtilization(
    selectedEvs,
    remainingEvs,
    removedEVs,
    totalRequired,
    totalAvailableEnergy
  );

  selectedEvs = optimizationResult.selectedEvs;
  remainingEvs = optimizationResult.remainingEvs;
  removedEVs = optimizationResult.removedEVs;
  totalAvailableEnergy = optimizationResult.totalAvailableEnergy;

  // Allocate EVs to chargers and utilize any more time left to place other EVs
  const { chargers, totalAvailableEnergy: newTotalAvailableEnergy } =
    allocateChargers(
      selectedEvs,
      removedEVs,
      totalRequired,
      totalTime,
      maximumDOD,
      totalAvailableEnergy
    );

  return {
    selectedEvs,
    totalAvailableEnergy: newTotalAvailableEnergy,
    chargers,
  };
};
