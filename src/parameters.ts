export type Unit = {
  readonly width: number;
  readonly height: number;
  readonly columns: number;
  readonly rows: number;
  readonly outerMargin: {
    readonly top: number;
    readonly bottom: number;
    readonly left: number;
    readonly right: number;
  };
};

export const defaultValues: Unit = {
  width: 800,
  height: 800,
  columns: 2,
  rows: 2,
  outerMargin: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
};

export const defaultString = JSON.stringify(defaultValues, undefined, 2);

const reviver = (key: string, value: any) =>
  key === "" ||
  (typeof value === "object" && !Array.isArray(value)) ||
  Number.isFinite(value)
    ? value
    : undefined;

const validateNumber = (value: any, defaultValue: number) =>
  Number.isFinite(value) ? value : defaultValue;

export const parse = (jsonString: string): Unit => {
  const parsed = JSON.parse(jsonString, reviver);

  const width = validateNumber(parsed.width, defaultValues.width);
  const height = validateNumber(parsed.height, defaultValues.height);
  const columns = validateNumber(parsed.columns, defaultValues.columns);
  const rows = validateNumber(parsed.rows, defaultValues.rows);

  const parsedOuterMargin = parsed.outerMargin;
  const defaultOuterMargin = defaultValues.outerMargin;
  const outerMargin = {
    top: validateNumber(parsedOuterMargin.top, defaultOuterMargin.top),
    bottom: validateNumber(parsedOuterMargin.bottom, defaultOuterMargin.bottom),
    left: validateNumber(parsedOuterMargin.left, defaultOuterMargin.left),
    right: validateNumber(parsedOuterMargin.right, defaultOuterMargin.right)
  };

  return { width, height, columns, rows, outerMargin };
};
