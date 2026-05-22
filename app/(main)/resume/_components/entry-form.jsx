"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { analyzeATS } from "@/actions/ats";
import { atsAnalysisSchema } from "@/lib/schemas/forms";

export function ATSForm({ onComplete, initialResumeContent = "" }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(atsAnalysisSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      jobDescription: "",
      resumeContent: initialResumeContent,
    },
  });

  const onSubmit = async (values) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeATS(values);
      
      // Intercept structured validation or edge rejection payloads cleanly
      if (result && result.success === false) {
        const errorMessage = 
          result.errors?.jobDescription?.[0] || 
          result.errors?.resumeContent?.[0] || 
          result.errors?._form?.[0] || 
          "Server parameters rejected by edge guardrails.";
        toast.error(errorMessage);
        return;
      }

      toast.success("ATS analysis complete!");
      if (onComplete) onComplete(result.data);
    } catch (error) {
      toast.error(error.message || "Failed to finalize ATS compilation request.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ATS Optimization Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Title</label>
              <Input placeholder="e.g. Senior Software Engineer" {...register("jobTitle")} />
              {errors.jobTitle && <p className="text-sm text-red-500">{errors.jobTitle.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <Input placeholder="e.g. Google" {...register("companyName")} />
              {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea 
              rows={6} 
              placeholder="Paste the target job description requirements here..." 
              {...register("jobDescription")} 
            />
            {errors.jobDescription && <p className="text-sm text-red-500">{errors.jobDescription.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Resume Content Text</label>
            <Textarea 
              rows={8} 
              placeholder="Paste your plain text resume details or use the uploader..." 
              {...register("resumeContent")} 
            />
            {errors.resumeContent && <p className="text-sm text-red-500">{errors.resumeContent.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Match...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Scan ATS Compatibility
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
