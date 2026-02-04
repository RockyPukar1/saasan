import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface IEvidencePicker {
  onClick: () => void;
  background: string;
  text: string;
  Icon: any;
}

export default function EvidencePicker({ onClick, background, text, Icon }: IEvidencePicker) {
  return (
    <Button
      className={cn("flex-row items-center justify-center rounded-full py-1 px-3", `bg-${background}-600`)}
      onClick={onClick}
    >
      <div className="flex items-center">
        <Icon className="text-white mr-2" size={16} color="white" />
        <p className="text-white">{text}</p>
      </div>
    </Button>
  )
}