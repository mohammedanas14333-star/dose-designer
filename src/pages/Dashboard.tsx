import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pill, Beaker, Database } from 'lucide-react';
import { DosageFormStore } from '@/lib/dosageFormStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const dosageForms = DosageFormStore.getAll();

  const releaseTypeCounts = dosageForms.reduce((acc, form) => {
    acc[form.releaseType] = (acc[form.releaseType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary py-16 px-6">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-primary-foreground tracking-tight">
              Dosage Form Management
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Create, manage, and simulate pharmaceutical dosage forms for educational and research purposes
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/library')}
                className="font-semibold"
              >
                <Database className="mr-2 h-5 w-5" />
                View Library
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/add')}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 font-semibold"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Form
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-[var(--shadow-card)] border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Forms</CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{dosageForms.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Dosage forms in database
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Release Types</CardTitle>
              <Pill className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{Object.keys(releaseTypeCounts).length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Different release mechanisms
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-card)] border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Simulations</CardTitle>
              <Beaker className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">Ready</div>
              <p className="text-xs text-muted-foreground mt-1">
                Interactive modeling available
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer border-border" onClick={() => navigate('/library')}>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Database className="mr-2 h-5 w-5 text-primary" />
                Dosage Form Library
              </CardTitle>
              <CardDescription>
                Browse, edit, and manage your complete collection of dosage forms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Open Library
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-[var(--shadow-hover)] transition-all duration-300 cursor-pointer border-border" onClick={() => navigate('/add')}>
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Plus className="mr-2 h-5 w-5 text-secondary" />
                Add New Dosage Form
              </CardTitle>
              <CardDescription>
                Create a new pharmaceutical dosage form with detailed specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Create New Form
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Release Type Distribution */}
        {Object.keys(releaseTypeCounts).length > 0 && (
          <Card className="mt-8 shadow-[var(--shadow-card)] border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Release Type Distribution</CardTitle>
              <CardDescription>Overview of release mechanisms in your library</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(releaseTypeCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        type === 'immediate' ? 'bg-chart-1' :
                        type === 'extended' ? 'bg-chart-2' :
                        'bg-chart-3'
                      }`} />
                      <span className="font-medium capitalize text-foreground">{type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            type === 'immediate' ? 'bg-chart-1' :
                            type === 'extended' ? 'bg-chart-2' :
                            'bg-chart-3'
                          }`}
                          style={{ width: `${(count / dosageForms.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-foreground w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <Card className="bg-muted/50 border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Educational Use Only:</strong> This tool is designed for educational and research purposes.
              It does not provide medical advice and should not be used for clinical decision-making.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
