"use client";

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react";

interface ModalProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
    trigger: React.ReactNode;
    isSubmit?: boolean;
}

// correction to props  making it readonly

export function Modal({ children, className, title, description, trigger, isSubmit = false }: Readonly<ModalProps>) {
    const [open, setOpen] = useState(false);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <button className={className}>{trigger}</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-transparent text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                    aria-label="Close modal"
                >
                    <X className="h-4 w-4" />
                </button>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-300">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>{children}<AlertDialogFooter className="mt-2">
                    {isSubmit && <AlertDialogAction className="h-12 w-full cursor-pointer text-base font-semibold transition active:scale-[0.99] active:opacity-90">
                        Submit
                    </AlertDialogAction>}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
