import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DosageFormCard } from '@/components/DosageFormCard';
import { DosageFormStore } from '@/lib/dosageFormStore';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Library = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [releaseFilter, setReleaseFilter] = useState<string>('all');
  const [dosageForms, setDosageForms] = useState(DosageFormStore.getAll());

  const handleDelete = (id: string) => {
    DosageFormStore.delete(id);
    setDosageForms(DosageFormStore.getAll());
    toast({
      title: 'Dosage form deleted',
      description: 'The dosage form has been removed from your library.',
    });
  };

  const filteredForms = dosageForms.filter((form) => {
    const matchesSearch =
      form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.activeIngredients.some((ing) =>
        ing.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesRelease =
      releaseFilter === 'all' || form.releaseType === releaseFilter;

    return matchesSearch && matchesRelease;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground">Dosage Form Library</h1>
              <p className="text-primary-foreground/80 mt-2">
                {dosageForms.length} dosage forms available
              </p>
            </div>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/add')}
              className="font-semibold"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add New Form
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, type, or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={releaseFilter} onValueChange={setReleaseFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by release" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Release Types</SelectItem>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="extended">Extended</SelectItem>
              <SelectItem value="controlled">Controlled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {filteredForms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No dosage forms found</p>
            <Button onClick={() => navigate('/add')} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create your first dosage form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <DosageFormCard
                key={form.id}
                dosageForm={form}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
