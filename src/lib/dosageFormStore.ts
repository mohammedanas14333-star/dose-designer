import { DosageForm } from '@/types/dosageForm';

// Sample data for demonstration
const sampleDosageForms: DosageForm[] = [
  {
    id: '1',
    name: 'Ibuprofen Tablet',
    type: 'Tablet',
    activeIngredients: ['Ibuprofen'],
    strength: '400 mg',
    releaseType: 'immediate',
    routeOfAdministration: 'oral',
    description: 'Non-steroidal anti-inflammatory drug (NSAID) for pain and inflammation relief.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Extended Release Metformin',
    type: 'Tablet',
    activeIngredients: ['Metformin Hydrochloride'],
    strength: '500 mg',
    releaseType: 'extended',
    routeOfAdministration: 'oral',
    description: 'Extended-release antidiabetic medication for type 2 diabetes management.',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Nicotine Transdermal Patch',
    type: 'Transdermal Patch',
    activeIngredients: ['Nicotine'],
    strength: '21 mg/24h',
    releaseType: 'controlled',
    routeOfAdministration: 'transdermal',
    description: 'Controlled-release nicotine patch for smoking cessation therapy.',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export class DosageFormStore {
  private static STORAGE_KEY = 'dosageForms';

  static getAll(): DosageForm[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((form: any) => ({
        ...form,
        createdAt: new Date(form.createdAt),
        updatedAt: new Date(form.updatedAt),
      }));
    }
    // Initialize with sample data
    this.saveAll(sampleDosageForms);
    return sampleDosageForms;
  }

  static getById(id: string): DosageForm | undefined {
    return this.getAll().find((form) => form.id === id);
  }

  static save(dosageForm: DosageForm): void {
    const forms = this.getAll();
    const index = forms.findIndex((f) => f.id === dosageForm.id);
    
    if (index >= 0) {
      forms[index] = { ...dosageForm, updatedAt: new Date() };
    } else {
      forms.push(dosageForm);
    }
    
    this.saveAll(forms);
  }

  static delete(id: string): void {
    const forms = this.getAll().filter((f) => f.id !== id);
    this.saveAll(forms);
  }

  private static saveAll(forms: DosageForm[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(forms));
  }

  static generateId(): string {
    return `df-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
