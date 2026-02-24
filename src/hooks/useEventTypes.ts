import { useState, useEffect, useCallback } from "react";
import { TEventType } from "@/domain/models/eventTypes";

export interface EventTypeConfig {
  id: string;
  label: string;
  color: string; // Hex color like "#FF5733"
}

export function useEventTypes(churchId?: string) {
  const [eventTypes, setEventTypes] = useState<EventTypeConfig[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch event types from API
  const fetchEventTypes = useCallback(async () => {
    if (!churchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/protected/churches/${churchId}/event-types`);
      if (response.ok) {
        const data: TEventType[] = await response.json();
        const formatted = data.map((et) => ({
          id: et._id || "",
          label: et.name,
          color: et.color,
        }));
        setEventTypes(formatted);
      }
    } catch (error) {
      console.error("Error fetching event types:", error);
    } finally {
      setLoading(false);
    }
  }, [churchId]);

  useEffect(() => {
    fetchEventTypes();
  }, [fetchEventTypes]);

  const addEventType = useCallback(
    async (type: Omit<EventTypeConfig, "id">) => {
      if (!churchId) return;

      try {
        const response = await fetch(`/api/protected/churches/${churchId}/event-types`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: type.label,
            color: type.color,
            churchId,
          }),
        });

        if (response.ok) {
          const newEventType: TEventType = await response.json();
          setEventTypes((prev) => [
            ...prev,
            {
              id: newEventType._id || "",
              label: newEventType.name,
              color: newEventType.color,
            },
          ]);
        }
      } catch (error) {
        console.error("Error adding event type:", error);
      }
    },
    [churchId]
  );

  const updateEventType = useCallback(
    async (id: string, updates: Partial<Omit<EventTypeConfig, "id">>) => {
      if (!churchId) return;

      try {
        const updateData: Partial<TEventType> = {};
        if (updates.label) updateData.name = updates.label;
        if (updates.color) updateData.color = updates.color;

        const response = await fetch(`/api/protected/churches/${churchId}/event-types/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          setEventTypes((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
          );
        }
      } catch (error) {
        console.error("Error updating event type:", error);
      }
    },
    [churchId]
  );

  const deleteEventType = useCallback(
    async (id: string) => {
      if (!churchId) return;

      try {
        const response = await fetch(`/api/protected/churches/${churchId}/event-types/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setEventTypes((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (error) {
        console.error("Error deleting event type:", error);
      }
    },
    [churchId]
  );

  const getColorMap = useCallback((): Record<string, string> => {
    return Object.fromEntries(eventTypes.map((t) => [t.id, t.color]));
  }, [eventTypes]);

  const getLabelMap = useCallback((): Record<string, string> => {
    return Object.fromEntries(eventTypes.map((t) => [t.id, t.label]));
  }, [eventTypes]);

  return { eventTypes, addEventType, updateEventType, deleteEventType, getColorMap, getLabelMap, loading };
}
