"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paperclip, ArrowUp } from "lucide-react";
import { X } from "lucide-react";

export default function ChatInput() {
  return (
    <div className="w-full max-w-3xl mx-auto border rounded-lg pt-1">
      {/* Premium Banner */}
      <div className="flex items-center justify-between px-4 pt-2 mb-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <p className="text-sm text-zinc-100">
          Need more messages? Get higher limits with Premium.
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="h-7 bg-emerald-400 hover:bg-emerald-500"
          >
            Upgrade Plan
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Chat Input */}
      <Card className="border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-col items-start px-1 py-2">
          <div className="flex items-center gap-2 w-full">
            <Input
              className="w-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Ask CodeGen AI a question..."
            />
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-8 bg-zinc-900 hover:bg-zinc-800"
              >
                Submit
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <span className="h-5 w-5 flex items-center justify-center font-bold">
                ⌘
              </span>
              <span className="sr-only">Command</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
