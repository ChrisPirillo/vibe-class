export type SubmitStatus =
  | 'submitted'
  | 'missing_fields'
  | 'invalid_email'
  | 'invalid_html'
  | 'duplicate_keyword'
  | 'unknown_error';

export function getSubmitStatusMessage(status?: string) {
  switch (status as SubmitStatus) {
    case 'submitted':
      return { tone: 'success', text: 'Submission received successfully.' };
    case 'missing_fields':
      return { tone: 'error', text: 'Please fill in name, email, keyword, and HTML code.' };
    case 'invalid_email':
      return { tone: 'error', text: 'Please enter a valid email address.' };
    case 'invalid_html':
      return { tone: 'error', text: 'HTML code appears invalid. Include valid HTML markup.' };
    case 'duplicate_keyword':
      return { tone: 'error', text: 'You already submitted an app for this keyword.' };
    case 'unknown_error':
      return { tone: 'error', text: 'Unexpected error while submitting. Please try again.' };
    default:
      return null;
  }
}
