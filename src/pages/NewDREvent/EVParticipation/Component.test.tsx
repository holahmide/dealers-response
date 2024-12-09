import { fireEvent, render, screen } from "../../../test/test-utils";
import { vi, expect } from "vitest";
import EVParticipationComponent from "./Component";

describe("EVParticipation Component", () => {
  const mockNavigate = vi.fn();
  const mockRecordEvent = vi.fn();

  it("renders the participation estimate correctly", () => {
    const mockEvent = {
      demand: 500,
      timeInHrs: 2,
      participationPayment: 0.5,
      capacityPayment: 0.2,
      maxDOD: 80,
      chargePoints: 4,
    };

    const mockChargers = [
      {
        evs: [
          {
            name: "Car 1",
            id: "1",
            capacity: 50,
            dischargeRate: 10,
            initialDegradation: 0.1,
            totalDegradation: 0.2,
            degradationCoefficient: 0.05,
            isAvailable: true,
            soc: 80,
            maxContribution: 40,
            currentDegradation: 0.02,
          },
        ],
      },
    ];

    render(
      <EVParticipationComponent
        chargers={mockChargers}
        totalAvailable={450}
        event={mockEvent}
        isNewRecord={true}
        timestamp={"2024-12-07T12:00:00Z"}
        recordEvent={mockRecordEvent}
        navigate={mockNavigate}
      />
    );

    expect(screen.getByText("Participation Estimate 📈")).toBeInTheDocument();

    expect(
      screen.getByText(/Required Capacity: 500 kWhr/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/450/i)).toBeInTheDocument();

    expect(screen.getByText(/0.02000 %/i)).toBeInTheDocument();
  });

  it("calls recordEvent and navigates when button is clicked", () => {
    const mockEvent = {
      demand: 500,
      timeInHrs: 2,
      participationPayment: 0.5,
      capacityPayment: 0.2,
      maxDOD: 80,
      chargePoints: 4,
    };

    const mockChargers = [
      {
        evs: [
          {
            name: "Car 1",
            id: "1",
            capacity: 50,
            dischargeRate: 10,
            initialDegradation: 0.1,
            totalDegradation: 0.2,
            degradationCoefficient: 0.05,
            isAvailable: true,
            soc: 80,
            maxContribution: 40,
            currentDegradation: 0.02,
          },
        ],
      },
    ];

    render(
      <EVParticipationComponent
        chargers={mockChargers}
        totalAvailable={450}
        event={mockEvent}
        isNewRecord={true}
        timestamp={"2024-12-07T12:00:00Z"}
        recordEvent={mockRecordEvent}
        navigate={mockNavigate}
      />
    );

    const button = screen.getByRole("button", {
      name: /Accept Selection & Record/i,
    });

    fireEvent.click(button);

    expect(mockRecordEvent).toHaveBeenCalledWith({
      event: mockEvent,
      chargers: mockChargers,
      totalAvailable: 450,
    });

    expect(mockNavigate).toHaveBeenCalledWith("/events");
  });
});
