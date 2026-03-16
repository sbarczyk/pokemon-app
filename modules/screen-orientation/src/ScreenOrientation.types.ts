export type ChangeEventPayload = {
  orientation: string;
};

export type ScreenOrientationModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};