"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleX, Ellipsis, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "@/components/ui/toast";
import {
    endStudentEnrollment,
  EnrollmentCompleteInfo,
  lockStudentEnrollment,
  unlockStudentEnrollment,
} from "../../actions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type StudentEnrollmentBadgeProps = {
  enrollment: EnrollmentCompleteInfo;
};

export default function StudentEnrollmentBadge({
  enrollment,
}: StudentEnrollmentBadgeProps) {
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);
  const [isEndedOpen, setIsEndedOpen] = useState(false);

  const [isPending, startTransiton] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    enrollment.status,
  );

  const t = useTranslations("EnrollmentDetailCard");

  const enrollmentStatusConfig = {
    ACTIVE: {
      label: t("activeStatus"),
      badgeClass: "bg-success/15",
      dotClass: "bg-success",
      textClass: "text-success",
    },
    LOCKED: {
      label: t("lockedStatus"),
      badgeClass: "bg-warning/15",
      dotClass: "bg-warning",
      textClass: "text-warning",
    },
    ENDED: {
      label: t("endedStatus"),
      badgeClass: "bg-muted",
      dotClass: "bg-muted-foreground",
      textClass: "text-muted-foreground",
    },
  } as const;

  function handleEnrollmentLock(enrollmentId: string) {
    startTransiton(async () => {
      setOptimisticStatus("LOCKED");
      try {
        await lockStudentEnrollment(enrollmentId);
        setIsLockOpen(false);
      } catch {
        toast.add({
          type: "error",
          description: "Erro ao trancar matrícula",
        });
      }
    });
  }

  function handleEnrollmentUnlock(enrollmentId: string) {
    startTransiton(async () => {
      setOptimisticStatus("ACTIVE");
      try {
        await unlockStudentEnrollment(enrollmentId);
        setIsUnlockOpen(false);
      } catch {
        toast.add({
          type: "error",
          description: "Erro ao reativar matrícula",
        });
      }
    });
  }

  function handleEnrollmentEnd(enrollmentId: string) {
    startTransiton(async () => {
      setOptimisticStatus("ACTIVE");
      try {
        await endStudentEnrollment(enrollmentId);
        setIsEndedOpen(false);
      } catch {
        toast.add({
          type: "error",
          description: "Erro ao encerrar matrícula",
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center gap-1 rounded-xl py-1 px-2 w-fit",
          enrollmentStatusConfig[optimisticStatus].badgeClass,
        )}
      >
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            enrollmentStatusConfig[optimisticStatus].dotClass,
          )}
        />
        <span
          className={cn(
            "text-xs font-semibold",
            enrollmentStatusConfig[optimisticStatus].textClass,
          )}
        >
          {enrollmentStatusConfig[optimisticStatus].label}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md"
              disabled={enrollment.status === "ENDED"}
            >
              {enrollment.status !== "ENDED" && (
                <Ellipsis />
              )}
            </button>
          }
        />

        <DropdownMenuContent className="w-fit">
          {enrollment.status === "ACTIVE" && (
            <DropdownMenuItem onClick={() => setIsLockOpen(true)}>
              <LockKeyhole />
              <span>Trancar matrícula</span>
            </DropdownMenuItem>
          )}
          {enrollment.status === "LOCKED" && (
            <DropdownMenuItem onClick={() => setIsUnlockOpen(true)}>
              <LockKeyholeOpen />
              <span>Destrancar matrícula</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsEndedOpen(true)}>
            <CircleX />
            <span>Encerrar matrícula</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isLockOpen}
        onOpenChange={(next) => {
          if (!isPending) setIsLockOpen(next);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Deseja trancar esta matrícula?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              A matrícula poderá ser reativada posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleEnrollmentLock(enrollment.id)}
            >
              Trancar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isUnlockOpen}
        onOpenChange={(next) => {
          if (!isPending) setIsUnlockOpen(next);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Deseja destrancar esta matrícula?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              A matrícula poderá ser trancada ou encerrada posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleEnrollmentUnlock(enrollment.id)}
            >
              Destrancar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isEndedOpen}
        onOpenChange={(next) => {
          if (!isPending) setIsEndedOpen(next);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">
              Deseja encerrar esta matrícula?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              A matrícula será encerrada e não poderá ser ativada novamente. Em caso de retorno do aluno, será necessário a criação de uma nova matrícula.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-0">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleEnrollmentEnd(enrollment.id)}
            >
              Encerrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
