# EV Selection Optimization

This project simulates and evaluates the selection of electric vehicles (EVs) for demand response (DR) events. Two versions of the program are included:

- **Optimized EV Selection**: Minimizes degradation for the selected EVs while meeting energy demands.
- **Non-Optimized EV Selection**: Randomly selects EVs without prioritizing degradation factors.

## Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

## Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/holahmide/dealers-response.git
   cd dealers-response/simulation-analysis
   ```

2. Ensure that `evs.json` and `events.json` files are present in the simulation-analysis folder. These files provide the necessary data for EVs and DR events.

   - **evs.json**: Contains details of EVs, such as capacity, degradation coefficients, and initial degradation.
   - **events.json**: Defines DR events, including demand and duration.

## Running the Code

### Optimized EV Selection

Run the optimized EV selection script:

```bash
node optimization.js
```

### Non-Optimized EV Selection

Run the non-optimized EV selection script:

```bash
node no-optimization.js
```

## Output

Both scripts produce the following outputs:

- Details of selected EVs for each DR event.
- Final degradation metrics for all EVs.
- Total available capacity for each DR event compared to the demand.
- Starting degradation percentage.
- Ending degradation percentage.
- Total DR degradation.

## Project Structure

- **optimization.js**: Script implementing the optimized EV selection algorithm.
- **no-optimization.js**: Script for random EV selection without optimization.
- **evs.json**: Dataset for EV details.
- **events.json**: Dataset for DR events.

## Example `evs.json`

```json
[
  {
    "id": 1,
    "capacity": 50,
    "dischargeRate": 10,
    "degradationCoefficient": 0.001,
    "initialDegradation": 0.5,
    "totalDegradation": 0
  }
]
```

## Example `events.json`

```json
[
  {
    "demand": 100,
    "timeInHrs": 5
  }
]
```
