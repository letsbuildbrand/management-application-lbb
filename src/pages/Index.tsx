import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start building your amazing project here! Explore our departments below.
        </p>
        <Link to="/departments">
          <Button size="lg" className="px-8 py-4 text-lg">
            View Departments
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;