"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addEmailSubscriber } from "@/lib/actions/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { CheckCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

const SignupForm = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await addEmailSubscriber(data.email);
      form.reset();
      setSuccess(true);
      toast.success("Subscribed successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to subscribe. Please try again.");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <p className="text-primary flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        Thank you for subscribing! You will receive an email when we launch.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => {
          toast.error("Please enter a valid email address.");
        })}
        className="flex gap-2"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          disabled={isLoading}
          autoFocus
          {...form.register("email")}
        />
        <Button type="submit" size={"sm"} disabled={isLoading}>
          {isLoading ? (
            <Icons.spinner className="h-4 w-4 animate-spin" />
          ) : (
            <PaperPlaneIcon className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
