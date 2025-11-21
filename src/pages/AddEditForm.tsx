import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DosageForm, ReleaseType, RouteOfAdministration } from '@/types/dosageForm';
import { DosageFormStore } from '@/lib/dosageFormStore';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AddEditForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEdit = !!id;

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [activeIngredients, setActiveIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [strength, setStrength] = useState('');
  const [releaseType, setReleaseType] = useState<ReleaseType>('immediate');
  const [routeOfAdministration, setRouteOfAdministration] = useState<RouteOfAdministration>('oral');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      const form = DosageFormStore.getById(id);
      if (form) {
        setName(form.name);
        setType(form.type);
        setActiveIngredients(form.activeIngredients);
        setStrength(form.strength);
        setReleaseType(form.releaseType);
        setRouteOfAdministration(form.routeOfAdministration);
        setDescription(form.description);
      } else {
        toast({
          title: 'Not found',
          description: 'Dosage form not found',
          variant: 'destructive',
        });
        navigate('/library');
      }
    }
  }, [id, isEdit, navigate, toast]);

  const addIngredient = () => {
    if (newIngredient.trim() && !activeIngredients.includes(newIngredient.trim())) {
      setActiveIngredients([...activeIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setActiveIngredients(activeIngredients.filter((i) => i !== ingredient));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !type || activeIngredients.length === 0 || !strength || !description) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const dosageForm: DosageForm = {
      id: isEdit && id ? id : DosageFormStore.generateId(),
      name,
      type,
      activeIngredients,
      strength,
      releaseType,
      routeOfAdministration,
      description,
      createdAt: isEdit && id ? DosageFormStore.getById(id)!.createdAt : new Date(),
      updatedAt: new Date(),
    };

    DosageFormStore.save(dosageForm);

    toast({
      title: isEdit ? 'Dosage form updated' : 'Dosage form created',
      description: `${name} has been ${isEdit ? 'updated' : 'added to your library'}.`,
    });

    navigate('/library');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-secondary py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/library')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
          <h1 className="text-4xl font-bold text-primary-foreground">
            {isEdit ? 'Edit Dosage Form' : 'Add New Dosage Form'}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="shadow-[var(--shadow-card)] border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Dosage Form Details</CardTitle>
            <CardDescription>
              {isEdit
                ? 'Update the details of your dosage form'
                : 'Enter the specifications for a new dosage form'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Ibuprofen Tablet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Dosage Form Type *</Label>
                  <Input
                    id="type"
                    placeholder="e.g., Tablet, Capsule, Solution"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Active Ingredients *</Label>
                <div className="flex gap-2">
                  <Input
                    id="ingredients"
                    placeholder="Enter ingredient name"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIngredient())}
                  />
                  <Button type="button" onClick={addIngredient} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {activeIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeIngredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="gap-1">
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="strength">Strength *</Label>
                  <Input
                    id="strength"
                    placeholder="e.g., 400 mg, 5 mL, 10%"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseType">Release Type *</Label>
                  <Select value={releaseType} onValueChange={(value) => setReleaseType(value as ReleaseType)}>
                    <SelectTrigger id="releaseType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate Release</SelectItem>
                      <SelectItem value="extended">Extended Release</SelectItem>
                      <SelectItem value="controlled">Controlled Release</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route of Administration *</Label>
                <Select
                  value={routeOfAdministration}
                  onValueChange={(value) => setRouteOfAdministration(value as RouteOfAdministration)}
                >
                  <SelectTrigger id="route">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="inhalation">Inhalation</SelectItem>
                    <SelectItem value="sublingual">Sublingual</SelectItem>
                    <SelectItem value="transdermal">Transdermal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the dosage form, its uses, and characteristics..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/library')}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? 'Update Form' : 'Create Form'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddEditForm;
