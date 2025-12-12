import type {
  FormationConfig,
  PositionSlot,
  LineupSlotPlayer,
} from "@/types/build-xi";

/**
 * Formation configurations for the lineup builder
 *
 * Position grid uses a 5x5 coordinate system:
 * - Rows: 1 (GK) to 5 (Attackers)
 * - Cols: 1 (Left) to 5 (Right), with 3 being center
 */

// Helper to create position slots
const gk = (id = "gk"): PositionSlot => ({
  id,
  label: "GK",
  row: 1,
  col: 3,
  positionType: "goalkeeper",
});

const def = (
  id: string,
  label: string,
  col: number,
  row = 2,
): PositionSlot => ({
  id,
  label,
  row,
  col,
  positionType: "defender",
});

const mid = (
  id: string,
  label: string,
  col: number,
  row = 3,
): PositionSlot => ({
  id,
  label,
  row,
  col,
  positionType: "midfielder",
});

const att = (
  id: string,
  label: string,
  col: number,
  row = 4,
): PositionSlot => ({
  id,
  label,
  row,
  col,
  positionType: "attacker",
});

export const FORMATIONS: FormationConfig[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    positions: [
      gk(),
      def("lb", "LB", 1),
      def("cb1", "CB", 2),
      def("cb2", "CB", 4),
      def("rb", "RB", 5),
      mid("cm1", "CM", 2),
      mid("cm2", "CM", 3),
      mid("cm3", "CM", 4),
      att("lw", "LW", 1),
      att("st", "ST", 3),
      att("rw", "RW", 5),
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    positions: [
      gk(),
      def("lb", "LB", 1),
      def("cb1", "CB", 2),
      def("cb2", "CB", 4),
      def("rb", "RB", 5),
      mid("lm", "LM", 1),
      mid("cm1", "CM", 2),
      mid("cm2", "CM", 4),
      mid("rm", "RM", 5),
      att("st1", "ST", 2),
      att("st2", "ST", 4),
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    positions: [
      gk(),
      def("lb", "LB", 1),
      def("cb1", "CB", 2),
      def("cb2", "CB", 4),
      def("rb", "RB", 5),
      mid("dm1", "DM", 2, 3),
      mid("dm2", "DM", 4, 3),
      mid("lam", "LAM", 1, 4),
      mid("cam", "CAM", 3, 4),
      mid("ram", "RAM", 5, 4),
      att("st", "ST", 3, 5),
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    positions: [
      gk(),
      def("cb1", "CB", 2),
      def("cb2", "CB", 3),
      def("cb3", "CB", 4),
      mid("lwb", "LWB", 1),
      mid("cm1", "CM", 2),
      mid("cm2", "CM", 4),
      mid("rwb", "RWB", 5),
      att("lw", "LW", 1),
      att("st", "ST", 3),
      att("rw", "RW", 5),
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    positions: [
      gk(),
      def("cb1", "CB", 2),
      def("cb2", "CB", 3),
      def("cb3", "CB", 4),
      mid("lwb", "LWB", 1),
      mid("cm1", "CM", 2),
      mid("cm2", "CM", 3),
      mid("cm3", "CM", 4),
      mid("rwb", "RWB", 5),
      att("st1", "ST", 2),
      att("st2", "ST", 4),
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    positions: [
      gk(),
      def("lwb", "LWB", 1),
      def("cb1", "CB", 2),
      def("cb2", "CB", 3),
      def("cb3", "CB", 4),
      def("rwb", "RWB", 5),
      mid("cm1", "CM", 2),
      mid("cm2", "CM", 3),
      mid("cm3", "CM", 4),
      att("st1", "ST", 2),
      att("st2", "ST", 4),
    ],
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    positions: [
      gk(),
      def("lb", "LB", 1),
      def("cb1", "CB", 2),
      def("cb2", "CB", 4),
      def("rb", "RB", 5),
      mid("dm", "DM", 3, 3),
      mid("lm", "LM", 1, 4),
      mid("cm1", "CM", 2, 4),
      mid("cm2", "CM", 4, 4),
      mid("rm", "RM", 5, 4),
      att("st", "ST", 3, 5),
    ],
  },
  {
    id: "3-4-2-1",
    name: "3-4-2-1",
    positions: [
      gk(),
      def("cb1", "CB", 2),
      def("cb2", "CB", 3),
      def("cb3", "CB", 4),
      mid("lwb", "LWB", 1, 3),
      mid("cm1", "CM", 2, 3),
      mid("cm2", "CM", 4, 3),
      mid("rwb", "RWB", 5, 3),
      att("lam", "LAM", 2, 4),
      att("ram", "RAM", 4, 4),
      att("st", "ST", 3, 5),
    ],
  },
];

/**
 * Get formation by ID
 */
export function getFormationById(id: string): FormationConfig | undefined {
  return FORMATIONS.find((f) => f.id === id);
}

/**
 * Get default formation
 */
export function getDefaultFormation(): FormationConfig {
  return FORMATIONS[0]; // 4-3-3
}

/**
 * Create empty players record for a formation
 */
export function createEmptyPlayersRecord(
  formation: FormationConfig,
): Record<string, LineupSlotPlayer | null> {
  return formation.positions.reduce(
    (acc, pos) => {
      acc[pos.id] = null;
      return acc;
    },
    {} as Record<string, LineupSlotPlayer | null>,
  );
}
