import { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface DraggableAdminTableContextProps {
  items: string[];
  onReorder: (newOrder: string[]) => void;
  children: ReactNode;
}

export const DraggableAdminTableContext = ({
  items,
  onReorder,
  children,
}: DraggableAdminTableContextProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

interface DraggableAdminTableRowProps {
  id: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const DraggableAdminTableRow = ({
  id,
  children,
  className,
  onClick,
}: DraggableAdminTableRowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
    if (!onClick) return;
    const target = e.target as HTMLElement;
    const interactive = target.closest('button, a, input, select, textarea, [role="button"]');
    // Ignore if clicked on interactive element that isn't the row itself
    if (interactive && interactive !== e.currentTarget) return;
    onClick();
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={handleRowClick}
      className={cn(
        "border-b border-neutral-03 last:border-b-0 hover:bg-neutral-02/50 transition-colors",
        isDragging && "bg-neutral-02 shadow-lg z-50 opacity-90",
        onClick && "cursor-pointer",
        className
      )}
      {...attributes}
    >
      <td className="px-4 py-4">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-03 rounded transition-colors touch-none"
          {...listeners}
        >
          <DotsSixVertical size={16} className="text-neutral-08" />
        </button>
      </td>
      {children}
    </tr>
  );
};

export const DragHandleTableHead = () => (
  <th className="px-4 py-3 text-left text-caption font-medium text-neutral-10 w-12">
    <span className="sr-only">Drag handle</span>
  </th>
);
