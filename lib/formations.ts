import { Formation } from "@/hooks/useFormation";

export const FORMATIONS = {
  "4-3-3": [
    "GK","LB","CB1","CB2","RB",
    "CDM1","CDM2",
    "CAM",
    "LW","ST","RW",
  ],

  "4-2-3-1": [
    "GK","LB","CB1","CB2","RB",
    "CDM1","CDM2",
    "LAM","CAM","RAM",
    "ST",
  ],

  "4-4-2": [
    "GK","LB","CB1","CB2","RB",
    "LM","CM1","CM2","RM",
    "ST1","ST2",
  ],

  "3-5-2": [
    "GK",
    "LCB","CB","RCB",
    "LWB","CM1","CM2","CAM","RWB",
    "ST1","ST2",
  ],
};

export const FORMATION_POSITIONS: Record<
  Formation,
  Record<string, { top: string; left: string }>
> = {

  "4-3-3": {

    ST: { top: "8%", left: "50%" },

    LW: { top: "24%", left: "18%" },
    RW: { top: "24%", left: "82%" },

    CAM: { top: "40%", left: "50%" },

    CDM1: { top: "56%", left: "34%" },
    CDM2: { top: "56%", left: "66%" },

    LB: { top: "73%", left: "14%" },
    CB1: { top: "78%", left: "38%" },
    CB2: { top: "78%", left: "62%" },
    RB: { top: "73%", left: "86%" },

    GK: { top: "92%", left: "50%" },
  },

  "4-2-3-1": {

    ST: { top: "8%", left: "50%" },

    LAM: { top: "25%", left: "22%" },
    CAM: { top: "25%", left: "50%" },
    RAM: { top: "25%", left: "78%" },

    CDM1: { top: "48%", left: "36%" },
    CDM2: { top: "48%", left: "64%" },

    LB: { top: "73%", left: "14%" },
    CB1: { top: "78%", left: "38%" },
    CB2: { top: "78%", left: "62%" },
    RB: { top: "73%", left: "86%" },

    GK: { top: "92%", left: "50%" },
  },

  "4-4-2": {

    ST1: { top: "10%", left: "40%" },
    ST2: { top: "10%", left: "60%" },

    LM: { top: "34%", left: "18%" },
    CM1: { top: "42%", left: "38%" },
    CM2: { top: "42%", left: "62%" },
    RM: { top: "34%", left: "82%" },

    LB: { top: "73%", left: "14%" },
    CB1: { top: "78%", left: "38%" },
    CB2: { top: "78%", left: "62%" },
    RB: { top: "73%", left: "86%" },

    GK: { top: "92%", left: "50%" },
  },

  "3-5-2": {

    ST1: { top: "10%", left: "40%" },
    ST2: { top: "10%", left: "60%" },

    CAM: { top: "28%", left: "50%" },

    CM1: { top: "46%", left: "36%" },
    CM2: { top: "46%", left: "64%" },

    LWB: { top: "46%", left: "12%" },
    RWB: { top: "46%", left: "88%" },

    LCB: { top: "76%", left: "28%" },
    CB: { top: "80%", left: "50%" },
    RCB: { top: "76%", left: "72%" },

    GK: { top: "92%", left: "50%" },
  },
};