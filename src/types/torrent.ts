const ActionType = {
  Detail: 0,
  Delete: 1,
  Start: 2,
  Stop: 3,
} as const;

export type ActionTypeEnum = typeof ActionType[keyof typeof ActionType];

export { ActionType };
