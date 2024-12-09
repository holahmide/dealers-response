import { describe } from "vitest";
import { screen, render } from "../../test/test-utils";
import DREventsComponent from "./Component";

describe("DREventsComponent", () => {
  it("renders a message when no events are present", () => {
    const mockEvents: any = [];
    render(<DREventsComponent events={mockEvents} />);

    expect(screen.getByText("DR Events")).toBeInTheDocument();
    expect(
      screen.getByText(/no events recorded\. create event/i) // case-insensitive match
    ).toBeInTheDocument();
    expect(screen.getByText("here")).toHaveAttribute("href", "/events/create");
  });

  it("renders a list of events when events are present", () => {
    const mockEvents = [
      {
        totalAvailable: 330,
        event: {
          demand: 400,
          timeInHrs: 3,
          participationPayment: 2,
          capacityPayment: 208,
          maxDOD: 0.8,
          chargePoints: 10,
        },
        chargers: [{ evs: [] }],
      },
      {
        totalAvailable: 400,
        event: {
          demand: 400,
          timeInHrs: 3,
          participationPayment: 2,
          capacityPayment: 208,
          maxDOD: 0.8,
          chargePoints: 10,
        },
        chargers: [{ evs: [] }],
      },
    ];

    render(<DREventsComponent events={mockEvents} />);

    const evParticipations = screen.getByLabelText("ev-participation");

    expect(evParticipations.childElementCount).toBe(2);
  });
});
