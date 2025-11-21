import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DosageForm } from '@/types/dosageForm';
import { Edit, Trash2, Beaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DosageFormCardProps {
  dosageForm: DosageForm;
  onDelete: (id: string) => void;
}

export const DosageFormCard = ({ dosageForm, onDelete }: DosageFormCardProps) => {
  const navigate = useNavigate();

  const getReleaseColor = (releaseType: string) => {
    switch (releaseType) {
      case 'immediate':
        return 'bg-chart-1 text-primary-foreground';
      case 'extended':
        return 'bg-chart-2 text-secondary-foreground';
      case 'controlled':
        return 'bg-chart-3 text-white';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="hover:shadow-[var(--shadow-hover)] transition-all duration-300 border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold text-foreground">{dosageForm.name}</CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">{dosageForm.type}</CardDescription>
          </div>
          <Badge className={getReleaseColor(dosageForm.releaseType)} variant="secondary">
            {dosageForm.releaseType}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Strength:</span>
            <span className="font-medium text-foreground">{dosageForm.strength}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Route:</span>
            <span className="font-medium text-foreground capitalize">{dosageForm.routeOfAdministration}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {dosageForm.activeIngredients.map((ingredient) => (
              <Badge key={ingredient} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{dosageForm.description}</p>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/edit/${dosageForm.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/simulate/${dosageForm.id}`)}
          >
            <Beaker className="mr-2 h-4 w-4" />
            Simulate
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(dosageForm.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
