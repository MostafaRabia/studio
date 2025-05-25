"use client";

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getAiFaqAnswer } from '@/app/faq/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, MessageSquare, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const faqFormSchema = z.object({
  question: z.string().min(10, { message: "Please ask a question that is at least 10 characters long." }).max(500, { message: "Your question is too long. Please keep it under 500 characters." }),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

export function AiFaqClient() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: '',
    },
  });

  const onSubmit: SubmitHandler<FaqFormValues> = async (data) => {
    setIsLoading(true);
    setAnswer(null);
    setError(null);
    try {
      const result = await getAiFaqAnswer({ question: data.question });
      setAnswer(result.answer);
    } catch (err) {
      setError('Failed to get an answer. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            Ask a Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="question-input">Your Question</FormLabel>
                    <FormControl>
                      <Textarea
                        id="question-input"
                        placeholder="e.g., What is our company's vacation policy?"
                        rows={4}
                        {...field}
                        className="text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting Answer...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ask AI Assistant
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {answer && !isLoading && (
        <Card className="shadow-lg animate-in fade-in duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-6 w-6 text-primary" />
              AI's Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{answer}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
