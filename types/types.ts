export interface BaseObject {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  name?: string;
}

export interface ModelObject extends BaseObject {
  type: "model";
  url: string;
}

export interface ImageObject extends BaseObject {
  type: "image";
  url: string;
}

export interface VideoObject extends BaseObject {
  type: "video";
  url: string;
}

export interface AudioObject extends BaseObject {
  type: "audio";
  url: string;
}

export type ObjectType = ModelObject | ImageObject | VideoObject | AudioObject;