import { ReleaseType, SimulationResult } from '@/types/dosageForm';

export class SimulationEngine {
  /**
   * Calculate drug release profile based on release type
   * @param releaseType - Type of release mechanism
   * @param totalDosage - Total amount of drug (mg)
   * @param rateConstant - Release rate constant (1/hour)
   * @param duration - Total simulation duration (hours)
   * @param timePoints - Number of time points to simulate
   */
  static simulate(
    releaseType: ReleaseType,
    totalDosage: number,
    rateConstant: number,
    duration: number,
    timePoints: number = 100
  ): SimulationResult {
    const time: number[] = [];
    const concentration: number[] = [];
    const cumulativeRelease: number[] = [];

    const dt = duration / timePoints;

    for (let i = 0; i <= timePoints; i++) {
      const t = i * dt;
      time.push(t);

      let released: number;
      let cumulative: number;

      switch (releaseType) {
        case 'immediate':
          // First-order release: C(t) = C0 * e^(-kt)
          released = totalDosage * Math.exp(-rateConstant * t);
          cumulative = totalDosage * (1 - Math.exp(-rateConstant * t));
          break;

        case 'extended':
          // Zero-order release: constant rate
          const extendedRate = totalDosage / duration;
          cumulative = Math.min(extendedRate * t, totalDosage);
          released = totalDosage - cumulative;
          break;

        case 'controlled':
          // Higuchi model: Q = K * sqrt(t)
          const higuchiFactor = rateConstant * 2;
          cumulative = Math.min(higuchiFactor * Math.sqrt(t), totalDosage);
          released = totalDosage - cumulative;
          break;

        default:
          released = 0;
          cumulative = 0;
      }

      concentration.push(Math.max(0, released));
      cumulativeRelease.push(Math.min(cumulative, totalDosage));
    }

    return { time, concentration, cumulativeRelease };
  }

  /**
   * Export simulation results to CSV format
   */
  static exportToCSV(result: SimulationResult, dosageFormName: string): string {
    let csv = 'Time (hours),Concentration (mg),Cumulative Release (mg)\n';
    
    for (let i = 0; i < result.time.length; i++) {
      csv += `${result.time[i].toFixed(2)},${result.concentration[i].toFixed(4)},${result.cumulativeRelease[i].toFixed(4)}\n`;
    }

    return csv;
  }

  /**
   * Download CSV file
   */
  static downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
