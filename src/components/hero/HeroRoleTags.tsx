import { ROLE_NAMES } from "@/types/dota";
import { Badge } from "@/components/ui/badge";

interface HeroRoleTagsProps {
  roles: string[];
  className?: string;
}

export function HeroRoleTags({ roles, className }: HeroRoleTagsProps) {
  if (!roles || roles.length === 0) return null;

  return (
    <div className={className}>
      {roles.map((role) => (
        <Badge key={role} variant="default">
          {ROLE_NAMES[role] ?? role}
        </Badge>
      ))}
    </div>
  );
}
