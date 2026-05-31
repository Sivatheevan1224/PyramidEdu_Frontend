"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Building2,
  Check,
  Clock,
  CircleDollarSign,
  CreditCard,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { CourseOption, RegisterFormValues, StreamOption } from "./types";

type Props = {
  values: RegisterFormValues;
  setValues: Dispatch<SetStateAction<RegisterFormValues>>;
  selectedStream?: StreamOption;
  selectedCourses: CourseOption[];
  totalAmount: number;
  isSubmitting: boolean;
  admissionFee: number;
  onBack: () => void;
  onSubmit: (event: React.FormEvent) => void;
};

export default function FeePayment({
  values,
  setValues,
  selectedStream,
  selectedCourses,
  totalAmount,
  isSubmitting,
  onBack,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-white/10 pb-2">
        <CircleDollarSign className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">
          Fee Payment
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 glass-subtle border border-slate-200/50 dark:border-white/10 rounded-2xl p-5 text-xs">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            Student Summary
          </p>
          <p className="font-extrabold text-sm text-foreground">
            {values.firstName} {values.lastName}
          </p>
          <p className="text-muted-foreground">
            Index Number:{" "}
            <span className="font-mono text-foreground font-semibold">
              {values.indexNumber}
            </span>
          </p>
          <p className="text-muted-foreground">
            Email:{" "}
            <span className="text-foreground font-semibold">
              {values.email}
            </span>
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            Enrollment Summary{" "}
            {selectedStream ? `(${selectedStream.name})` : ""}
          </p>
          <div className="space-y-1">
            {selectedCourses.map((course) => {
              const teacherId = values.selectedTeacherIds[course.id];
              const teacher = course.teachers.find(
                (item) => item.id === teacherId,
              );
              return (
                <div key={course.id} className="text-muted-foreground">
                  •{" "}
                  <span className="text-foreground font-semibold">
                    {course.name}
                  </span>{" "}
                  {teacher ? `(${teacher.name})` : ""}
                </div>
              );
            })}
          </div>
          <p className="text-muted-foreground pt-1.5 border-t border-slate-200/50 dark:border-white/5 mt-1.5">
            Total Amount Due:{" "}
            <span className="text-primary font-black text-sm">
              Rs. {totalAmount.toLocaleString()}.00
            </span>
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-semibold">
            Choose Registration Fee Payment Method{" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setValues((prev) => ({ ...prev, paymentMethod: "online" }))
              }
              className={`p-5 rounded-2xl border transition-all duration-300 text-left ${values.paymentMethod === "online" ? "bg-primary/10 border-primary ring-2 ring-primary/20" : "bg-white/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-white/10"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">Online Payment</span>
                </div>
                {values.paymentMethod === "online" && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Pay securely using Credit or Debit card.
              </p>
            </button>
            <button
              type="button"
              onClick={() =>
                setValues((prev) => ({ ...prev, paymentMethod: "physical" }))
              }
              className={`p-5 rounded-2xl border transition-all duration-300 text-left ${values.paymentMethod === "physical" ? "bg-primary/10 border-primary ring-2 ring-primary/20" : "bg-white/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-white/10"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">Pay at Institute</span>
                </div>
                {values.paymentMethod === "physical" && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Visit the institute and pay at the front desk.
              </p>
            </button>
          </div>

          {values.paymentMethod === "online" && (
            <div className="glass-subtle border rounded-2xl p-6 mt-4 space-y-4 animate-slideDown shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-white/10">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Secure Card Gateway
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    className="uppercase"
                    value={values.cardName}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        cardName: e.target.value.toUpperCase(),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4111 2222 3333 4444"
                    value={values.cardNumber}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        cardNumber: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim(),
                      }))
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiration Date</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/YY"
                      value={values.cardExpiry}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          cardExpiry: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4)
                            .replace(/(\d{2})(\d{1,2})/, "$1/$2"),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV / CVC</Label>
                    <Input
                      id="cardCvv"
                      type="password"
                      maxLength={3}
                      value={values.cardCvv}
                      onChange={(e) =>
                        setValues((prev) => ({
                          ...prev,
                          cardCvv: e.target.value.replace(/\D/g, ""),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {values.paymentMethod === "physical" && (
            <div className="glass-subtle border rounded-2xl p-6 mt-4 space-y-5 animate-slideDown shadow-sm">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200/50 dark:border-white/10">
                <Building2 className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Visit Institute to Pay
                </h3>
              </div>
              <div className="space-y-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/15 p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Visit PyramidEdu institute and pay the fee in person.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-muted-foreground">
                    Monday – Saturday, 8:00 AM – 5:00 PM
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pt-2 border-t border-slate-200/50 dark:border-white/10">
                <input
                  id="visitConfirm"
                  type="checkbox"
                  checked={values.receiptAccepted}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      receiptAccepted: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <label
                  htmlFor="visitConfirm"
                  className="text-[11px] text-muted-foreground select-none cursor-pointer leading-relaxed"
                >
                  I understand that my account will remain pending until payment
                  is confirmed.
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="h-11 px-8 rounded-xl font-semibold gap-2 border-slate-200 dark:border-white/10 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 px-8 rounded-xl font-semibold gap-2 bg-primary hover:bg-primary/95 text-white cursor-pointer shadow-glow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              <>
                {values.paymentMethod === "online"
                  ? "Pay & Register"
                  : "Submit Registration"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
