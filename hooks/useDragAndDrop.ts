import { useState, useCallback, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface DragState {
  isDragging: boolean;
  draggedItem: any | null;
  dragOffset: Position;
}

interface UseDragAndDropOptions {
  onDragStart?: (item: any, e: React.MouseEvent) => void;
  onDragMove?: (item: any, position: Position, e: MouseEvent) => void;
  onDragEnd?: (item: any, position: Position) => void;
  constrainToParent?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
}

export function useDragAndDrop<T>(options: UseDragAndDropOptions = {}) {
  const {
    onDragStart,
    onDragMove,
    onDragEnd,
    constrainToParent = true,
    snapToGrid = false,
    gridSize = 20,
  } = options;

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback(
    (item: T, e: React.MouseEvent) => {
      e.preventDefault();
      
      const element = e.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      
      const offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      setDragState({
        isDragging: true,
        draggedItem: item,
        dragOffset: offset,
      });

      onDragStart?.(item, e);

      // Add global event listeners
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    },
    [onDragStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedItem) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      let newX = e.clientX - containerRect.left - dragState.dragOffset.x;
      let newY = e.clientY - containerRect.top - dragState.dragOffset.y;

      // Constrain to parent bounds
      if (constrainToParent) {
        const element = document.querySelector(`[data-drag-item="${dragState.draggedItem.id}"]`) as HTMLElement;
        if (element) {
          const elementRect = element.getBoundingClientRect();
          newX = Math.max(0, Math.min(newX, containerRect.width - elementRect.width));
          newY = Math.max(0, Math.min(newY, containerRect.height - elementRect.height));
        }
      }

      // Snap to grid
      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      const position = { x: newX, y: newY };
      onDragMove?.(dragState.draggedItem, position, e);
    },
    [dragState, constrainToParent, snapToGrid, gridSize, onDragMove]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.draggedItem) return;

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      let finalX = e.clientX - containerRect.left - dragState.dragOffset.x;
      let finalY = e.clientY - containerRect.top - dragState.dragOffset.y;

      // Constrain to parent bounds
      if (constrainToParent) {
        const element = document.querySelector(`[data-drag-item="${dragState.draggedItem.id}"]`) as HTMLElement;
        if (element) {
          const elementRect = element.getBoundingClientRect();
          finalX = Math.max(0, Math.min(finalX, containerRect.width - elementRect.width));
          finalY = Math.max(0, Math.min(finalY, containerRect.height - elementRect.height));
        }
      }

      // Snap to grid
      if (snapToGrid) {
        finalX = Math.round(finalX / gridSize) * gridSize;
        finalY = Math.round(finalY / gridSize) * gridSize;
      }

      const position = { x: finalX, y: finalY };
      onDragEnd?.(dragState.draggedItem, position);

      // Clean up
      setDragState({
        isDragging: false,
        draggedItem: null,
        dragOffset: { x: 0, y: 0 },
      });

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    },
    [dragState, constrainToParent, snapToGrid, gridSize, onDragEnd, handleMouseMove]
  );

  const setContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
  }, []);

  return {
    dragState,
    handleDragStart,
    setContainer,
    containerRef,
  };
}