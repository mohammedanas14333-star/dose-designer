import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { DosageFormStore } from '@/lib/dosageFormStore';
import { SimulationEngine } from '@/lib/simulationEngine';
import { DosageForm, SimulationResult } from '@/types/dosageForm';
import { ArrowLeft, Download, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Simulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const [dosageForm, setDosageForm] = useState<DosageForm | null>(null);
  const [totalDosage, setTotalDosage] = useState(100);
  const [rateConstant, setRateConstant] = useState(0.5);
  const [duration, setDuration] = useState(24);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (id) {
      const form = DosageFormStore.getById(id);
      if (form) {
        setDosageForm(form);
        // Set defaults based on release type
        if (form.releaseType === 'immediate') {
          setRateConstant(1.5);
          setDuration(12);
        } else if (form.releaseType === 'extended') {
          setRateConstant(0.3);
          setDuration(24);
        } else {
          setRateConstant(0.5);
          setDuration(24);
        }
      } else {
        toast({
          title: 'Not found',
          description: 'Dosage form not found',
          variant: 'destructive',
        });
        navigate('/library');
      }
    }
  }, [id, navigate, toast]);

  const runSimulation = () => {
    if (!dosageForm) return;

    const result = SimulationEngine.simulate(
      dosageForm.releaseType,
      totalDosage,
      rateConstant,
      duration
    );

    setSimulationResult(result);

    toast({
      title: 'Simulation complete',
      description: 'Release profile has been calculated successfully.',
    });
  };

  const handleDownload = () => {
    if (!simulationResult || !dosageForm) return;

    const csv = SimulationEngine.exportToCSV(simulationResult, dosageForm.name);
    SimulationEngine.downloadCSV(csv, `${dosageForm.name.replace(/\s+/g, '_')}_simulation.csv`);

    toast({
      title: 'Export successful',
      description: 'Simulation data has been downloaded as CSV.',
    });
  };

  const chartData = simulationResult
    ? simulationResult.time.map((t, i) => ({
        time: t,
        concentration: simulationResult.concentration[i],
        cumulative: simulationResult.cumulativeRelease[i],
      }))
    : [];

  if (!dosageForm) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-secondary py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/library')}
            className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
          <h1 className="text-4xl font-bold text-primary-foreground">Drug Release Simulation</h1>
          <p className="text-primary-foreground/80 mt-2">{dosageForm.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parameters Card */}
          <Card className="shadow-[var(--shadow-card)] border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Simulation Parameters</CardTitle>
              <CardDescription>Adjust values to model different scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="dosage">Total Dosage (mg)</Label>
                <Input
                  id="dosage"
                  type="number"
                  value={totalDosage}
                  onChange={(e) => setTotalDosage(Number(e.target.value))}
                  min="1"
                  max="1000"
                />
                <Slider
                  value={[totalDosage]}
                  onValueChange={(value) => setTotalDosage(value[0])}
                  min={10}
                  max={500}
                  step={10}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="rate">
                  Rate Constant ({dosageForm.releaseType === 'extended' ? 'mg/h' : '1/h'})
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={rateConstant}
                  onChange={(e) => setRateConstant(Number(e.target.value))}
                  min="0.1"
                  max="5"
                  step="0.1"
                />
                <Slider
                  value={[rateConstant * 10]}
                  onValueChange={(value) => setRateConstant(value[0] / 10)}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min="1"
                  max="72"
                />
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={6}
                  max={72}
                  step={6}
                />
              </div>

              <div className="pt-4 space-y-3">
                <Button onClick={runSimulation} className="w-full" size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Run Simulation
                </Button>
                {simulationResult && (
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-semibold text-sm text-foreground mb-2">Release Model:</h4>
                <p className="text-sm text-muted-foreground">
                  {dosageForm.releaseType === 'immediate' && 'First-order exponential decay'}
                  {dosageForm.releaseType === 'extended' && 'Zero-order constant release'}
                  {dosageForm.releaseType === 'controlled' && 'Higuchi square root model'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Graph Card */}
          <Card className="lg:col-span-2 shadow-[var(--shadow-card)] border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Release Profile</CardTitle>
              <CardDescription>Drug concentration and cumulative release over time</CardDescription>
            </CardHeader>
            <CardContent>
              {simulationResult ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        label={{ value: 'Time (hours)', position: 'insideBottom', offset: -5 }}
                        stroke="hsl(var(--foreground))"
                      />
                      <YAxis
                        label={{ value: 'Concentration (mg)', angle: -90, position: 'insideLeft' }}
                        stroke="hsl(var(--foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="concentration"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        name="Concentration"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="time"
                        label={{ value: 'Time (hours)', position: 'insideBottom', offset: -5 }}
                        stroke="hsl(var(--foreground))"
                      />
                      <YAxis
                        label={{ value: 'Cumulative Release (mg)', angle: -90, position: 'insideLeft' }}
                        stroke="hsl(var(--foreground))"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        name="Cumulative Release"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center">
                    <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Run simulation to view release profile</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Educational Info */}
        <Card className="mt-6 bg-muted/50 border-border">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Educational Information</h3>
            <p className="text-sm text-muted-foreground">
              This simulation uses mathematical models to approximate drug release patterns. The models are simplified
              representations and do not account for physiological factors, drug interactions, or individual patient
              variability. This tool is intended for educational and research purposes only and should not be used for
              clinical decision-making or medical advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulation;
