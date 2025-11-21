export type ReleaseType = 'immediate' | 'extended' | 'controlled';
export type RouteOfAdministration = 'oral' | 'injection' | 'topical' | 'inhalation' | 'sublingual' | 'transdermal';

export interface DosageForm {
  id: string;
  name: string;
  type: string;
  activeIngredients: string[];
  strength: string;
  releaseType: ReleaseType;
  routeOfAdministration: RouteOfAdministration;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulationParams {
  dosageFormId: string;
  releaseType: ReleaseType;
  totalDosage: number;
  rateConstant: number;
  releaseDuration: number;
}

export interface SimulationResult {
  time: number[];
  concentration: number[];
  cumulativeRelease: number[];
}
