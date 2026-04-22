import { 
  Code2, Cpu, Database, Network, Rocket, ShieldAlert, Workflow, 
  Microscope, Variable, Table, Eye, Package, Layers, Layout, 
  Search, Globe 
} from "lucide-react";

export const RoadmapIconMap: Record<string, any> = {
  Code2, Cpu, Database, Network, Rocket, ShieldAlert, Workflow, 
  Microscope, Variable, Table, Eye, Package, Layers, Layout, 
  Search, Globe
};

export interface RoadmapPhase {
  month: string;
  title: string;
  duration?: string;
  description: string;
  icon: any; // Can be a string name or a component
  gradient: string;
  skills: string[];
  topics: string[];
}
