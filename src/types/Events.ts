export interface EventFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  category: string;
  maxParticipants: number;
}

export interface EventValidationErrors {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  category?: string;
  maxParticipants?: string;
}