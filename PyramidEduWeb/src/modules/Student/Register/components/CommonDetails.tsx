"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Mail, MapPin, Phone, User, Users, FileText, AlertCircle, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";
import type { RegisterFormValues, BatchOption } from "../types";
import { getStep1Errors, isValidSriLankanNIC, isValidSLPhone, isValidEmail } from "../validation";
import { checkAvailability } from "../services";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  batches: BatchOption[];
  batchesLoading: boolean;
  onNext: () => void;
};

export default function CommonDetails({ values, setValues, batches, batchesLoading, onNext }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focused, setFocused] = useState<Record<string, boolean>>({});
  const [nicChecking, setNicChecking] = useState(false);
  const [nicTakenError, setNicTakenError] = useState<string | null>(null);
  const nicCheckTimer = useRef<NodeJS.Timeout | null>(null);

  const errors = useMemo(() => getStep1Errors(values), [values]);

  const handleFocus = (field: string) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFieldInvalid = (field: string) =>
    !focused[field] && Boolean(touched[field]) && Boolean(errors[field]);

  // Debounced NIC uniqueness check against backend (runs only when format is fully valid)
  useEffect(() => {
    if (nicCheckTimer.current) {
      clearTimeout(nicCheckTimer.current);
    }

    const trimmedNic = values.nic?.trim() || "";
    if (!trimmedNic) {
      setNicTakenError(null);
      setNicChecking(false);
      return;
    }

    // Only query backend if format is syntactically valid (9 digits + V/X or 12 digits)
    const isFormatValid = /^[0-9]{9}[VvXx]$/.test(trimmedNic) || /^[0-9]{12}$/.test(trimmedNic);
    if (!isFormatValid) {
      setNicTakenError(null);
      setNicChecking(false);
      return;
    }

    setNicChecking(true);
    nicCheckTimer.current = setTimeout(async () => {
      try {
        const res = await checkAvailability({ nic: trimmedNic });
        if (!res.nicAvailable) {
          setNicTakenError("This NIC number is already registered in PyramidEdu.");
        } else {
          setNicTakenError(null);
        }
      } catch (e) {
        // Silently ignore network error
      } finally {
        setNicChecking(false);
      }
    }, 400);

    return () => {
      if (nicCheckTimer.current) clearTimeout(nicCheckTimer.current);
    };
  }, [values.nic]);

  const handleProceed = () => {
    setFocused({});
    // Mark all fields touched when attempting to continue
    const allTouched: Record<string, boolean> = {
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      batchId: true,
      nic: true,
      school: true,
      gender: true,
      phone: true,
      address: true,
      parentName: true,
      parentRelation: true,
      parentEmail: true,
      parentPhone: true,
    };
    setTouched(allTouched);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors || nicTakenError) {
      toast.error("Please fix the highlighted errors before continuing.");
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
          <User className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Common Details
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label htmlFor="firstName">
              First name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={values.firstName}
              onFocus={() => handleFocus("firstName")}
              onBlur={() => handleBlur("firstName")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className={cn(isFieldInvalid("firstName") && "border-red-500 focus-visible:ring-red-500")}
            />
            {isFieldInvalid("firstName") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label htmlFor="lastName">
              Last name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={values.lastName}
              onFocus={() => handleFocus("lastName")}
              onBlur={() => handleBlur("lastName")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className={cn(isFieldInvalid("lastName") && "border-red-500 focus-visible:ring-red-500")}
            />
            {isFieldInvalid("lastName") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth">
              Date of birth <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dateOfBirth"
                type="date"
                className={cn("pl-9", isFieldInvalid("dateOfBirth") && "border-red-500 focus-visible:ring-red-500")}
                value={values.dateOfBirth}
                onFocus={() => handleFocus("dateOfBirth")}
                onBlur={() => handleBlur("dateOfBirth")}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }))
                }
              />
            </div>
            {isFieldInvalid("dateOfBirth") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* A/L Exam Batch */}
          <div className="space-y-1.5">
            <Label>
              A/L Exam Batch <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.batchId}
              onValueChange={(batchId) => {
                const batch = batches.find((b) => b.id === batchId);
                setValues((prev) => ({ 
                  ...prev, 
                  batchId, 
                  alExamBatch: batch ? batch.name : "" 
                }));
                handleBlur("batchId");
              }}
              disabled={batchesLoading}
            >
              <SelectTrigger className={cn(isFieldInvalid("batchId") && "border-red-500 focus:ring-red-500")}>
                <SelectValue placeholder={batchesLoading ? "Loading..." : "Select Batch"} />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isFieldInvalid("batchId") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.batchId}
              </p>
            )}
          </div>

          {/* National Identity Card (NIC) with Smart Error Timing */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="nic">
                National Identity Card (NIC)
              </Label>
              <span className="text-[11px] text-muted-foreground font-normal">
                Optional
              </span>
            </div>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nic"
                className={cn(
                  "pl-9",
                  !focused.nic && touched.nic && (errors.nic || nicTakenError) && "border-red-500 focus-visible:ring-red-500",
                  values.nic && !errors.nic && !nicTakenError && !nicChecking && values.nic.trim().length >= 10 && "border-emerald-500 focus-visible:ring-emerald-500"
                )}
                placeholder="e.g. 200412345678 or 991234567V"
                value={values.nic}
                onFocus={() => handleFocus("nic")}
                onBlur={() => handleBlur("nic")}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, nic: e.target.value.toUpperCase() }))
                }
              />
              {nicChecking && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Error is displayed only when typing is finished (blurred or submitted), never while actively typing */}
            {!focused.nic && touched.nic && errors.nic && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.nic}
              </p>
            )}
            {!focused.nic && touched.nic && !errors.nic && nicTakenError && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {nicTakenError}
              </p>
            )}
            {values.nic && !errors.nic && !nicChecking && !nicTakenError && values.nic.trim().length >= 10 && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-150">
                <Check className="h-3.5 w-3.5 shrink-0" />
                Valid Sri Lankan NIC format
              </p>
            )}
          </div>

          {/* School */}
          <div className="space-y-1.5">
            <Label htmlFor="school">
              School <span className="text-red-500">*</span>
            </Label>
            <Input
              id="school"
              placeholder="e.g. Royal College"
              value={values.school}
              onFocus={() => handleFocus("school")}
              onBlur={() => handleBlur("school")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, school: e.target.value }))
              }
              className={cn(isFieldInvalid("school") && "border-red-500 focus-visible:ring-red-500")}
            />
            {isFieldInvalid("school") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.school}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.gender}
              onValueChange={(gender) => {
                setValues((prev) => ({ ...prev, gender }));
                handleBlur("gender");
              }}
            >
              <SelectTrigger className={cn(isFieldInvalid("gender") && "border-red-500 focus:ring-red-500")}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
            {isFieldInvalid("gender") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.gender}
              </p>
            )}
          </div>

          {/* Phone number with Smart Error Timing */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">
              Phone number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                placeholder="07XXXXXXXX or +947XXXXXXXX"
                className={cn(
                  "pl-9",
                  !focused.phone && touched.phone && errors.phone && "border-red-500 focus-visible:ring-red-500",
                  !errors.phone && values.phone.trim().length >= 10 && "border-emerald-500 focus-visible:ring-emerald-500"
                )}
                value={values.phone}
                onFocus={() => handleFocus("phone")}
                onBlur={() => handleBlur("phone")}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
            {!focused.phone && touched.phone && errors.phone && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.phone}
              </p>
            )}
            {!errors.phone && values.phone.trim().length >= 10 && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-150">
                <Check className="h-3.5 w-3.5 shrink-0" />
                Valid Sri Lankan phone number
              </p>
            )}
          </div>
        </div>

        {/* Residential Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address">
            Residential Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="address"
              className={cn("pl-9 min-h-[70px]", isFieldInvalid("address") && "border-red-500 focus-visible:ring-red-500")}
              value={values.address}
              onFocus={() => handleFocus("address")}
              onBlur={() => handleBlur("address")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>
          {isFieldInvalid("address") && (
            <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errors.address}
            </p>
          )}
        </div>
      </div>

      {/* Parent / Guardian Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Parent / Guardian Details
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Guardian Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="parentName">
              Guardian Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="parentName"
              value={values.parentName}
              onFocus={() => handleFocus("parentName")}
              onBlur={() => handleBlur("parentName")}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, parentName: e.target.value }))
              }
              className={cn(isFieldInvalid("parentName") && "border-red-500 focus-visible:ring-red-500")}
            />
            {isFieldInvalid("parentName") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.parentName}
              </p>
            )}
          </div>

          {/* Relation */}
          <div className="space-y-1.5">
            <Label>
              Relation <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.parentRelation}
              onValueChange={(parentRelation) => {
                setValues((prev) => ({ ...prev, parentRelation }));
                handleBlur("parentRelation");
              }}
            >
              <SelectTrigger className={cn(isFieldInvalid("parentRelation") && "border-red-500 focus:ring-red-500")}>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="guardian">Legal Guardian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {isFieldInvalid("parentRelation") && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.parentRelation}
              </p>
            )}
          </div>

          {/* Guardian Email */}
          <div className="space-y-1.5">
            <Label htmlFor="parentEmail">
              Guardian Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="parentEmail"
                type="email"
                placeholder="guardian@example.com"
                className={cn(
                  "pl-9",
                  !focused.parentEmail && touched.parentEmail && errors.parentEmail && "border-red-500 focus-visible:ring-red-500",
                  !errors.parentEmail && values.parentEmail.trim().length > 5 && "border-emerald-500 focus-visible:ring-emerald-500"
                )}
                value={values.parentEmail}
                onFocus={() => handleFocus("parentEmail")}
                onBlur={() => handleBlur("parentEmail")}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parentEmail: e.target.value,
                  }))
                }
              />
            </div>
            {!focused.parentEmail && touched.parentEmail && errors.parentEmail && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.parentEmail}
              </p>
            )}
            {!errors.parentEmail && values.parentEmail.trim().length > 5 && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-150">
                <Check className="h-3.5 w-3.5 shrink-0" />
                Valid email format
              </p>
            )}
          </div>

          {/* Guardian Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="parentPhone">
              Guardian Phone <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="parentPhone"
                placeholder="07XXXXXXXX or +947XXXXXXXX"
                className={cn(
                  "pl-9",
                  !focused.parentPhone && touched.parentPhone && errors.parentPhone && "border-red-500 focus-visible:ring-red-500",
                  !errors.parentPhone && values.parentPhone.trim().length >= 10 && "border-emerald-500 focus-visible:ring-emerald-500"
                )}
                value={values.parentPhone}
                onFocus={() => handleFocus("parentPhone")}
                onBlur={() => handleBlur("parentPhone")}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parentPhone: e.target.value,
                  }))
                }
              />
            </div>
            {!focused.parentPhone && touched.parentPhone && errors.parentPhone && (
              <p className="text-xs font-medium text-red-500 flex items-center gap-1 animate-in fade-in duration-150">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.parentPhone}
              </p>
            )}
            {!errors.parentPhone && values.parentPhone.trim().length >= 10 && (
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-in fade-in duration-150">
                <Check className="h-3.5 w-3.5 shrink-0" />
                Valid Sri Lankan phone number
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={handleProceed}
          className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white cursor-pointer"
        >
          Next: Academic & Course
        </Button>
      </div>
    </div>
  );
}
