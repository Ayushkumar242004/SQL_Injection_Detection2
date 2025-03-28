"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Download, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function QueryValidator() {
  const [query, setQuery] = useState("");
  // const [file, setFile] = useState<File | null>(null)
  const [model, setModel] = useState("model_1");
  const [isValidating, setIsValidating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    isMalicious: boolean | null;
    message: string;
  }>({ isMalicious: null, message: "" });

  const validateQuery = async () => {
    if (!query.trim()) return;

    setIsValidating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const response = await fetch("https://m-s-973a.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, model }),
      });

      const data = await response.json();
      console.log("API Response:", data);
      clearInterval(interval);
      setProgress(100);

      const isMalicious = data.prediction > 0.5;
      const message = isMalicious
        ? "This query contains potential SQL injection patterns."
        : "No obvious SQL injection patterns detected.";

      setResult({ isMalicious, message });

      // Create a new history entry
      const newHistoryEntry = {
        query,
        model,
        isMalicious,
        message,
        timestamp: new Date().toISOString(),
      };

      // Update localStorage
      const savedHistory = JSON.parse(
        localStorage.getItem("queryValidationHistory") || "[]"
      );
      savedHistory.push(newHistoryEntry);
      localStorage.setItem(
        "queryValidationHistory",
        JSON.stringify(savedHistory)
      );
    } catch (error) {
      console.error("Error validating query:", error);
      setResult({
        isMalicious: null,
        message: "Error validating query. Please try again.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // const validateFile = async () => {
  //   if (!file) return

  //   setIsValidating(true)
  //   setProgress(0)

  //   // Simulate progress
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 90) {
  //         clearInterval(interval)
  //         return prev
  //       }
  //       return prev + 5
  //     })
  //   }, 100)

  //   // Simulate file processing
  //   setTimeout(() => {
  //     clearInterval(interval)
  //     setProgress(100)

  //     setResult({
  //       isMalicious: Math.random() > 0.5, // Random result for demo
  //       message: "File processed. See detailed results in the download.",
  //     })

  //     setIsValidating(false)
  //   }, 3000)
  // }

  const downloadResults = () => {
    if (result.isMalicious === null) return;

    const content = `
SQL Query Validation Results
===========================
Model: ${model}
Query: ${query}
Result: ${result.isMalicious ? "MALICIOUS" : "NON-MALICIOUS"}
Details: ${result.message}
Date: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sql-validation-result.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SQL Query Validator</CardTitle>
        <CardDescription>
          Validate SQL queries for potential injection vulnerabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Select Validation Model</Label>
          <RadioGroup
            defaultValue={model}
            onValueChange={setModel}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="model_1" id="model_1" />
              <Label htmlFor="model_1">Sqliv</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="model_2" id="model_2" />
              <Label htmlFor="model_2">Sqliv2</Label>
            </div>
          </RadioGroup>
        </div>

        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Query</TabsTrigger>
            {/* <TabsTrigger value="file">File Upload</TabsTrigger> */}
          </TabsList>
          <TabsContent value="single" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Enter SQL Query</Label>
              <Textarea
                id="query"
                placeholder="SELECT * FROM users WHERE username = 'input'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-32"
              />
            </div>
            <Button
              onClick={validateQuery}
              disabled={isValidating || !query.trim()}
              className="w-full"
            >
              Validate Query
            </Button>
          </TabsContent>
          <TabsContent value="file" className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="sql-file">Upload SQL File</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="sql-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    {/* <p className="text-xs text-muted-foreground">SQL files only (*.sql)</p> */}
                  </div>
                  {/* <input id="sql-file" type="file" accept=".sql" className="hidden" onChange={handleFileChange} /> */}
                </label>
              </div>
              {/* {file && <p className="text-sm text-muted-foreground mt-2">Selected file: {file.name}</p>} */}
            </div>
            {/* <Button onClick={validateFile} disabled={isValidating || !file} className="w-full">
              Validate File
            </Button> */}
          </TabsContent>
        </Tabs>

        {isValidating && (
          <div className="space-y-2">
            <Label>Processing...</Label>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {result.isMalicious !== null && (
          <Alert variant={result.isMalicious ? "destructive" : "default"}>
            {result.isMalicious ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {result.isMalicious
                ? "Malicious Query Detected"
                : "Query Appears Safe"}
            </AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setQuery("");
            // setFile(null)
            setResult({ isMalicious: null, message: "" });
          }}
        >
          Clear
        </Button>
        <Button
          onClick={downloadResults}
          disabled={result.isMalicious === null}
          variant="secondary"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Results
        </Button>
      </CardFooter>
    </Card>
  );
}
