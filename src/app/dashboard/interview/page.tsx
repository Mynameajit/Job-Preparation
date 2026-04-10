"use client";

import { useState } from "react";
import { interviewCategories } from "@/data/interviewData";
import { 
  Code2, 
  Users, 
  Layout, 
  ChevronRight, 
  Search,
  BookOpen,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: any = {
  Code2: <Code2 className="text-violet-500" size={24} />,
  Users: <Users className="text-blue-500" size={24} />,
  Layout: <Layout className="text-emerald-500" size={24} />
};

export default function InterviewPrepPage() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = interviewCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          Interview Preparation
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Master your next interview with our curated collection of technical and behavioral resources.
        </p>
      </div>

      {!selectedCategory ? (
        <>
          {/* Search Bar */}
          <div className="relative max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={20} />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full pl-10 pr-4 py-3 rounded-2xl border bg-card/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="group relative p-8 rounded-3xl border bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all cursor-pointer overflow-hidden border-border/50"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles size={60} />
                </div>
                
                <div className="mb-6 p-4 bg-background rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-500">
                  {iconMap[cat.icon]}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{cat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {cat.description}
                </p>
                
                <div className="flex items-center text-primary font-semibold text-sm">
                  Explore Topics <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats/Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20">
               <div className="flex items-center gap-3 mb-4 text-violet-600 font-bold">
                  <BookOpen size={20} />
                  <span>Preparation Tip</span>
               </div>
               <p className="text-sm text-foreground/80 leading-relaxed italic">
                 "Consistent practice is better than cramming. Spend 30 minutes every day reviewing one technical concept and one behavioral question."
               </p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20">
               <div className="flex items-center gap-3 mb-4 text-emerald-600 font-bold">
                  <MessageSquare size={20} />
                  <span>Mock Interview</span>
               </div>
               <p className="text-sm text-foreground/80 leading-relaxed">
                 Practice your answers out loud. Recording yourself helps you notice verbal fillers and improve your delivery.
               </p>
            </div>
          </div>
        </>
      ) : (
        /* Detailed Category View */
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCategory(null)}
            className="hover:bg-primary/5 rounded-xl transition-colors"
          >
            &larr; Back to Categories
          </Button>

          <div className="flex items-center gap-4">
             <div className="p-4 bg-card rounded-2xl shadow-sm">
               {iconMap[selectedCategory.icon]}
             </div>
             <div>
                <h2 className="text-2xl font-bold">{selectedCategory.title}</h2>
                <p className="text-muted-foreground">{selectedCategory.description}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {selectedCategory.topics.map((topic: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xl font-bold px-4 border-l-4 border-primary">
                  {topic.name}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {topic.questions.map((item: any, qIdx: number) => (
                    <details 
                      key={qIdx} 
                      className="group p-6 rounded-2xl border bg-card/40 backdrop-blur-sm transition-all hover:border-primary/20 open:bg-card/80 open:shadow-lg"
                    >
                      <summary className="list-none cursor-pointer flex items-center justify-between gap-4 font-semibold text-foreground/90">
                        <span className="flex-1">Q{qIdx + 1}: {item.q}</span>
                        <ChevronRight className="transition-transform duration-300 group-open:rotate-90 shrink-0 text-muted-foreground" size={20} />
                      </summary>
                      <div className="mt-6 pl-4 border-l-2 border-primary/20 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="font-bold text-xs uppercase tracking-wider text-primary mb-2 opacity-70">Suggested Answer</div>
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
