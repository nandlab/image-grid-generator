import p5 from "p5";
import { Position, RectangleSize } from "./types";
import * as DomUtility from "./dom-utility";
import * as ImgElement from "./img-element";

export interface Unit {
  readonly position: Position;
  size: RectangleSize;
  columns: number;
  cellSize: RectangleSize;
  readonly elements: p5.Element[];
}

export const create = (parameters: {
  position: Position;
  size: RectangleSize;
  columns: number;
}): Unit => {
  const { position, size, columns } = parameters;
  const cellWidth = size.width / columns;

  return {
    position,
    size,
    columns,
    cellSize: { width: cellWidth, height: cellWidth },
    elements: []
  };
};

const setElement = (
  element: p5.Element,
  index: number,
  areaPosition: Position,
  columns: number,
  cellSize: RectangleSize
) => {
  const row = Math.floor(index / columns);
  const column = index % columns;
  const boxPosition = {
    x: areaPosition.x + cellSize.width * column,
    y: areaPosition.y + cellSize.height * row
  };
  DomUtility.setInBox(element, boxPosition, cellSize);
};

export const changeColumnCount = (area: Unit, columns: number) => {
  const { position: areaPosition, cellSize, elements } = area;
  area.columns = columns;

  for (let index = 0; index < elements.length; index += 1)
    setElement(elements[index], index, areaPosition, columns, cellSize);

  return area;
};

const onLoad = (area: Unit, thumbnail: p5.Element) => {
  setElement(
    thumbnail,
    area.elements.length,
    area.position,
    area.columns,
    area.cellSize
  );

  area.elements.push(thumbnail);
};

export const add = (
  area: Unit,
  file: p5.File,
  onComplete: (img: p5.Element, file: p5.File) => void
) => {
  if (file.type !== "image") {
    console.warn(`Dropped file that is not an image:`, file);
    return;
  }

  ImgElement.create({
    file,
    alt: file.name,
    onLoad: (img, file) => {
      onLoad(area, img);
      onComplete(img, file);
    }
  });
};