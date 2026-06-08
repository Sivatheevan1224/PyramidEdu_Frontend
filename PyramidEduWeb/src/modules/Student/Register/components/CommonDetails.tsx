"use client";

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
import { Calendar, Mail, MapPin, Phone, User, Users, FileText } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { RegisterFormValues, BatchOption } from "../types";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  batches: BatchOption[];
  batchesLoading: boolean;
  onNext: () => void;
};

export default function CommonDetails({ values, setValues, batches, batchesLoading, onNext }: Props) {
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
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, firstName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, lastName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">
              Date of birth <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="dateOfBirth"
                type="date"
                className="pl-9"
                value={values.dateOfBirth}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    dateOfBirth: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              A/L Exam Batch <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.batchId}
              onValueChange={(batchId) => {
                const batch = batches.find(b => b.id === batchId);
                setValues((prev) => ({ 
                  ...prev, 
                  batchId, 
                  alExamBatch: batch ? batch.name : "" 
                }));
              }}
              disabled={batchesLoading}
            >
              <SelectTrigger>
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="nic">
              National Identity Card (NIC)
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="nic"
                className="pl-9"
                placeholder="Optional"
                value={values.nic}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, nic: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="school">
              School <span className="text-red-500">*</span>
            </Label>
            <Input
              id="school"
              placeholder="e.g. Royal College"
              value={values.school}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, school: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.gender}
              onValueChange={(gender) =>
                setValues((prev) => ({ ...prev, gender }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                className="pl-9"
                value={values.phone}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Residential Address <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Textarea
              id="address"
              className="pl-9 min-h-[70px]"
              value={values.address}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, address: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
          <Users className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
            Parent / Guardian Details
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="parentName">
              Guardian Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="parentName"
              value={values.parentName}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, parentName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>
              Relation <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.parentRelation}
              onValueChange={(parentRelation) =>
                setValues((prev) => ({ ...prev, parentRelation }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="guardian">Legal Guardian</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentEmail">
              Guardian Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="parentEmail"
                type="email"
                className="pl-9"
                value={values.parentEmail}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parentEmail: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentPhone">
              Guardian Phone <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="parentPhone"
                className="pl-9"
                value={values.parentPhone}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parentPhone: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          onClick={onNext}
          className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white"
        >
          Next: Academic & Course
        </Button>
      </div>
    </div>
  );
}
