import { describe, it, expect } from "vitest";
import {
  selectMaximumDOD,
  sortEVsByDegradation,
  computeTotalEnergy,
  replaceLowestContributor,
  optimizeEVUtilization,
  allocateChargers,
  selectEVs,
} from "./optimization";
import { Car } from "../../../context/interfaces";

describe("EV Utility Functions", () => {
  const mockEVs: Car[] = [
    {
      id: "EV1",
      capacity: 50,
      dischargeRate: 10,
      soc: 80,
      degradationCoefficient: 0.01,
      initialDegradation: 5,
      totalDegradation: 0,
      maxContribution: 0,
      name: "EV 1",
      isAvailable: true,
    },
    {
      id: "EV2",
      capacity: 60,
      dischargeRate: 15,
      soc: 70,
      degradationCoefficient: 0.02,
      initialDegradation: 4,
      totalDegradation: 0,
      maxContribution: 0,
      name: "EV 1",
      isAvailable: true,
    },
  ];

  const mockEvent = {
    demand: 100,
    timeInHrs: 5,
  };

  const maximumAllowableDOD = 0.8;

  it("selectMaximumDOD should calculate the maximum energy contribution correctly", () => {
    const ev = mockEVs[0];
    const totalExpectedEnergy = ev.capacity * mockEvent.timeInHrs;
    const result = selectMaximumDOD(
      mockEVs[0],
      totalExpectedEnergy,
      maximumAllowableDOD,
      ev.soc
    );
    expect(result).toBe(30);
  });

  it("sortEVsByDegradation should correctly sort EVs by degradation", () => {
    const result = sortEVsByDegradation(
      mockEVs,
      mockEvent.timeInHrs,
      maximumAllowableDOD
    );
    expect(result[0].id).toBe("EV2");
    expect(result[1].id).toBe("EV1");
  });

  it("computeTotalEnergy should calculate total energy of selected EVs", () => {
    const selectedEvs = mockEVs.map((ev) => ({ ...ev, maxContribution: 20 }));
    const result = computeTotalEnergy(selectedEvs);
    expect(result).toBe(40);
  });

  it("replaceLowestContributor should replace the lowest contributor correctly", () => {
    const selectedEvs = [{ ...mockEVs[0], maxContribution: 20 }];
    const remainingEvs = [{ ...mockEVs[1], maxContribution: 30 }];
    const removedEVs: Car[] = [];
    const result = replaceLowestContributor(
      selectedEvs,
      remainingEvs,
      removedEVs
    );
    expect(result.selectedEvs[0].id).toBe("EV2");
    expect(result.removedEVs[0].id).toBe("EV1");
  });

  it("optimizeEVUtilization should optimize EV selection to meet the required energy", () => {
    const selectedEvs = [{ ...mockEVs[0], maxContribution: 20 }];
    const remainingEvs = [{ ...mockEVs[1], maxContribution: 30 }];
    const removedEVs: Car[] = [];
    const totalRequired = 50;
    const totalAvailableEnergy = 20;
    const result = optimizeEVUtilization(
      selectedEvs,
      remainingEvs,
      removedEVs,
      totalRequired,
      totalAvailableEnergy
    );
    expect(result.selectedEvs.length).toBe(1);
    expect(result.totalAvailableEnergy).toBe(30);
  });

  it("allocateChargers should allocate chargers correctly and utilize more EVs if needed", () => {
    const selectedEvs = [{ ...mockEVs[0], maxContribution: 20 }];
    const removedEVs = [{ ...mockEVs[1], maxContribution: 30 }];
    const totalRequired = 50;
    const totalTimeInHrs = 5;
    const totalAvailableEnergy = 20;

    const result = allocateChargers(
      selectedEvs,
      removedEVs,
      totalRequired,
      totalTimeInHrs,
      maximumAllowableDOD,
      totalAvailableEnergy
    );
    expect(result.chargers[0].evs.length).toBeGreaterThan(1);
  });

  it("selectEVs should return the selected EVs and allocated chargers", () => {
    const totalRequired = 50;
    const totalTimeInHrs = 5;
    const chargePoints = 2;
    const result = selectEVs(
      mockEVs,
      totalRequired,
      totalTimeInHrs,
      chargePoints,
      maximumAllowableDOD
    );
    expect(result.selectedEvs.length).toBeGreaterThan(0);
    expect(result.chargers.length).toBeGreaterThan(0);
    expect(result.totalAvailableEnergy).toBeGreaterThan(0);
  });
});
