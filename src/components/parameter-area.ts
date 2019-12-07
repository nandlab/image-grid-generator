import p5 from "p5";
import * as TextArea from "../dom/text-area";
import * as Settings from "./settings";
import * as Parameters from "../parameters";

export interface Unit {
  readonly element: p5.Element;
  contentText: string;
  parameters: Parameters.Unit;
  monitorIntervalId?: NodeJS.Timeout;
}

type Listeners = {
  onChange: (area: Unit) => void;
  onMouseEnter: (area: Unit) => void;
  onMouseLeave: (area: Unit) => void;
};

const returnVoid = () => {};
const defaultListeners: Listeners = {
  onChange: returnVoid,
  onMouseEnter: returnVoid,
  onMouseLeave: returnVoid
};

export const create = (listeners: {
  onChange?: (area: Unit) => void;
  onMouseEnter?: (area: Unit) => void;
  onMouseLeave?: (area: Unit) => void;
}): Unit => {
  const { onChange, onMouseEnter, onMouseLeave } = Object.assign(
    Object.create(defaultListeners),
    listeners
  );

  const element = TextArea.create({
    position: Settings.parameterAreaPosition,
    size: Settings.parameterAreaSize,
    initialValue: Parameters.defaultString
  });

  const unit: Unit = {
    element,
    contentText: Parameters.defaultString,
    parameters: Parameters.defaultValues,
    monitorIntervalId: undefined
  };

  const monitorChange = () => {
    const currentText = element.value().toString();
    if (currentText === unit.contentText) return;

    unit.contentText = currentText;
    unit.parameters = Parameters.parse(currentText);

    onChange(unit);
  };

  element.elt.addEventListener("focus", () => {
    unit.monitorIntervalId = setInterval(monitorChange, 100);
  });
  element.elt.addEventListener("blur", () => {
    const { monitorIntervalId } = unit;
    if (monitorIntervalId) {
      clearInterval(monitorIntervalId);
      unit.monitorIntervalId = undefined;
    }
  });

  element.elt.addEventListener(
    "mouseenter",
    onMouseEnter.bind(undefined, unit)
  );
  element.elt.addEventListener(
    "mouseleave",
    onMouseLeave.bind(undefined, unit)
  );

  return unit;
};