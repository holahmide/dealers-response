import { Car } from "../interfaces";

export const validateJson = (dataArray: any) => {
  const requiredFields = [
    "capacity",
    "name",
    "id",
    "dischargeRate",
    "initialDegradation",
    "degradationCoefficient",
    "soc",
    "isAvailable",
  ];

  const errors: string[] = [];

  dataArray.forEach((obj: Record<any, any>, index: number) => {
    requiredFields.forEach((field) => {
      if (!(field in obj)) {
        errors.push(
          `Error: Field '${field}' is missing in object at index ${index}`
        );
      }
    });
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    message: "All objects are valid.",
  };
};

export const searchCars = (dataArray: Car[], searchString: string) => {
  if (!searchString) return dataArray;
  // Convert the search string to lowercase for case-insensitive comparison
  const lowerSearchString = searchString.toLowerCase();

  const results = dataArray.filter(
    (obj) =>
      obj.name.toLowerCase().includes(lowerSearchString) ||
      obj.id.toLowerCase().includes(lowerSearchString)
  );

  return results;
};
