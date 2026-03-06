export type AdminStatus =
  | 'updated'
  | 'deleted'
  | 'validation_error'
  | 'duplicate_keyword'
  | 'not_found'
  | 'unknown_error';

export function getAdminStatusMessage(status?: string) {
  switch (status as AdminStatus) {
    case 'updated':
      return { tone: 'success', text: 'Submission updated successfully.' };
    case 'deleted':
      return { tone: 'success', text: 'Submission deleted successfully.' };
    case 'validation_error':
      return { tone: 'error', text: 'Keyword and HTML code are required.' };
    case 'duplicate_keyword':
      return { tone: 'error', text: 'Duplicate keyword for this student. Each keyword must be unique per student.' };
    case 'not_found':
      return { tone: 'error', text: 'Submission not found.' };
    case 'unknown_error':
      return { tone: 'error', text: 'Unexpected error while saving submission changes.' };
    default:
      return null;
  }
}
